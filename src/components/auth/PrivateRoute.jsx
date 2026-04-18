import { Navigate } from 'react-router-dom'
import { useAuthStore } from '../../store/authStore'

export default function PrivateRoute({ children }) {
  const { user, loading } = useAuthStore()

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
      </div>
    )
  }

  return user ? children : <Navigate to="/login" replace />
}
