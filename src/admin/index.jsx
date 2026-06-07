import { useEffect, useState } from 'react'
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import Login from './Login'
import Layout from './Layout'
import Dashboard from './Dashboard'
import Messages from './pages/Messages'
import Projects from './pages/Projects'
import Experience from './pages/Experience'
import Education from './pages/Education'
import Certificates from './pages/Certificates'
import Skills from './pages/Skills'
import './admin.css'

function ProtectedRoute({ session, children }) {
  if (!session) return <Navigate to="/admin/login" replace />
  return children
}

export default function AdminApp() {
  const [session, setSession] = useState(undefined)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => setSession(session))
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_e, s) => setSession(s))
    return () => subscription.unsubscribe()
  }, [])

  if (session === undefined) return <div className="admin-loading">Loading…</div>

  return (
    <Routes>
      <Route path="login" element={session ? <Navigate to="/admin/dashboard" replace /> : <Login />} />
      <Route path="/*" element={
        <ProtectedRoute session={session}>
          <Layout session={session}>
            <Routes>
              <Route index element={<Navigate to="dashboard" replace />} />
              <Route path="dashboard"   element={<Dashboard />} />
              <Route path="messages"    element={<Messages />} />
              <Route path="projects"    element={<Projects />} />
              <Route path="experience"  element={<Experience />} />
              <Route path="education"   element={<Education />} />
              <Route path="certificates" element={<Certificates />} />
              <Route path="skills"      element={<Skills />} />
            </Routes>
          </Layout>
        </ProtectedRoute>
      } />
    </Routes>
  )
}
