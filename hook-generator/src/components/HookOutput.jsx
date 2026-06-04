import { useState } from 'react'

const typeColors = { 'Question': '#3B82F6', 'Shock': '#EF4444', 'Curiosity': '#A855F7', 'Bold Claim': '#10B981', 'Story': '#F97316' }
const consensusColors = { 'Strong': '#10B981', 'Medium': '#F59E0B', 'Weak': '#6B7280' }

export default function HookOutput({ data, onRegenerate, loading }) {
  const [copiedId, setCopiedId] = useState(null)
  const [exportMessage, setExportMessage] = useState(null)

  const handleCopyHook = async (hook, index) => {
    try {
      await navigator.clipboard.writeText(hook)
      setCopiedId(index)
      setTimeout(() => setCopiedId(null), 2000)
    } catch (err) {
      console.error('Copy failed:', err)
    }
  }

  const handleExportJSON = async () => {
    try {
      await navigator.clipboard.writeText(JSON.stringify(data, null, 2))
      setExportMessage('✓ JSON copied to clipboard!')
      setTimeout(() => setExportMessage(null), 2000)
    } catch (err) {
      console.error('Export failed:', err)
    }
  }

  return (
    <div className="output output-active">
      <div className="output-section fade-in">
        <h3 className="section-heading">📍 What the AI Understood</h3>
        <div className="problem-card"><p>{data.problem_definition}</p></div>
      </div>

      <div className="output-section fade-in" style={{ animationDelay: '0.1s' }}>
        <h3 className="section-heading">🎯 How the AI is Approaching This</h3>
        <ul className="breakdown-list">
          {data.solution_breakdown.map((item, index) => (
            <li key={index} className="breakdown-item"><span className="breakdown-number">{index + 1}</span><span>{item}</span></li>
          ))}
        </ul>
      </div>

      <div className="output-section fade-in" style={{ animationDelay: '0.2s' }}>
        <h3 className="section-heading">✨ Your Generated Hooks ({data.hooks.length})</h3>
        <div className="hooks-grid">
          {data.hooks.map((hookData, index) => (
            <div key={index} className="hook-card-enhanced">
              <div className="hook-header">
                <span className="type-badge" style={{ backgroundColor: typeColors[hookData.type] || '#3B82F6' }}>{hookData.type}</span>
                <span className="consensus-badge" style={{ backgroundColor: consensusColors[hookData.expert_consensus] || '#6B7280' }}>{hookData.expert_consensus} Consensus</span>
              </div>
              <p className="hook-text">{hookData.hook}</p>
              <div className="hook-footer">
                <div className="hook-meta">
                  <span className="reasoning">💡 {hookData.reasoning}</span>
                  {hookData.needs_source && <span className="needs-source">⚠️ Needs Source</span>}
                </div>
                <button className="copy-btn" onClick={() => handleCopyHook(hookData.hook, index)} title="Copy hook">
                  {copiedId === index ? '✓ Copied' : '📋 Copy'}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="output-actions fade-in" style={{ animationDelay: '0.3s' }}>
        <button onClick={handleExportJSON} className="btn-secondary">📥 Export All as JSON</button>
        <button onClick={onRegenerate} disabled={loading} className="btn-secondary">{loading ? '⏳ Generating...' : '🔄 Regenerate'}</button>
      </div>
      {exportMessage && <div className="export-message">{exportMessage}</div>}
    </div>
  )
}
