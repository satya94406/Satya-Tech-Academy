import { useMemo, useState } from 'react'

const quickQuestions = [
  'Which course should I start?',
  'How to enroll?',
  'Do I get a certificate?',
]

function getBotReply(message) {
  const text = message.toLowerCase()

  if (text.includes('start') || text.includes('course')) {
    return 'If you are beginner, start with JavaScript + React or Java Core + Spring Boot. If your goal is full stack, choose React + Spring Boot + MySQL.'
  }

  if (text.includes('enroll') || text.includes('join')) {
    return 'Click Enroll as Student, create your account, then submit the course enrollment form from your student dashboard.'
  }

  if (text.includes('certificate')) {
    return 'Yes. After completing the course requirements, eligible students can receive a verified certificate with a unique serial number.'
  }

  if (text.includes('java') || text.includes('spring')) {
    return 'Java Spring Boot is best for backend developer jobs. You will learn REST API, JWT, MySQL, JPA, security, and deployment.'
  }

  if (text.includes('react')) {
    return 'React is best for frontend development. You will learn components, hooks, routing, forms, API calls, and project UI building.'
  }

  return 'I can help you choose a course, understand enrollment, and explain what you will learn at Satya Tech Academy.'
}

export default function Chatbot() {
  const [open, setOpen] = useState(false)
  const [input, setInput] = useState('')
  const [messages, setMessages] = useState([
    {
      from: 'bot',
      text: 'Hi! I am STA assistant. Ask me about courses, enrollment, or certificates.',
    },
  ])

  const unread = useMemo(() => messages.filter((message) => message.from === 'bot').length, [messages])

  function sendMessage(text = input) {
    if (!text.trim()) return

    const userMessage = {
      from: 'user',
      text: text.trim(),
    }

    const botMessage = {
      from: 'bot',
      text: getBotReply(text),
    }

    setMessages((prev) => [...prev, userMessage, botMessage])
    setInput('')
  }

  return (
    <div className="fixed bottom-5 right-5 z-50">
      {open && (
        <div className="mb-4 w-[calc(100vw-2.5rem)] max-w-sm overflow-hidden rounded-3xl border border-white/10 bg-academy-900 shadow-2xl">
          <div className="border-b border-white/10 bg-white/[0.04] px-5 py-4">
            <p className="font-bold text-white">STA Student Assistant</p>
            <p className="text-xs text-slate-400">Course and enrollment help</p>
          </div>

          <div className="max-h-80 space-y-3 overflow-y-auto p-4">
            {messages.map((message, index) => (
              <div
                key={`${message.from}-${index}`}
                className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                  message.from === 'user'
                    ? 'ml-auto bg-gold-500 text-black'
                    : 'mr-auto bg-white/10 text-slate-200'
                }`}
              >
                {message.text}
              </div>
            ))}
          </div>

          <div className="flex flex-wrap gap-2 border-t border-white/10 p-3">
            {quickQuestions.map((question) => (
              <button
                key={question}
                onClick={() => sendMessage(question)}
                className="rounded-full border border-white/10 px-3 py-1 text-xs text-slate-300 hover:bg-white/10"
              >
                {question}
              </button>
            ))}
          </div>

          <div className="flex gap-2 border-t border-white/10 p-3">
            <input
              value={input}
              onChange={(event) => setInput(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === 'Enter') sendMessage()
              }}
              placeholder="Ask about courses..."
              className="input-pro py-2"
            />
            <button onClick={() => sendMessage()} className="btn-primary px-4 py-2">
              Send
            </button>
          </div>
        </div>
      )}

      <button
        onClick={() => setOpen((value) => !value)}
        className="relative h-14 w-14 rounded-full bg-gradient-to-r from-gold-500 to-gold-600 text-2xl shadow-glow transition hover:-translate-y-1"
      >
        💬
        {!open && unread > 0 && (
          <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white">
            {unread}
          </span>
        )}
      </button>
    </div>
  )
}
