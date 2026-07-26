import { CheckSquare } from 'lucide-react'

export default function AuthCard({ title, children }) {
  return (
    <main className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <section
        className="bg-white rounded-2xl shadow-lg w-full max-w-sm p-6 sm:p-8"
        aria-labelledby="auth-title"
      >
        <div className="flex items-center justify-center gap-2 mb-8">
          <CheckSquare className="text-blue-600" size={28} aria-hidden="true" />
          <span className="text-2xl font-bold text-gray-800">My Todo</span>
        </div>

        <h1
          id="auth-title"
          className="text-lg font-semibold text-gray-700 mb-6 text-center"
        >
          {title}
        </h1>

        {children}
      </section>
    </main>
  )
}
