import { useEffect, useState } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { useAuthStore } from './store/authStore'
import { useTodoStore } from './store/todoStore'
import { supabase } from './lib/supabaseClient'
import PrivateRoute from './components/auth/PrivateRoute'
import Header from './components/layout/Header'
import Sidebar from './components/layout/Sidebar'
import Login from './pages/Login'
import ForgotPassword from './pages/ForgotPassword'
import ResetPassword from './pages/ResetPassword'
import ErrorPage from './pages/ErrorPage'
import TodoPage from './pages/TodoPage'
import Dashboard from './pages/Dashboard'

function AppLayout() {
  const { fetchTodos, autoUpdateDelayed, sidebarFilter } = useTodoStore()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  useEffect(() => {
    fetchTodos().then(() => autoUpdateDelayed())
  }, [autoUpdateDelayed, fetchTodos])

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      <Header onMenuClick={() => setSidebarOpen(true)} />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        <main className="flex flex-1 overflow-hidden bg-gray-50">
          {sidebarFilter === 'dashboard' ? <Dashboard /> : <TodoPage />}
        </main>
      </div>
    </div>
  )
}

export default function App() {
  const { init } = useAuthStore()
  const { clearAll } = useTodoStore()

  useEffect(() => {
    let authUnsub
    init().then((unsub) => { authUnsub = unsub })

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === 'SIGNED_OUT') clearAll()
    })

    return () => {
      authUnsub?.()
      subscription.unsubscribe()
    }
  }, [clearAll, init])

  return (
    <BrowserRouter basename="/my-todo-app">
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/error" element={<ErrorPage />} />
        <Route
          path="/*"
          element={
            <PrivateRoute>
              <AppLayout />
            </PrivateRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  )
}
