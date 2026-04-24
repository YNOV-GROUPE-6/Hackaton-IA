import { useState, useRef, useEffect } from 'react'
import styles from './App.module.css'

interface Message {
  role: 'user' | 'assistant'
  content: string
}

function renderInline(text: string): React.ReactNode[] {
  const parts = text.split(/(\*\*[^*]+\*\*)/g)
  return parts.map((part, i) =>
    part.startsWith('**') && part.endsWith('**')
      ? <strong key={i}>{part.slice(2, -2)}</strong>
      : part
  )
}

function MarkdownBlock({ content }: { content: string }) {
  const lines = content.split('\n')
  const nodes: React.ReactNode[] = []
  let listItems: string[] = []

  function flushList() {
    if (listItems.length === 0) return
    nodes.push(
      <ol key={nodes.length} className={styles.mdList}>
        {listItems.map((item, i) => <li key={i}>{renderInline(item)}</li>)}
      </ol>
    )
    listItems = []
  }

  for (const line of lines) {
    const numbered = line.match(/^\d+\.\s+(.*)/)
    const bullet = line.match(/^[-*]\s+(.*)/)
    if (numbered) {
      listItems.push(numbered[1])
    } else if (bullet) {
      listItems.push(bullet[1])
    } else {
      flushList()
      if (line.trim()) {
        nodes.push(<p key={nodes.length}>{renderInline(line)}</p>)
      }
    }
  }
  flushList()

  return <>{nodes}</>
}

export default function App() {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, loading])

  async function sendMessage(e: React.FormEvent) {
    e.preventDefault()
    const prompt = input.trim()
    if (!prompt || loading) return

    setInput('')
    setMessages(prev => [...prev, { role: 'user', content: prompt }])
    setLoading(true)

    try {
      const res = await fetch('/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt }),
      })

      if (!res.ok) throw new Error(`Erreur ${res.status}`)

      const data = await res.json()
      setMessages(prev => [...prev, { role: 'assistant', content: data.response }])
    } catch (err) {
      setMessages(prev => [
        ...prev,
        { role: 'assistant', content: "Une erreur s'est produite. Veuillez réessayer." },
      ])
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={styles.layout}>
      <header className={styles.header}>
        <div className={styles.logo}>
          <span className={styles.logoIcon}>TC</span>
          <div>
            <div className={styles.logoName}>TechCorp</div>
            <div className={styles.logoSub}>Assistant IA Financier</div>
          </div>
        </div>
        <span className={styles.badge}>phi3-financial</span>
      </header>

      <main className={styles.chat}>
        {messages.length === 0 && (
          <div className={styles.empty}>
            <div className={styles.emptyIcon}>💬</div>
            <p>Posez une question financière pour commencer.</p>
            <div className={styles.suggestions}>
              {[
                'Explique-moi le concept de diversification de portefeuille',
                'Quels sont les risques des obligations à haut rendement ?',
                'Comment fonctionne le marché des changes ?',
              ].map(s => (
                <button
                  key={s}
                  className={styles.suggestion}
                  onClick={() => setInput(s)}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        )}

        {messages.map((msg, i) => (
          <div
            key={i}
            className={`${styles.message} ${msg.role === 'user' ? styles.user : styles.assistant}`}
          >
            <div className={styles.avatar}>
              {msg.role === 'user' ? 'Vous' : 'IA'}
            </div>
            <div className={styles.bubble}>
              {msg.role === 'assistant'
                ? <MarkdownBlock content={msg.content} />
                : <p>{msg.content}</p>
              }
            </div>
          </div>
        ))}

        {loading && (
          <div className={`${styles.message} ${styles.assistant}`}>
            <div className={styles.avatar}>IA</div>
            <div className={`${styles.bubble} ${styles.typing}`}>
              <span /><span /><span />
            </div>
          </div>
        )}

        <div ref={bottomRef} />
      </main>

      <form className={styles.form} onSubmit={sendMessage}>
        <input
          className={styles.input}
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder="Posez votre question financière…"
          disabled={loading}
          maxLength={2000}
        />
        <button className={styles.send} type="submit" disabled={!input.trim() || loading}>
          Envoyer
        </button>
      </form>
    </div>
  )
}
