import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTenantTheme } from '../../src/tenant.context'

// Globex wants a minimal, centered card — similar structure to the default
// but with their own copy, a department field, and no password reset link.
export default function GlobexLoginPage() {
  const theme = useTenantTheme()
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [department, setDepartment] = useState('')

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (email && password) navigate('/dashboard')
  }

  return (
    <div className="login-page" style={{ background: 'var(--primary-light)' }}>
      <div className="login-card">
        <div className="login-card__logo">{theme.logoText}</div>
        <h2>Employee sign in</h2>
        <p className="login-card__sub">
          Globex internal help desk system
        </p>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email">Employee email</label>
            <input
              id="email"
              type="email"
              placeholder="firstname.lastname@globex.com"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="department">Department</label>
            <input
              id="department"
              type="text"
              placeholder="e.g. Engineering, HR, Finance"
              value={department}
              onChange={e => setDepartment(e.target.value)}
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
            Access help desk
          </button>
        </form>

        <p className="login-card__footer" style={{ marginTop: 16 }}>
          Having trouble?{' '}
          <a href="mailto:it@globex.com" style={{ color: 'var(--primary)' }}>
            Contact IT support
          </a>
        </p>
      </div>
    </div>
  )
}
