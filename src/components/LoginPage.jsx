import { Eye, EyeOff, LockKeyhole } from 'lucide-react'
import { useState } from 'react'
import brandLogo from '../assets/brandlogo.png'
import { demoOwnerAccount } from '../data/ownerData.js'

function LoginPage({ onLogin, error }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)

  function handleSubmit(event) {
    event.preventDefault()
    onLogin({ email: email.trim(), password })
  }

  return (
    <main className="login-shell">
      <section className="login-card">
        <img className="login-logo" src={brandLogo} alt="HajiKu — Umroh dan Haji Terpercaya" />
        <h1 className="login-title">Masuk ke HajiKu</h1>

        <form className="login-form" onSubmit={handleSubmit}>
          <label className="field">Email
            <input
              type="email"
              name="email"
              autoComplete="username"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="owner@hajiku.id"
              required
            />
          </label>
          <label className="field">Kata sandi
            <span className="password-field">
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                autoComplete="current-password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="Masukkan kata sandi"
                required
              />
              <button type="button" aria-label={showPassword ? 'Sembunyikan kata sandi' : 'Tampilkan kata sandi'} onClick={() => setShowPassword((shown) => !shown)}>
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </span>
          </label>
          {error && <p className="login-error" role="alert">{error}</p>}
          <button type="submit" className="button button-primary login-submit"><LockKeyhole size={15} /> Masuk</button>
        </form>

        <p className="demo-credentials">Demo: {demoOwnerAccount.email} · {demoOwnerAccount.password}</p>
        <p className="login-notice">Mode demo lokal — belum melindungi data produksi.</p>
      </section>
    </main>
  )
}

export default LoginPage
