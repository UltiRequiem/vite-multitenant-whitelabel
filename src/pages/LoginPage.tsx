import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTenantTheme } from '../tenant.context'

export default function LoginPage() {
  const theme = useTenantTheme()
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    // Replace with your real auth call
    if (email && password) navigate('/dashboard')
  }

  return (
    <div className="login-page">
      <div className="login-card">
        <div className="login-card__logo">{theme.logoText}</div>
        <h2>Welcome back</h2>
        <p className="login-card__sub">Sign in to {theme.companyName}</p>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              placeholder="you@company.com"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="btn btn-primary">
            Sign in
          </button>
        </form>

        <p className="login-card__footer">
          Forgot your password?{' '}
          <a href="#" style={{ color: 'var(--primary)' }}>Reset it</a>
        </p>
      </div>
    </div>
  )
}
