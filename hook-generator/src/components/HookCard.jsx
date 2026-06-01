import { useState } from 'react'

export default function HookCard({ hook }) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    await navigator.clipboard.writeText(hook.text)
    setCopied(true)
    setTimeout(() => setCopied(false), 1200)
  }

  return (
    <li className="hook-card">
      <span className="hook-label">{hook.type}</span>
      <p className="hook-text">{hook.text}</p>
      <div className="hook-meta">
        <span>Word count: {hook.words}</span>
        <button onClick={handleCopy} className="copy-btn">
          {copied ? 'Copied' : 'Copy'}
        </button>
      </div>
    </li>
  )
}
