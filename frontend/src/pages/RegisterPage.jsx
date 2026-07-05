import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'

import Navbar from '../components/Navbar'
import { authApi, saveAuth } from '../utils/api'

export default function RegisterPage() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
  })

  function updateField(key, value) {
    setForm((current) => ({ ...current, [key]: value }))
  }

  async function handleSubmit(event) {
    event.preventDefault()
    setLoading(true)

    try {
      const response = await authApi.register(form)
      saveAuth(response)
      toast.success('Account created')
      navigate('/student')
    } catch (error) {
      toast.error(error.message)
    } finally {
      setLoading(false)
    }
  }

  const oauthBaseUrl = (import.meta.env.VITE_API_URL || 'http://localhost:8080/api').replace('/api', '')

  return (
    <div className="page-shell">
      <Navbar />

      <main className="flex min-h-[calc(100vh-4rem)] items-center justify-center px-4 py-12">
        <form onSubmit={handleSubmit} className="card-pro w-full max-w-md p-7">
          <p className="text-center text-xs font-bold uppercase tracking-[4px] text-gold-400">
            Student Registration
          </p>

          <h1 className="mt-3 text-center font-cinzel text-3xl font-extrabold text-[#fefce8]">
            Create Account
          </h1>

          <div className="mt-8 space-y-4">
            <div>
              <label className="label-pro">Full Name</label>
              <input
                value={form.name}
                onChange={(event) => updateField('name', event.target.value)}
                className="input-pro"
                placeholder="Rahul Sharma"
                required
              />
            </div>

            <div>
              <label className="label-pro">Email</label>
              <input
                type="email"
                value={form.email}
                onChange={(event) => updateField('email', event.target.value)}
                className="input-pro"
                placeholder="student@example.com"
                required
              />
            </div>

            <div>
              <label className="label-pro">Password</label>
              <input
                type="password"
                value={form.password}
                onChange={(event) => updateField('password', event.target.value)}
                className="input-pro"
                placeholder="Minimum 6 characters"
                required
              />
            </div>
          </div>

          <button disabled={loading} className="btn-primary mt-6 w-full">
            {loading ? 'Creating account...' : 'Create Student Account'}
          </button>

          <div className="mt-6 flex items-center gap-4">
            <div className="h-px flex-1 bg-white/10" />
            <span className="text-xs font-bold uppercase tracking-widest text-slate-500">Or</span>
            <div className="h-px flex-1 bg-white/10" />
          </div>

          <div className="mt-6 space-y-3">
            <a
              href={`${oauthBaseUrl}/oauth2/authorization/google`}
              className="flex w-full items-center justify-center gap-3 rounded-xl bg-white px-5 py-3 text-sm font-bold text-slate-900 transition hover:bg-slate-200"
            >
              <svg className="h-5 w-5" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
              </svg>
              Sign up with Google
            </a>
            <a
              href={`${oauthBaseUrl}/oauth2/authorization/github`}
              className="flex w-full items-center justify-center gap-3 rounded-xl bg-slate-800 px-5 py-3 text-sm font-bold text-white transition hover:bg-slate-700"
            >
              <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.462-1.11-1.462-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.831.092-.646.35-1.086.636-1.336-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0112 6.836c.85.004 1.705.114 2.504.336 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.161 22 16.418 22 12c0-5.523-4.477-10-10-10z" />
              </svg>
              Sign up with GitHub
            </a>
          </div>

          <p className="mt-5 text-center text-sm text-slate-400">
            Already registered?{' '}
            <Link to="/login" className="font-bold text-gold-400">
              Login
            </Link>
          </p>
        </form>
      </main>
    </div>
  )
}
