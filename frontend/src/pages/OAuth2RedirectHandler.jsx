import { useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import toast from 'react-hot-toast'
import { saveOAuthToken, getUser } from '../utils/api'

export default function OAuth2RedirectHandler() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()

  useEffect(() => {
    const token = searchParams.get('token')
    const error = searchParams.get('error')

    if (token) {
      saveOAuthToken(token)
      toast.success('Successfully logged in', { id: 'oauth-login-success' })
      
      const user = getUser()
      if (user?.role === 'ADMIN') {
        navigate('/admin', { replace: true })
      } else {
        navigate('/student', { replace: true })
      }
    } else {
      toast.error(error || 'Failed to authenticate')
      navigate('/login', { replace: true })
    }
  }, [searchParams, navigate])

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#070812]">
      <div className="text-gold-400 font-bold">Authenticating...</div>
    </div>
  )
}
