import { useState, useEffect } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import toast from 'react-hot-toast'
import Navbar from '../components/Navbar'
import { authApi } from '../utils/api'

export default function ResetPasswordPage() {
  const [searchParams] = useSearchParams()
  const token = searchParams.get('token')
  const navigate = useNavigate()

  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!token) {
      toast.error('Invalid password reset link.')
      navigate('/login')
    }
  }, [token, navigate])

  async function handleSubmit(event) {
    event.preventDefault()
    
    if (password !== confirmPassword) {
      toast.error('Passwords do not match')
      return
    }

    if (password.length < 6) {
      toast.error('Password must be at least 6 characters')
      return
    }

    setLoading(true)

    try {
      await authApi.resetPassword({ token, newPassword: password })
      toast.success('Password reset successfully! Please login.')
      navigate('/login')
    } catch (error) {
      toast.error(error.message || 'Failed to reset password. Link may be expired.')
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
            Set New Password
          </h1>

          <div className="mt-8 space-y-4">
            <div>
              <label className="label-pro">New Password</label>
              <input
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                className="input-pro"
                placeholder="Enter new password"
                required
              />
            </div>

            <div>
              <label className="label-pro">Confirm Password</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(event) => setConfirmPassword(event.target.value)}
                className="input-pro"
                placeholder="Confirm new password"
                required
              />
            </div>
          </div>

          <button disabled={loading} className="btn-primary mt-6 w-full">
            {loading ? 'Saving...' : 'Save New Password'}
          </button>

          <p className="mt-5 text-center text-sm text-slate-400">
            <Link to="/login" className="font-bold text-gold-400 hover:underline">
              Cancel
            </Link>
          </p>
        </form>
      </main>
    </div>
  )
}
