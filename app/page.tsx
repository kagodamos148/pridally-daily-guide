'use client'

import React, { useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import LandingPage from '@/components/landing/LandingPage'
import AuthForm from '@/components/auth/AuthForm'
import Dashboard from '@/components/dashboard/Dashboard'

export default function HomePage() {
  const { isAuthenticated } = useAuth()
  const [showAuth, setShowAuth] = useState(false)

  if (isAuthenticated) {
    return <Dashboard />
  }

  if (showAuth) {
    return <AuthForm onBack={() => setShowAuth(false)} />
  }

  return <LandingPage onGetStarted={() => setShowAuth(true)} />
}
