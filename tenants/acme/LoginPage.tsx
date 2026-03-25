import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTenantTheme } from '../../src/tenant.context'

// Acme wants a two-column layout with their branding on the left
// and the login form on the right — completely different from the default.
// But notice: same useNavigate, same form logic underneath.
export default function AcmeLoginPage() {
  const theme = useTenantTheme()
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (email && password) navigate('/dashboard')
  }

  return (
    <div className="acme-login">
      {/* Left branding panel */}
      <div className="acme-login__sidebar">
        <div className="acme-login__sidebar-logo">{theme.logoText}</div>
        <p>
          Your internal support portal.<br />
          Sign in with your Acme credentials.
        </p>
      </div>

      {/* Right form panel */}
      <div className="acme-login__form">
        <div className="acme-login__form-inner">
          <h2>Sign in</h2>
          <p className="sub">Use your Acme Corp work account</p>

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="email">Work email</label>
              <input
                id="email"
                type="email"
                placeholder="name@acmecorp.com"
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
              Continue
            </button>
          </form>

          <a href="#" className="sso-link">Sign in with SSO instead →</a>
        </div>
      </div>
    </div>
  )
}
