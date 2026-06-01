import { useState, useEffect } from 'react'
import ThemeToggle from './components/ThemeToggle'
import HookGenerator from './components/HookGenerator'
import './App.css'

function App() {
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('theme') || 'light'
  })

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
    localStorage.setItem('theme', theme)
  }, [theme])

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light')
  }

  return (
    <div className="app">
      <ThemeToggle theme={theme} onToggle={toggleTheme} />
      <HookGenerator />
    </div>
  )
}

export default App
