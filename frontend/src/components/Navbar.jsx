import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useState } from 'react'

export default function Navbar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [menuOpen, setMenuOpen] = useState(false)

  function handleLogout() {
    logout()
    navigate('/login')
  }

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-black text-sm">PYQ</span>
            </div>
            <span className="font-black text-xl text-gray-900">DIT PYQ</span>
          </Link>

          <div className="hidden md:flex items-center gap-6">
            <Link to="/pyqs" className="text-gray-600 hover:text-indigo-600 font-medium transition-colors">
              Browse Papers
            </Link>
            {user?.role === 'admin' && (
              <Link to="/admin" className="text-gray-600 hover:text-indigo-600 font-medium transition-colors">
                Admin
              </Link>
            )}
            {user ? (
              <div className="flex items-center gap-3">
                <span className="text-sm text-gray-500">Hi, {user.name.split(' ')[0]}</span>
                <button
                  onClick={handleLogout}
                  id="logout-btn"
                  className="bg-red-50 text-red-600 px-4 py-2 rounded-lg text-sm font-semibold hover:bg-red-100 transition-colors"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Link to="/login" className="text-gray-600 hover:text-indigo-600 font-medium transition-colors text-sm">
                  Login
                </Link>
                <Link to="/register" id="nav-register-btn"
                  className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-indigo-700 transition-colors">
                  Register
                </Link>
              </div>
            )}
          </div>

          <button className="md:hidden p-2 rounded-lg text-gray-600" onClick={() => setMenuOpen(!menuOpen)}>
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {menuOpen
                ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              }
            </svg>
          </button>
        </div>

        {menuOpen && (
          <div className="md:hidden pb-4 flex flex-col gap-3">
            <Link to="/pyqs" onClick={() => setMenuOpen(false)} className="text-gray-600 font-medium py-2">Browse Papers</Link>
            {user?.role === 'admin' && (
              <Link to="/admin" onClick={() => setMenuOpen(false)} className="text-gray-600 font-medium py-2">Admin</Link>
            )}
            {user ? (
              <button onClick={handleLogout} className="text-red-600 font-semibold text-left py-2">Logout</button>
            ) : (
              <>
                <Link to="/login" onClick={() => setMenuOpen(false)} className="text-gray-600 font-medium py-2">Login</Link>
                <Link to="/register" onClick={() => setMenuOpen(false)} className="text-indigo-600 font-semibold py-2">Register</Link>
              </>
            )}
          </div>
        )}
      </div>
    </nav>
  )
}
