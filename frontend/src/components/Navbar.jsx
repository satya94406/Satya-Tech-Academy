import { useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { getUser, logout } from '../utils/api'

const navLinkClass = ({ isActive }) =>
  `text-sm font-semibold tracking-wide transition ${
    isActive ? 'text-gold-400' : 'text-slate-300 hover:text-white'
  }`

export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const user = getUser()
  const isLoggedIn = Boolean(user?.email)
  const dashboardPath = user.role === 'ADMIN' ? '/admin' : '/student'

  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen)
  const closeMobileMenu = () => setIsMobileMenuOpen(false)

  return (
    <nav className="sticky top-0 z-50 border-b border-white/5 bg-[#070812]/90 backdrop-blur-md">
      <div className="container-pro flex h-16 items-center justify-between">
        <Link to="/" onClick={closeMobileMenu} className="flex items-center gap-3 transition hover:opacity-90">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gold-500 text-black shadow-[0_0_15px_rgba(245,158,11,0.2)]">
            <span className="font-outfit text-base font-extrabold">STA</span>
          </div>

          <div>
            <p className="font-outfit text-base font-extrabold leading-none text-white tracking-wide">
              Satya Tech Academy
            </p>
          </div>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden items-center gap-12 md:flex">
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

        <div className="hidden items-center gap-4 md:flex">
          {isLoggedIn ? (
            <>
              <span className="rounded-full border border-white/10 px-4 py-1.5 text-xs font-bold text-slate-300">
                {user.role}
              </span>
              <button onClick={logout} className="rounded-full border border-white/10 bg-white/5 px-6 py-2 text-sm font-bold text-slate-100 transition hover:bg-gold-500 hover:text-black hover:border-gold-500 shadow-sm">
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="rounded-full border border-white/10 bg-white/5 px-6 py-2 text-sm font-bold text-slate-100 transition hover:bg-white/10">
                Login
              </Link>
              <Link to="/register" className="rounded-full bg-gradient-to-r from-gold-500 to-gold-600 px-6 py-2 text-sm font-extrabold text-[#1a0a00] transition hover:scale-105 hover:shadow-[0_0_20px_rgba(245,158,11,0.4)]">
                Register
              </Link>
            </>
          )}
        </div>

        {/* Mobile Menu Toggle */}
        <button
          className="p-2 text-slate-300 md:hidden"
          onClick={toggleMobileMenu}
          aria-label="Toggle mobile menu"
        >
          <svg
            className="h-6 w-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            {isMobileMenuOpen ? (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            ) : (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16m-7 6h7"
              />
            )}
          </svg>
        </button>
      </div>

      {/* Mobile Nav */}
      {isMobileMenuOpen && (
        <div className="border-t border-white/10 bg-academy-950/95 px-4 py-4 md:hidden">
          <div className="flex flex-col gap-4">
            <NavLink to="/" onClick={closeMobileMenu} className={navLinkClass}>
              Home
            </NavLink>
            <NavLink to="/verify" onClick={closeMobileMenu} className={navLinkClass}>
              Verify
            </NavLink>

            {isLoggedIn && (
              <NavLink
                to={dashboardPath}
                onClick={closeMobileMenu}
                className={navLinkClass}
              >
                Dashboard
              </NavLink>
            )}

            <div className="my-2 h-px w-full bg-white/10" />

            {isLoggedIn ? (
              <div className="flex flex-col gap-3">
                <span className="self-start rounded-full border border-white/10 px-3 py-1 text-xs text-slate-400">
                  Role: {user.role}
                </span>
                <button
                  onClick={() => {
                    logout()
                    closeMobileMenu()
                  }}
                  className="btn-secondary w-full text-center"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex flex-col gap-3">
                <Link
                  to="/login"
                  onClick={closeMobileMenu}
                  className="btn-secondary w-full text-center"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  onClick={closeMobileMenu}
                  className="btn-primary w-full text-center"
                >
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  )
}
