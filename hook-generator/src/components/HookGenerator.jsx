import { useState } from 'react'
import HookOutput from './HookOutput'

export default function HookGenerator() {
  const [formData, setFormData] = useState({
    topic: '',
    platform: 'instagram_reels',
    goal: 'Awareness',
    tone: 'Casual',
    style: 'Storytelling',
    depth: 'Beginner'
  })
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const handleChange = (e) => {
    const { id, value } = e.target
    setFormData(prev => ({ ...prev, [id]: value }))
    setError(null)
  }

  const handleGenerate = async () => {
    if (!formData.topic.trim()) {
      setError('Please enter a content topic')
      document.getElementById('topic').focus()
      return
    }

    setLoading(true)
    setError(null)
    setResult(null)

    try {
      const apiKey = import.meta.env.VITE_OPENAI_API_KEY
      if (!apiKey) {
        throw new Error('API Key not configured')
      }

      const systemPrompt = `You are a structured AI reasoning system that generates high-quality social media hooks using a strict 3-step workflow.\n\nSTEP 1: DEFINE THE PROBLEM\nSTEP 2: BREAK DOWN THE SOLUTION\nSTEP 3: SYNTHESIZE THE CONCLUSION - Generate 10 hooks\n\nOutput ONLY valid JSON: {"problem_definition": "string", "solution_breakdown": ["string"], "hooks": [{"hook": "string", "type": "Question|Shock|Curiosity|Bold Claim|Story", "expert_consensus": "Strong|Medium|Weak", "needs_source": false, "reasoning": "string"}]}`

      const userPrompt = `Generate hooks: Topic: ${formData.topic}, Platform: ${formData.platform}, Goal: ${formData.goal}, Tone: ${formData.tone}, Style: ${formData.style}, Depth: ${formData.depth}`

      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify({
          model: 'gpt-4o-mini',
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: userPrompt }
          ],
          temperature: 0.7,
          response_format: { type: 'json_object' }
        })
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error?.message || 'Failed to generate hooks')
      }

      const data = await response.json()
      const jsonString = data.choices[0].message.content
      const parsedResult = JSON.parse(jsonString)
      setResult(parsedResult)
    } catch (err) {
      console.error('Error:', err)
      if (err.message.includes('API')) {
        setError('API Key Error: Add VITE_OPENAI_API_KEY to .env.local')
      } else {
        setError(err.message || 'Failed to generate hooks')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container">
      <h1>🚀 Hook Generator Pro</h1>
      <p>Generate scroll-stopping hooks with AI-powered insights and expert consensus.</p>

      <div className="form-grid">
        <div className="form-group">
          <label htmlFor="topic">Content Topic</label>
          <input
            id="topic"
            className="field"
            type="text"
            placeholder="e.g. Why morning routines change your life"
            value={formData.topic}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label htmlFor="platform">Platform</label>
          <select id="platform" className="field" value={formData.platform} onChange={handleChange}>
            <option value="instagram_reels">Instagram Reels</option>
            <option value="tiktok">TikTok</option>
            <option value="linkedin">LinkedIn</option>
            <option value="youtube_shorts">YouTube Shorts</option>
            <option value="twitter">Twitter/X</option>
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="goal">Campaign Goal</label>
          <select id="goal" className="field" value={formData.goal} onChange={handleChange}>
            <option value="Awareness">Awareness</option>
            <option value="Engagement">Engagement</option>
            <option value="Sales">Sales</option>
            <option value="Education">Education</option>
            <option value="Community">Community Building</option>
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="tone">Tone</label>
          <select id="tone" className="field" value={formData.tone} onChange={handleChange}>
            <option value="Casual">Casual</option>
            <option value="Balanced">Balanced</option>
            <option value="Professional">Professional</option>
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="style">Style</label>
          <select id="style" className="field" value={formData.style} onChange={handleChange}>
            <option value="Storytelling">Storytelling</option>
            <option value="Direct">Direct</option>
            <option value="Technical">Technical</option>
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="depth">Depth</label>
          <select id="depth" className="field" value={formData.depth} onChange={handleChange}>
            <option value="Beginner">Beginner</option>
            <option value="Intermediate">Intermediate</option>
            <option value="Professional">Professional</option>
          </select>
        </div>

        <div className="button-row">
          <button onClick={handleGenerate} disabled={loading} className="btn-primary">
            {loading ? <span className="loading"><span></span><span></span><span></span></span> : '✨ Generate Hooks'}
          </button>
        </div>
      </div>

      {error && <div className="error-message">{error}</div>}
      {result && <HookOutput data={result} onRegenerate={handleGenerate} loading={loading} />}
      {!result && !loading && (
        <div className="output">
          <h2>Your AI-Generated Hooks</h2>
          <div className="empty-state">
            <p>🎯 Fill in your details and click Generate Hooks to get started</p>
          </div>
        </div>
      )}
    </div>
  )
}
