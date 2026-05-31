import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'

import Navbar from '../components/Navbar'
import { authApi, saveAuth } from '../utils/api'

export default function LoginPage() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({
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
      const response = await authApi.login(form)
      saveAuth(response)
      toast.success('Login successful')
      navigate(response.role === 'ADMIN' ? '/admin' : '/student')
    } catch (error) {
      toast.error(error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="page-shell">
      <Navbar />

      <main className="flex min-h-[calc(100vh-4rem)] items-center justify-center px-4 py-12">
        <form onSubmit={handleSubmit} className="card-pro w-full max-w-md p-7">
          <p className="text-center text-xs font-bold uppercase tracking-[4px] text-gold-400">
            Welcome Back
          </p>

          <h1 className="mt-3 text-center font-cinzel text-3xl font-extrabold text-[#fefce8]">
            Login
          </h1>

          <div className="mt-8 space-y-4">
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
                placeholder="Enter password"
                required
              />
            </div>
          </div>

          <button disabled={loading} className="btn-primary mt-6 w-full">
            {loading ? 'Logging in...' : 'Login'}
          </button>

          <p className="mt-5 text-center text-sm text-slate-400">
            New student?{' '}
            <Link to="/register" className="font-bold text-gold-400">
              Create account
            </Link>
          </p>

          <div className="mt-5 rounded-2xl border border-white/10 bg-black/20 p-4 text-xs text-slate-400">
            <p className="font-bold text-slate-300">Default admin login:</p>
            <p>Email: electricalstudyworld@gmail.com</p>
            <p>Password: admin12345</p>
          </div>
        </form>
      </main>
    </div>
  )
}
