import { useMemo, useState, useRef, useEffect } from 'react'

const quickQuestions = [
  'Which course should I start?',
  'How to enroll?',
  'Do I get a certificate?',
]

export default function Chatbot() {
  const [open, setOpen] = useState(false)
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [conversationId] = useState(() => crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).substring(7))
  const [messages, setMessages] = useState([
    {
      from: 'bot',
      text: 'Hi! I am STA assistant. Ask me about courses, enrollment, or certificates.',
    },
  ])
  const messagesEndRef = useRef(null)

  const unread = useMemo(() => messages.filter((message) => message.from === 'bot').length, [messages])

  async function sendMessage(text = input) {
    if (!text.trim() || isLoading) return

    const userMessage = {
      from: 'user',
      text: text.trim(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInput('')
    setIsLoading(true)

    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8080/api'
      const res = await fetch(`${apiUrl}/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: text.trim(), conversationId }),
      })

      if (!res.ok) throw new Error('API failed')
      
      const data = await res.json()
      
      setMessages((prev) => [
        ...prev,
        { from: 'bot', text: data.reply },
      ])
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        { from: 'bot', text: "Sorry, I'm having trouble responding right now. Please try again." },
      ])
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isLoading])

  return (
    <div className="fixed bottom-5 right-5 z-50">
      {open && (
        <div className="mb-4 w-[calc(100vw-2.5rem)] max-w-sm overflow-hidden rounded-3xl border border-white/10 bg-academy-900 shadow-2xl">
          <div className="flex items-start justify-between border-b border-white/10 bg-white/[0.04] px-5 py-4">
            <div>
              <p className="font-bold text-white">STA Student Assistant</p>
              <p className="text-xs text-slate-400">Course and enrollment help</p>
            </div>
            <button 
              onClick={() => setOpen(false)}
              className="text-slate-400 transition-colors hover:text-white"
              aria-label="Close chatbot"
            >
              ✕
            </button>
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
            {isLoading && (
              <div className="mr-auto max-w-[85%] rounded-2xl bg-white/10 px-4 py-3 text-sm text-slate-200">
                <span className="animate-pulse">Typing...</span>
              </div>
            )}
            <div ref={messagesEndRef} />
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
