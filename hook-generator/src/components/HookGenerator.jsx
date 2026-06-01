import { useState } from 'react'
import HookCard from './HookCard'

const promptTemplates = {
  Curiosity: [
    'What\'s really happening with',
    'The one detail about',
    'This hidden twist in',
    'Why most people miss',
    'The truth behind',
  ],
  FOMO: [
    'Only people who',
    'Before everyone misses',
    'If you still haven\'t tried',
    'Most people will skip',
    'Don\'t be the one who misses',
  ],
  Nostalgia: [
    'Remember when',
    'Back when',
    'This feels like',
    'The kind of',
    'When it used to be',
  ],
  Controversy: [
    'Nobody says this about',
    'Forget the idea that',
    'This breaks the rule about',
    'People get wrong that',
    'The opposite of what you were told about',
  ],
  Surprise: [
    'You won\'t expect',
    'The shocker about',
    'The weird truth about',
    'If you think',
    'Wait until you see',
  ],
  Relatability: [
    'If your day starts with',
    'For anyone who has',
    'This is exactly what',
    'When you feel like',
    'Everyone who',
  ],
  Aspiration: [
    'Want to feel like',
    'How to become',
    'The easiest way to be',
    'If you dream of',
    'This is for people who want to',
  ]
}

const platformRules = {
  instagram_reels: { hookType: 'Video Hook', maxWords: 15 },
  tiktok: { hookType: 'Video Hook', maxWords: 15 },
  linkedin: { hookType: 'Caption Hook', maxWords: 25 },
  instagram_caption: { hookType: 'Caption Hook', maxWords: 25 },
  instagram_story: { hookType: 'Story Hook', maxWords: 18 }
}

export default function HookGenerator() {
  const [formData, setFormData] = useState({
    topic: '',
    audience: '',
    platform: 'instagram_reels',
    trigger: 'Curiosity',
    unique: ''
  })
  const [hooks, setHooks] = useState([])
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => {
    const { id, value } = e.target
    setFormData(prev => ({ ...prev, [id]: value }))
  }

  const countWords = (text) => {
    return text.trim().split(/\s+/).filter(Boolean).length
  }

  const enforceLimit = (text, maxWords) => {
    const words = text.trim().split(/\s+/).filter(Boolean)
    if (words.length <= maxWords) return text
    return words.slice(0, maxWords).join(' ')
  }

  const buildHook = (index) => {
    const { topic, audience, platform, trigger, unique } = formData
    const seed = promptTemplates[trigger][index % promptTemplates[trigger].length]
    const platformRule = platformRules[platform]
    let hook = `${seed} ${topic}`

    if (trigger === 'FOMO') {
      hook = `${seed} ${topic} before everyone misses it`
    } else if (trigger === 'Nostalgia') {
      hook = `${seed} ${topic} felt more real`
    } else if (trigger === 'Controversy') {
      hook = `${seed} ${topic} is not what people think`
    } else if (trigger === 'Surprise') {
      hook = `${seed} ${topic} with ${unique || 'a twist'}`
    } else if (trigger === 'Relatability') {
      hook = `${seed} ${topic} when ${audience || 'you know the struggle'}`
    } else if (trigger === 'Aspiration') {
      hook = `${seed} ${topic} if you want to be the kind of person who ${unique || 'never settles'}`
    }

    hook = hook.replace(/\s+/g, ' ').trim()
    hook = hook.replace(/\s+\?/, '?')
    hook = hook.replace(/\s+\./, '.')
    hook = hook.charAt(0).toUpperCase() + hook.slice(1)
    hook = enforceLimit(hook, platformRule.maxWords)

    return {
      type: platformRule.hookType,
      text: hook,
      words: countWords(hook)
    }
  }

  const handleGenerate = async () => {
    if (!formData.topic || !formData.audience || !formData.unique) {
      if (!formData.topic) document.getElementById('topic').focus()
      else if (!formData.audience) document.getElementById('audience').focus()
      else document.getElementById('unique').focus()
      return
    }

    setLoading(true)
    
    // Simulate API call delay
    setTimeout(() => {
      const generatedHooks = Array.from({ length: 5 }, (_, index) => buildHook(index))
      setHooks(generatedHooks)
      setLoading(false)
    }, 600)
  }

  return (
    <div className="container">
      <h1>Hook Generator</h1>
      <p>Create scroll-stopping hooks for Instagram, TikTok, and LinkedIn with authentic storytelling.</p>

      <div className="form-grid">
        <div className="form-group">
          <label htmlFor="topic">Content Topic</label>
          <input
            id="topic"
            className="field"
            type="text"
            placeholder="e.g. Why your morning coffee ritual matters"
            value={formData.topic}
            onChange={handleChange}
          />
        </div>
        <div className="form-group">
          <label htmlFor="audience">Target Audience</label>
          <input
            id="audience"
            className="field"
            type="text"
            placeholder="e.g. Young professionals seeking mindful moments"
            value={formData.audience}
            onChange={handleChange}
          />
        </div>
        <div className="form-group">
          <label htmlFor="platform">Platform</label>
          <select
            id="platform"
            className="field"
            value={formData.platform}
            onChange={handleChange}
          >
            <option value="instagram_reels">Instagram Reels</option>
            <option value="tiktok">TikTok</option>
            <option value="linkedin">LinkedIn</option>
            <option value="instagram_caption">Instagram Caption</option>
            <option value="instagram_story">Instagram Story</option>
          </select>
        </div>
        <div className="form-group">
          <label htmlFor="trigger">Emotional Trigger</label>
          <select
            id="trigger"
            className="field"
            value={formData.trigger}
            onChange={handleChange}
          >
            <option value="Curiosity">Curiosity (make them need to know)</option>
            <option value="FOMO">FOMO (fear of missing out)</option>
            <option value="Nostalgia">Nostalgia (childhood feeling)</option>
            <option value="Controversy">Controversy (challenge beliefs)</option>
            <option value="Surprise">Surprise (unexpected twist)</option>
            <option value="Relatability">Relatability (this is so me)</option>
            <option value="Aspiration">Aspiration (who I want to be)</option>
          </select>
        </div>
        <div className="form-group full-width">
          <label htmlFor="unique">What makes this unique</label>
          <input
            id="unique"
            className="field"
            type="text"
            placeholder="e.g. We blend tradition with modern wellness practices"
            value={formData.unique}
            onChange={handleChange}
          />
        </div>
        <div className="button-row">
          <button onClick={handleGenerate} disabled={loading}>
            {loading ? (
              <span className="loading">
                <span></span>
                <span></span>
                <span></span>
              </span>
            ) : (
              'Generate Hooks'
            )}
          </button>
        </div>
      </div>

      <div className="output">
        <h2>Your Hooks</h2>
        {hooks.length > 0 ? (
          <>
            <ul className="hooks">
              {hooks.map((hook, index) => (
                <HookCard key={index} hook={hook} />
              ))}
            </ul>
          </>
        ) : (
          <ul className="hooks">
            <li className="hook-card">
              <span className="hook-label">Ready</span>
              <p className="hook-text">Fill in your details and generate perfectly crafted hooks for your content.</p>
              <div className="hook-meta">
                <span>Each hook is optimized for maximum engagement</span>
              </div>
            </li>
          </ul>
        )}
        <p className="hint">💡 Pro tip: Be specific with your audience and unique angle for better results</p>
      </div>
    </div>
  )
}
