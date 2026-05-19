/*
 * Unfold AI-adviseur widget
 * Embed op iedere website met:
 *   <script src="https://drukwerkadviseur.offertio.io/widget.js" async></script>
 *
 * Toont een drijvende chat-knop rechtsonder. Bij klikken opent een paneel
 * dat praat met /api/ai-advisor (zelfde backend, KB en system prompt als de
 * mockup-site). Volledig in Shadow DOM, dus geen CSS-conflicten met de
 * host-site.
 */
(function () {
  if (window.__unfoldAdviseur) return;
  window.__unfoldAdviseur = true;

  var script = document.currentScript;
  var apiBase;
  try {
    apiBase = new URL(script.src).origin;
  } catch (e) {
    apiBase = "https://drukwerkadviseur.offertio.io";
  }
  var apiUrl = apiBase + "/api/ai-advisor";

  var INTRO =
    "Hoi! Ik ben de Unfold AI-adviseur. Vertel me wat je wil printen (project, omgeving, oplage, levensduur) en ik adviseer het juiste materiaal en techniek.";

  var ACCENT = "#D55B36";
  var DARK = "#1F1B16";
  var LIGHT_BG = "#FAF8F4";
  var BORDER = "#E5E1D9";

  function mount() {
    var host = document.createElement("div");
    host.id = "unfold-adviseur-root";
    host.style.cssText = "all:initial;position:fixed;z-index:2147483646;";
    document.body.appendChild(host);

    var root = host.attachShadow({ mode: "closed" });
    root.innerHTML =
      "<style>" +
      ":host,*{box-sizing:border-box;font-family:-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,sans-serif;}" +
      ".btn{position:fixed;right:24px;bottom:24px;width:56px;height:56px;border-radius:50%;background:" + ACCENT + ";color:#fff;border:none;cursor:pointer;box-shadow:0 4px 16px rgba(0,0,0,.18);display:flex;align-items:center;justify-content:center;transition:transform .15s ease;z-index:2147483647;}" +
      ".btn:hover{transform:scale(1.05);}" +
      ".btn svg{width:26px;height:26px;}" +
      ".panel{position:fixed;right:24px;bottom:24px;width:380px;max-width:calc(100vw - 32px);height:600px;max-height:calc(100vh - 48px);background:#fff;border-radius:16px;box-shadow:0 20px 50px rgba(0,0,0,.22);display:none;flex-direction:column;overflow:hidden;border:1px solid " + BORDER + ";z-index:2147483647;}" +
      ".panel.open{display:flex;}" +
      ".head{background:" + DARK + ";color:#fff;padding:14px 16px;display:flex;align-items:center;justify-content:space-between;}" +
      ".title{font-size:15px;font-weight:600;}" +
      ".sub{font-size:11px;opacity:.7;margin-top:2px;}" +
      ".close{background:none;border:none;color:#fff;cursor:pointer;padding:4px;border-radius:6px;}" +
      ".close:hover{background:rgba(255,255,255,.1);}" +
      ".msgs{flex:1;overflow-y:auto;padding:16px;background:" + LIGHT_BG + ";display:flex;flex-direction:column;gap:10px;}" +
      ".row{display:flex;}" +
      ".row.user{justify-content:flex-end;}" +
      ".bubble{max-width:85%;padding:10px 12px;border-radius:12px;font-size:14px;line-height:1.45;white-space:pre-wrap;word-wrap:break-word;}" +
      ".user .bubble{background:" + ACCENT + ";color:#fff;border-bottom-right-radius:4px;}" +
      ".assistant .bubble{background:#fff;color:" + DARK + ";border:1px solid " + BORDER + ";border-bottom-left-radius:4px;}" +
      ".typing{display:inline-block;}" +
      ".typing span{display:inline-block;width:6px;height:6px;background:#999;border-radius:50%;margin:0 1px;animation:blink 1.4s infinite both;}" +
      ".typing span:nth-child(2){animation-delay:.2s;}" +
      ".typing span:nth-child(3){animation-delay:.4s;}" +
      "@keyframes blink{0%,80%,100%{opacity:.2;}40%{opacity:1;}}" +
      ".form{display:flex;gap:8px;padding:12px;border-top:1px solid " + BORDER + ";background:#fff;}" +
      ".form textarea{flex:1;resize:none;border:1px solid " + BORDER + ";border-radius:10px;padding:9px 12px;font-size:14px;font-family:inherit;outline:none;max-height:100px;min-height:40px;color:" + DARK + ";}" +
      ".form textarea:focus{border-color:" + ACCENT + ";}" +
      ".form button{background:" + ACCENT + ";color:#fff;border:none;border-radius:10px;padding:0 16px;cursor:pointer;font-weight:600;font-size:14px;}" +
      ".form button:disabled{opacity:.5;cursor:not-allowed;}" +
      ".branding{padding:6px 12px 8px;font-size:10px;color:#999;text-align:center;background:#fff;border-top:1px solid " + BORDER + ";}" +
      ".branding a{color:#999;text-decoration:none;}" +
      "@media (max-width:480px){.panel{right:8px;bottom:8px;width:calc(100vw - 16px);height:calc(100vh - 16px);max-height:none;}.btn{right:16px;bottom:16px;}}" +
      "</style>" +
      "<button class='btn' id='openBtn' aria-label='Open AI-adviseur'>" +
      "<svg viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'><path d='M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z'></path></svg>" +
      "</button>" +
      "<div class='panel' id='panel' role='dialog' aria-label='Unfold AI-adviseur'>" +
      "<div class='head'>" +
      "<div><div class='title'>Unfold AI-adviseur</div><div class='sub'>Materiaal- en techniekadvies</div></div>" +
      "<button class='close' id='closeBtn' aria-label='Sluiten'><svg width='18' height='18' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2'><path d='M18 6 6 18M6 6l12 12'/></svg></button>" +
      "</div>" +
      "<div class='msgs' id='msgs'></div>" +
      "<form class='form' id='form'>" +
      "<textarea id='input' rows='1' placeholder='Wat wil je printen?' required></textarea>" +
      "<button type='submit' id='send'>Stuur</button>" +
      "</form>" +
      "<div class='branding'>Powered by <a href='https://offertio.io' target='_blank' rel='noopener'>Offertio.io</a></div>" +
      "</div>";

    var panel = root.getElementById("panel");
    var openBtn = root.getElementById("openBtn");
    var closeBtn = root.getElementById("closeBtn");
    var msgsEl = root.getElementById("msgs");
    var form = root.getElementById("form");
    var input = root.getElementById("input");
    var sendBtn = root.getElementById("send");

    var history = [];
    var opened = false;

    function open() {
      panel.classList.add("open");
      openBtn.style.display = "none";
      opened = true;
      if (history.length === 0) {
        appendAssistant(INTRO);
        history.push({ role: "assistant", content: INTRO });
      }
      setTimeout(function () { input.focus(); }, 50);
    }

    function close() {
      panel.classList.remove("open");
      openBtn.style.display = "";
    }

    openBtn.addEventListener("click", open);
    closeBtn.addEventListener("click", close);

    function escapeHtml(s) {
      return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
    }

    function appendUser(text) {
      var row = document.createElement("div");
      row.className = "row user";
      row.innerHTML = "<div class='bubble'>" + escapeHtml(text) + "</div>";
      msgsEl.appendChild(row);
      msgsEl.scrollTop = msgsEl.scrollHeight;
    }

    function appendAssistant(text) {
      var row = document.createElement("div");
      row.className = "row assistant";
      row.innerHTML = "<div class='bubble'>" + escapeHtml(text) + "</div>";
      msgsEl.appendChild(row);
      msgsEl.scrollTop = msgsEl.scrollHeight;
      return row.querySelector(".bubble");
    }

    function appendTyping() {
      var row = document.createElement("div");
      row.className = "row assistant";
      row.innerHTML = "<div class='bubble'><span class='typing'><span></span><span></span><span></span></span></div>";
      msgsEl.appendChild(row);
      msgsEl.scrollTop = msgsEl.scrollHeight;
      return row;
    }

    async function send(text) {
      appendUser(text);
      history.push({ role: "user", content: text });
      input.value = "";
      input.style.height = "";
      sendBtn.disabled = true;

      var typingRow = appendTyping();
      var assistantBubble = null;
      var assistantText = "";

      try {
        var resp = await fetch(apiUrl, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ messages: history }),
        });

        if (!resp.ok || !resp.body) {
          typingRow.remove();
          var errMsg = resp.status === 429
            ? "Even rustig, te veel verzoeken op het moment. Probeer het zo opnieuw."
            : "Er ging iets mis. Probeer het opnieuw of bel 023-5290308.";
          appendAssistant(errMsg);
          return;
        }

        var reader = resp.body.getReader();
        var decoder = new TextDecoder();
        var buffer = "";
        while (true) {
          var chunk = await reader.read();
          if (chunk.done) break;
          buffer += decoder.decode(chunk.value, { stream: true });

          var nl;
          while ((nl = buffer.indexOf("\n")) !== -1) {
            var line = buffer.slice(0, nl);
            buffer = buffer.slice(nl + 1);
            if (line.endsWith("\r")) line = line.slice(0, -1);
            if (!line.startsWith("data: ")) continue;
            var json = line.slice(6).trim();
            if (json === "[DONE]") continue;
            try {
              var parsed = JSON.parse(json);
              var delta = parsed.choices && parsed.choices[0] && parsed.choices[0].delta && parsed.choices[0].delta.content;
              if (delta) {
                if (!assistantBubble) {
                  typingRow.remove();
                  assistantBubble = appendAssistant("");
                }
                assistantText += delta;
                assistantBubble.textContent = assistantText;
                msgsEl.scrollTop = msgsEl.scrollHeight;
              }
            } catch (_) {}
          }
        }

        if (assistantText) {
          history.push({ role: "assistant", content: assistantText });
        } else {
          typingRow.remove();
          appendAssistant("Sorry, ik kreeg geen antwoord. Probeer het opnieuw.");
        }
      } catch (err) {
        typingRow.remove();
        appendAssistant("Verbinding mislukt. Controleer je internet en probeer opnieuw.");
      } finally {
        sendBtn.disabled = false;
        input.focus();
      }
    }

    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var v = input.value.trim();
      if (!v || sendBtn.disabled) return;
      send(v);
    });

    input.addEventListener("keydown", function (e) {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        form.dispatchEvent(new Event("submit", { cancelable: true }));
      }
    });

    input.addEventListener("input", function () {
      input.style.height = "auto";
      input.style.height = Math.min(input.scrollHeight, 100) + "px";
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", mount);
  } else {
    mount();
  }
})();
