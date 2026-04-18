import { useEffect } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { useAuthStore } from './store/authStore'
import { useTodoStore } from './store/todoStore'
import PrivateRoute from './components/auth/PrivateRoute'
import Header from './components/layout/Header'
import Sidebar from './components/layout/Sidebar'
import Login from './pages/Login'
import TodoPage from './pages/TodoPage'
import Dashboard from './pages/Dashboard'

function AppLayout() {
  const { fetchTodos, autoUpdateDelayed, sidebarFilter } = useTodoStore()

  useEffect(() => {
    fetchTodos().then(() => autoUpdateDelayed())
  }, [])

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      <Header />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        <main className="flex flex-1 overflow-hidden bg-gray-50">
          {sidebarFilter === 'dashboard' ? <Dashboard /> : <TodoPage />}
        </main>
      </div>
    </div>
  )
}

export default function App() {
  const { init } = useAuthStore()

  useEffect(() => {
    init()
  }, [])

  return (
    <BrowserRouter basename="/my-todo-app">
      <Routes>
        <Route path="/login" element={<Login />} />
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
