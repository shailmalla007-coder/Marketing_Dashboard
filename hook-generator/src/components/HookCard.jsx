import { useState } from 'react'

export default function HookCard({ hook }) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(hook.text)
      setCopied(true)
      setTimeout(() => setCopied(false), 1200)
    } catch (err) {
      console.log('Copy failed:', err)
    }
  }

  return (
    <li className="hook-card">
      <span className="hook-label">{hook.type}</span>
      <p className="hook-text">{hook.text}</p>
      <div className="hook-meta">
        <span>📊 {hook.words} words</span>
        <button onClick={handleCopy} className="copy-btn" title="Copy to clipboard">
          {copied ? '✓ Copied' : '📋 Copy'}
        </button>
      </div>
    </li>
  )
}
