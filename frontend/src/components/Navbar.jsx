import { Link, NavLink } from 'react-router-dom'
import { getUser, logout } from '../utils/api'

const navLinkClass = ({ isActive }) =>
  `text-sm font-semibold transition ${
    isActive ? 'text-gold-400' : 'text-slate-300 hover:text-white'
  }`

export default function Navbar() {
  const user = getUser()
  const isLoggedIn = Boolean(user?.email)
  const dashboardPath = user.role === 'ADMIN' ? '/admin' : '/student'

  return (
    <nav className="sticky top-0 z-50 border-b border-white/10 bg-academy-950/85 backdrop-blur-xl">
      <div className="container-pro flex h-16 items-center justify-between">
        <Link to="/" className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl border border-gold-500/50 bg-gradient-to-br from-academy-900 to-slate-800 shadow-glow">
            <span className="font-cinzel text-xs font-extrabold text-gold-400">STA</span>
          </div>

          <div>
            <p className="font-cinzel text-sm font-bold leading-none text-[#fefce8]">
              Satya Tech Academy
            </p>
            <p className="mt-1 text-[9px] uppercase tracking-[2px] text-gold-600">
              Learn · Build · Succeed
            </p>
          </div>
        </Link>

        <div className="hidden items-center gap-7 md:flex">
          <NavLink to="/" className={navLinkClass}>
            Home
          </NavLink>
          <NavLink to="/verify" className={navLinkClass}>
            Verify
          </NavLink>

          {isLoggedIn && (
            <NavLink to={dashboardPath} className={navLinkClass}>
              Dashboard
            </NavLink>
          )}
        </div>

        <div className="flex items-center gap-3">
          {isLoggedIn ? (
            <>
              <span className="hidden rounded-full border border-white/10 px-3 py-1 text-xs text-slate-400 sm:block">
                {user.role}
              </span>
              <button onClick={logout} className="btn-secondary px-4 py-2">
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="btn-secondary px-4 py-2">
                Login
              </Link>
              <Link to="/register" className="btn-primary hidden px-4 py-2 sm:inline-block">
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  )
}
