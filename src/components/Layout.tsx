import React, { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { 
  LayoutDashboard, 
  Code, 
  TrendingUp, 
  BarChart, 
  User, 
  Settings, 
  Menu, 
  X,
  LogOut
} from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import { authAPI } from '../lib/api'

interface LayoutProps {
  children: React.ReactNode
}

export default function Layout({ children }: LayoutProps) {
  const { user, logout } = useAuth()
  const location = useLocation()
  const navigate = useNavigate()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false)

  const handleLogout = async () => {
    try {
      await authAPI.logout()
    } catch (error) {
      console.error('Logout error:', error)
    } finally {
      logout()
      navigate('/login')
    }
  }

  const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Generator', href: '/generator', icon: Code },
    ...(user?.role !== 'user' ? [
      { name: 'Offers', href: '/offers', icon: TrendingUp },
      { name: 'Reports', href: '/reports', icon: BarChart },
      { name: 'Users', href: '/users', icon: User },
      { name: 'Settings', href: '/settings', icon: Settings },
    ] : []),
  ]

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      {/* Navigation */}
      <nav className="bg-white shadow-md px-4 md:px-10 py-4 fixed w-full z-40 top-0">
        <div className="flex justify-between items-center">
          <Link to="/dashboard" className="text-decoration-none">
            <h1 className="text-2xl md:text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-purple-600">
              ApexTrack Lite
            </h1>
          </Link>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <div className="flex items-center space-x-6">
              {navigation.map((item) => {
                const Icon = item.icon
                const isActive = location.pathname === item.href
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={`flex items-center font-medium transition-colors duration-200 ${
                      isActive 
                        ? 'text-blue-600' 
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    <Icon className="w-5 h-5 mr-1" />
                    <span>{item.name}</span>
                  </Link>
                )
              })}
            </div>
            
            {/* Profile Dropdown */}
            <div className="relative">
              <button
                onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                className="flex items-center space-x-2 text-gray-800 focus:outline-none"
              >
                <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white font-semibold">
                  {user?.name?.charAt(0).toUpperCase()}
                </div>
              </button>
              
              {isProfileMenuOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-md shadow-lg">
                  <Link
                    to="/profile"
                    className="block px-4 py-2 text-gray-800 hover:bg-gray-100"
                    onClick={() => setIsProfileMenuOpen(false)}
                  >
                    Profile
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="block w-full text-left px-4 py-2 text-gray-800 hover:bg-gray-100"
                  >
                    <LogOut className="w-4 h-4 inline mr-2" />
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden text-gray-800"
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
        
        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="md:hidden absolute top-full left-0 w-full bg-white shadow-lg py-2">
            {navigation.map((item) => {
              const Icon = item.icon
              const isActive = location.pathname === item.href
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`flex items-center px-4 py-2 transition-colors duration-200 ${
                    isActive 
                      ? 'text-blue-600 bg-blue-50' 
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <Icon className="w-5 h-5 mr-2" />
                  <span>{item.name}</span>
                </Link>
              )
            })}
            <div className="border-t border-gray-200 mt-2 pt-2">
              <Link
                to="/profile"
                className="flex items-center px-4 py-2 text-gray-600 hover:bg-gray-100"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <User className="w-5 h-5 mr-2" />
                Profile
              </Link>
              <button
                onClick={handleLogout}
                className="flex items-center w-full text-left px-4 py-2 text-gray-600 hover:bg-gray-100"
              >
                <LogOut className="w-5 h-5 mr-2" />
                Logout
              </button>
            </div>
          </div>
        )}
      </nav>

      {/* Main Content */}
      <main className="flex-grow pt-20 md:pt-24">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-white text-gray-600 p-4 shadow-md">
        <div className="flex flex-col md:flex-row justify-between items-center mx-auto">
          <p className="text-sm order-2 md:order-1 mt-2 md:mt-0">
            Copyright © 2024 ApexTrack Lite. All rights reserved.
          </p>
          <p className="text-xs text-gray-400 order-1 md:order-2">
            Version 1.2.4
          </p>
        </div>
      </footer>
    </div>
  )
}