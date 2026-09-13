import { useState } from 'react'
import { Link } from 'react-router-dom'
import toast from 'react-hot-toast'
import Navbar from '../components/Navbar'
import { authApi } from '../utils/api'

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  async function handleSubmit(event) {
    event.preventDefault()
    setLoading(true)

    try {
      await authApi.forgotPassword({ email })
      setSubmitted(true)
      toast.success('Reset link sent if the email exists')
    } catch (error) {
      toast.error(error.message || 'Something went wrong')
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
            Account Recovery
          </p>

          <h1 className="mt-3 text-center font-cinzel text-3xl font-extrabold text-[#fefce8]">
            Forgot Password
          </h1>

          {submitted ? (
            <div className="mt-8 text-center text-slate-300">
              <p>If an account exists for <strong>{email}</strong>, we have sent a password reset link to it.</p>
              <p className="mt-4 text-sm text-slate-500">Please check your inbox (and spam folder).</p>
              <Link to="/login" className="btn-primary mt-6 inline-block w-full text-center">
                Return to Login
              </Link>
            </div>
          ) : (
            <>
              <p className="mt-4 text-center text-sm text-slate-400">
                Enter your email address and we'll send you a link to reset your password.
              </p>

              <div className="mt-8 space-y-4">
                <div>
                  <label className="label-pro">Email</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    className="input-pro"
                    placeholder="student@example.com"
                    required
                  />
                </div>
              </div>

              <button disabled={loading} className="btn-primary mt-6 w-full">
                {loading ? 'Sending...' : 'Send Reset Link'}
              </button>
            </>
          )}

          <p className="mt-5 text-center text-sm text-slate-400">
            Remember your password?{' '}
            <Link to="/login" className="font-bold text-gold-400">
              Login here
            </Link>
          </p>
        </form>
      </main>
    </div>
  )
}
