import { useState, useRef, useEffect } from "react";

// ─────────────────────────────────────────────────────────────────────────────
// CONFIGURACIÓN DEL BOT
// ─────────────────────────────────────────────────────────────────────────────
const BOT_NAME = "Laura";
const BOT_SUBTITLE = "Asistente de confianza";
const BOT_AVATAR = "/chibifox.png";

// ─────────────────────────────────────────────────────────────────────────────
// RESPUESTAS FIJAS
// Fase 1: no usa API, no consume dinero, funciona solo con respuestas locales.
// ─────────────────────────────────────────────────────────────────────────────
const FAQ = [
  {
    keywords: [
      "test",
      "prueba",
      "gratuito",
      "gratis",
      "cuánto dura",
      "cuanto dura",
      "tiempo",
      "minutos",
    ],
    answer:
      "El **Test Inicial de Confianza Social** es gratuito y tarda aproximadamente **2 minutos**. Te ayuda a identificar qué puede estar bloqueando tu confianza al hablar o relacionarte.",
  },
  {
    keywords: [
      "precio",
      "costo",
      "coste",
      "cuánto cuesta",
      "cuanto cuesta",
      "pagar",
      "pago",
      "tarifa",
    ],
    answer:
      "Por ahora, el test inicial es **gratuito**. Si más adelante hay sesiones, planes o acompañamiento personalizado, podrás conocer los detalles desde los canales de contacto de la página.",
  },
  {
    keywords: [
      "privado",
      "privacidad",
      "datos",
      "información",
      "informacion",
      "compartir",
      "seguro",
      "confidencial",
    ],
    answer:
      "Tu información debe manejarse con cuidado y confidencialidad. La idea es que puedas iniciar el proceso en un espacio seguro, sin presión y con orientación clara.",
  },
  {
    keywords: [
      "autoestima",
      "seguridad",
      "seguro",
      "inseguro",
      "inseguridad",
      "confianza",
      "valorarme",
      "quererme",
    ],
    answer:
      "La confianza se construye paso a paso. Atrévete a Hablar busca ayudarte a reconocer tus bloqueos, practicar tu comunicación y empezar con acciones pequeñas pero constantes.",
  },
  {
    keywords: [
      "vergüenza",
      "verguenza",
      "miedo",
      "nervios",
      "pánico",
      "panico",
      "hablar en público",
      "hablar en publico",
      "publico",
      "exponer",
      "exposicion",
      "exposición",
    ],
    answer:
      "Sentir miedo o vergüenza al hablar es más común de lo que parece. Lo importante es no quedarte ahí: puedes empezar con pasos pequeños, ejercicios guiados y práctica progresiva.",
  },
  {
    keywords: [
      "qué es",
      "que es",
      "de qué trata",
      "de que trata",
      "en qué consiste",
      "en que consiste",
      "programa",
      "cómo funciona",
      "como funciona",
      "atrevete",
      "atrévete",
    ],
    answer:
      "**Atrévete a Hablar** es una propuesta enfocada en fortalecer la confianza social, la autoestima y la comunicación. Te ayuda a dar el primer paso para expresarte con mayor seguridad.",
  },
  {
    keywords: [
      "hola",
      "buenas",
      "buenos días",
      "buenos dias",
      "buenas tardes",
      "buenas noches",
      "hey",
      "hi",
    ],
    answer:
      `¡Hola! 👋 Soy **${BOT_NAME}**, el asistente de Atrévete a Hablar. Puedo ayudarte con dudas sobre el test gratuito, confianza social, privacidad o cómo funciona la propuesta.`,
  },
  {
    keywords: [
      "contacto",
      "whatsapp",
      "correo",
      "email",
      "información",
      "informacion",
      "quiero saber más",
      "quiero saber mas",
      "registrarme",
      "registro",
      "inscribirme",
    ],
    answer:
      "Puedes dejar tus datos en el formulario de la landing o usar los canales de contacto disponibles en la página. Así podrán brindarte más información.",
  },
  {
    keywords: [
      "gracias",
      "thank",
      "genial",
      "perfecto",
      "ok",
      "entendido",
      "listo",
    ],
    answer:
      "¡De nada! 😊 Estoy aquí para ayudarte. También puedes empezar con el test gratuito si quieres conocer mejor tu nivel de confianza social.",
  },
];

const SUGGESTED_QUESTIONS = [
  "¿En qué consiste el test gratuito?",
  "¿Cómo mejoro mi confianza?",
  "Siento vergüenza al hablar",
  "¿Es privado el test?",
];

const WELCOME_MESSAGE = {
  role: "model",
  content:
    `¡Hola! 👋 Soy **${BOT_NAME}**, tu asistente de **Atrévete a Hablar**. Puedo contarte sobre el test gratuito, la confianza social o cómo funciona la propuesta. ¿Por dónde empezamos?`,
  showOptions: true,
};

// ─────────────────────────────────────────────────────────────────────────────
// UTILIDADES
// ─────────────────────────────────────────────────────────────────────────────
function normalizeText(text) {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

function findFaqAnswer(text) {
  const lower = normalizeText(text);

  for (const faq of FAQ) {
    const hasMatch = faq.keywords.some((keyword) =>
      lower.includes(normalizeText(keyword))
    );

    if (hasMatch) {
      return faq.answer;
    }
  }

  return null;
}

function isMenuRequest(text) {
  const lower = normalizeText(text);

  return (
    lower.includes("menu") ||
    lower.includes("inicio") ||
    lower.includes("opciones") ||
    lower.includes("ayuda")
  );
}

function escapeHtml(text) {
  return text
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function parseMarkdown(text) {
  const safeText = escapeHtml(text);

  return safeText
    .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
    .replace(/\*(.*?)\*/g, "<em>$1</em>")
    .replace(/\n/g, "<br/>");
}

// ─────────────────────────────────────────────────────────────────────────────
// COMPONENTE
// ─────────────────────────────────────────────────────────────────────────────
export default function ChatBot() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([WELCOME_MESSAGE]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [pulse, setPulse] = useState(true);

  const bottomRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    const timer = setTimeout(() => setPulse(false), 4500);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 120);
    }
  }, [open]);

  function getFallbackAnswer() {
    return {
      content:
        "Por ahora puedo ayudarte con información básica sobre Atrévete a Hablar, el test gratuito, privacidad, confianza social y contacto. Puedes elegir una de las opciones rápidas para continuar.",
      showOptions: true,
    };
  }

  function sendMessage(text) {
    const userText = (text || input).trim();

    if (!userText || loading) return;

    setMessages((prev) => [
      ...prev,
      {
        role: "user",
        content: userText,
        showOptions: false,
      },
    ]);

    setInput("");
    setLoading(true);

    setTimeout(() => {
      const faqAnswer = findFaqAnswer(userText);
      const fallbackAnswer = getFallbackAnswer();
      const shouldShowMenu = isMenuRequest(userText);

      let botMessage;

      if (shouldShowMenu) {
        botMessage = {
          role: "model",
          content: "Claro 😊 Estas son las opciones rápidas que puedo mostrarte:",
          showOptions: true,
        };
      } else if (faqAnswer) {
        botMessage = {
          role: "model",
          content: faqAnswer,
          showOptions: false,
        };
      } else {
        botMessage = {
          role: "model",
          content: fallbackAnswer.content,
          showOptions: fallbackAnswer.showOptions,
        };
      }

      setMessages((prev) => [...prev, botMessage]);
      setLoading(false);
    }, 450);
  }

  function handleKey(e) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  }

  const lastMessage = messages[messages.length - 1];

  const showSuggestions =
    messages.length === 1 ||
    (lastMessage?.role === "model" && lastMessage?.showOptions);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800;900&display=swap');

        .atb * {
          box-sizing: border-box;
          font-family: 'Nunito', sans-serif;
        }

        .atb-fab {
          position: fixed;
          bottom: 28px;
          right: 28px;
          width: 68px;
          height: 68px;
          border-radius: 50%;
          border: none;
          cursor: pointer;
          z-index: 9999;
          color: white;
          font-size: 24px;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 8px 28px rgba(123, 47, 247, 0.42);
          transition: transform 0.2s ease, box-shadow 0.2s ease;
          background: linear-gradient(135deg, #E040FB 0%, #7B2FF7 60%, #38BDF8 100%);
          padding: 6px;
          overflow: hidden;
        }

        .atb-fab:hover {
          transform: scale(1.07);
          box-shadow: 0 10px 36px rgba(224, 64, 251, 0.5);
        }

        .atb-fab.pulse {
          animation: atb-pulse 2s ease-in-out 3;
        }

        .atb-fab-img {
          width: 100%;
          height: 100%;
          object-fit: contain;
          border-radius: 50%;
        }

        @keyframes atb-pulse {
          0%, 100% {
            box-shadow: 0 8px 28px rgba(123, 47, 247, 0.42);
          }

          50% {
            box-shadow:
              0 8px 36px rgba(224, 64, 251, 0.65),
              0 0 0 12px rgba(224, 64, 251, 0.12);
          }
        }

        .atb-window {
          position: fixed;
          bottom: 108px;
          right: 28px;
          width: 368px;
          max-height: 580px;
          border-radius: 24px;
          overflow: hidden;
          z-index: 9998;
          display: flex;
          flex-direction: column;
          box-shadow:
            0 24px 64px rgba(123, 47, 247, 0.18),
            0 4px 16px rgba(0, 0, 0, 0.08);
          transform: scale(0.88) translateY(16px);
          opacity: 0;
          pointer-events: none;
          transition:
            transform 0.28s cubic-bezier(0.34, 1.56, 0.64, 1),
            opacity 0.2s ease;
          border: 1px solid rgba(224, 64, 251, 0.15);
          background: white;
        }

        .atb-window.open {
          transform: scale(1) translateY(0);
          opacity: 1;
          pointer-events: all;
        }

        .atb-header {
          padding: 16px 18px;
          display: flex;
          align-items: center;
          gap: 12px;
          color: white;
          background: linear-gradient(135deg, #E040FB 0%, #7B2FF7 100%);
          position: relative;
          overflow: hidden;
        }

        .atb-header::after {
          content: "";
          position: absolute;
          top: -30px;
          right: -20px;
          width: 100px;
          height: 100px;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.08);
        }

        .atb-avatar {
          width: 46px;
          height: 46px;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.22);
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          border: 1.5px solid rgba(255, 255, 255, 0.3);
          overflow: hidden;
          padding: 3px;
          z-index: 1;
        }

        .atb-avatar img {
          width: 100%;
          height: 100%;
          object-fit: contain;
          border-radius: 50%;
        }

        .atb-header-info {
          flex: 1;
          z-index: 1;
        }

        .atb-header-name {
          font-weight: 900;
          font-size: 16px;
          letter-spacing: -0.2px;
        }

        .atb-header-tag {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          background: rgba(255, 255, 255, 0.2);
          border-radius: 20px;
          padding: 2px 9px;
          font-size: 11px;
          font-weight: 700;
          margin-top: 3px;
        }

        .atb-online {
          width: 7px;
          height: 7px;
          border-radius: 50%;
          background: #4ADE80;
          animation: atb-blink 2s infinite;
        }

        @keyframes atb-blink {
          0%, 100% {
            opacity: 1;
          }

          50% {
            opacity: 0.35;
          }
        }

        .atb-close {
          background: rgba(255, 255, 255, 0.18);
          border: none;
          color: white;
          width: 32px;
          height: 32px;
          border-radius: 50%;
          cursor: pointer;
          font-size: 14px;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: background 0.15s;
          flex-shrink: 0;
          z-index: 1;
        }

        .atb-close:hover {
          background: rgba(255, 255, 255, 0.32);
        }

        .atb-messages {
          flex: 1;
          overflow-y: auto;
          padding: 18px 14px 10px;
          background: #F8F5FF;
          display: flex;
          flex-direction: column;
          gap: 10px;
          scrollbar-width: thin;
          scrollbar-color: #e0d4ff transparent;
        }

        .atb-row {
          display: flex;
          gap: 8px;
          align-items: flex-end;
        }

        .atb-row.user {
          flex-direction: row-reverse;
        }

        .atb-icon {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          flex-shrink: 0;
          background: linear-gradient(135deg, #E040FB, #7B2FF7);
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 2px 8px rgba(123, 47, 247, 0.25);
          overflow: hidden;
          padding: 2px;
        }

        .atb-icon img {
          width: 100%;
          height: 100%;
          object-fit: contain;
          border-radius: 50%;
        }

        .atb-bubble {
          max-width: 82%;
          padding: 10px 14px;
          font-size: 14px;
          line-height: 1.6;
          animation: atb-pop 0.22s ease;
        }

        @keyframes atb-pop {
          from {
            opacity: 0;
            transform: translateY(8px) scale(0.96);
          }
        }

        .atb-bubble.bot {
          background: white;
          color: #1a0a2e;
          border-radius: 18px 18px 18px 4px;
          box-shadow: 0 2px 12px rgba(123, 47, 247, 0.09);
          border: 1px solid rgba(123, 47, 247, 0.1);
        }

        .atb-bubble.user {
          background: linear-gradient(135deg, #E040FB 0%, #7B2FF7 100%);
          color: white;
          border-radius: 18px 18px 4px 18px;
          box-shadow: 0 2px 12px rgba(224, 64, 251, 0.3);
        }

        .atb-typing {
          display: flex;
          gap: 5px;
          padding: 4px 2px;
        }

        .atb-typing span {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: linear-gradient(135deg, #E040FB, #7B2FF7);
          animation: atb-bounce 1.1s infinite ease-in-out;
        }

        .atb-typing span:nth-child(2) {
          animation-delay: 0.18s;
        }

        .atb-typing span:nth-child(3) {
          animation-delay: 0.36s;
        }

        @keyframes atb-bounce {
          0%, 80%, 100% {
            transform: translateY(0);
            opacity: 0.6;
          }

          40% {
            transform: translateY(-7px);
            opacity: 1;
          }
        }

        .atb-chips {
          padding: 4px 14px 12px;
          display: flex;
          flex-wrap: wrap;
          gap: 7px;
          background: #F8F5FF;
        }

        .atb-chip {
          border: 1.5px solid rgba(123, 47, 247, 0.3);
          background: white;
          color: #7B2FF7;
          border-radius: 20px;
          padding: 5px 13px;
          font-size: 12.5px;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.15s;
          font-family: 'Nunito', sans-serif;
          box-shadow: 0 1px 4px rgba(123, 47, 247, 0.08);
        }

        .atb-chip:hover {
          background: linear-gradient(135deg, #E040FB, #7B2FF7);
          color: white;
          border-color: transparent;
          box-shadow: 0 3px 12px rgba(224, 64, 251, 0.3);
          transform: translateY(-1px);
        }

        .atb-footer {
          padding: 12px 14px;
          background: white;
          border-top: 1px solid rgba(123, 47, 247, 0.1);
          display: flex;
          gap: 8px;
          align-items: center;
        }

        .atb-input {
          flex: 1;
          border: 1.5px solid #E8DCFF;
          border-radius: 14px;
          padding: 10px 14px;
          font-size: 14px;
          outline: none;
          font-family: 'Nunito', sans-serif;
          color: #1a0a2e;
          background: #F8F5FF;
          resize: none;
          max-height: 80px;
          transition: border-color 0.15s, box-shadow 0.15s;
          line-height: 1.4;
        }

        .atb-input:focus {
          border-color: #C084FC;
          box-shadow: 0 0 0 3px rgba(192, 132, 252, 0.18);
          background: white;
        }

        .atb-input::placeholder {
          color: #C4A8F0;
        }

        .atb-send {
          width: 42px;
          height: 42px;
          border-radius: 50%;
          border: none;
          background: linear-gradient(135deg, #E040FB 0%, #7B2FF7 100%);
          color: white;
          cursor: pointer;
          font-size: 15px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          box-shadow: 0 3px 12px rgba(224, 64, 251, 0.4);
          transition: transform 0.15s, opacity 0.15s, box-shadow 0.15s;
        }

        .atb-send:hover:not(:disabled) {
          transform: scale(1.08);
          box-shadow: 0 4px 16px rgba(224, 64, 251, 0.55);
        }

        .atb-send:disabled {
          opacity: 0.45;
          cursor: default;
          box-shadow: none;
        }

        @media (max-width: 420px) {
          .atb-window {
            width: calc(100vw - 24px);
            right: 12px;
            bottom: 98px;
          }

          .atb-fab {
            right: 12px;
            bottom: 20px;
          }
        }
      `}</style>

      <div className="atb">
        <button
          className={`atb-fab ${pulse ? "pulse" : ""}`}
          onClick={() => setOpen((value) => !value)}
          aria-label={open ? "Cerrar chat" : "Abrir chat"}
        >
          {open ? (
            "✕"
          ) : (
            <img
              src={BOT_AVATAR}
              alt={BOT_NAME}
              className="atb-fab-img"
            />
          )}
        </button>

        <div
          className={`atb-window ${open ? "open" : ""}`}
          role="dialog"
          aria-label={`Asistente ${BOT_NAME}`}
        >
          <div className="atb-header">
            <div className="atb-avatar">
              <img src={BOT_AVATAR} alt={BOT_NAME} />
            </div>

            <div className="atb-header-info">
              <div className="atb-header-name">{BOT_NAME}</div>

              <div className="atb-header-tag">
                <span className="atb-online" />
                {BOT_SUBTITLE}
              </div>
            </div>

            <button
              className="atb-close"
              onClick={() => setOpen(false)}
              aria-label="Cerrar"
            >
              ✕
            </button>
          </div>

          <div className="atb-messages">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`atb-row ${msg.role === "user" ? "user" : ""}`}
              >
                {msg.role !== "user" && (
                  <div className="atb-icon">
                    <img src={BOT_AVATAR} alt={BOT_NAME} />
                  </div>
                )}

                <div
                  className={`atb-bubble ${
                    msg.role === "user" ? "user" : "bot"
                  }`}
                  dangerouslySetInnerHTML={{
                    __html: parseMarkdown(msg.content),
                  }}
                />
              </div>
            ))}

            {loading && (
              <div className="atb-row">
                <div className="atb-icon">
                  <img src={BOT_AVATAR} alt={BOT_NAME} />
                </div>

                <div className="atb-bubble bot">
                  <div className="atb-typing">
                    <span />
                    <span />
                    <span />
                  </div>
                </div>
              </div>
            )}

            <div ref={bottomRef} />
          </div>

          {showSuggestions && (
            <div className="atb-chips">
              {SUGGESTED_QUESTIONS.map((question) => (
                <button
                  key={question}
                  className="atb-chip"
                  onClick={() => sendMessage(question)}
                >
                  {question}
                </button>
              ))}
            </div>
          )}

          <div className="atb-footer">
            <textarea
              ref={inputRef}
              className="atb-input"
              placeholder="Escribe tu pregunta..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKey}
              rows={1}
              disabled={loading}
            />

            <button
              className="atb-send"
              onClick={() => sendMessage()}
              disabled={loading || !input.trim()}
              aria-label="Enviar"
            >
              ➤
            </button>
          </div>
        </div>
      </div>
    </>
  );
}