import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabaseClient'
import { CheckSquare } from 'lucide-react'

const AUTH_ERRORS = {
  'Invalid login credentials': '이메일 또는 비밀번호가 올바르지 않습니다.',
  'Email not confirmed': '이메일 인증이 완료되지 않았습니다. 확인 메일을 확인해 주세요.',
  'User already registered': '이미 가입된 이메일입니다.',
  'Password should be at least 6 characters': '비밀번호는 최소 8자 이상이어야 합니다.',
  'Unable to validate email address: invalid format': '올바른 이메일 형식이 아닙니다.',
  'Email rate limit exceeded': '잠시 후 다시 시도해 주세요.',
  'Too many requests': '요청이 너무 많습니다. 잠시 후 다시 시도해 주세요.',
}

const translateError = (msg) => {
  for (const [key, value] of Object.entries(AUTH_ERRORS)) {
    if (msg?.includes(key)) return value
  }
  return '오류가 발생했습니다. 다시 시도해 주세요.'
}

const validatePassword = (pw) => {
  if (pw.length < 8) return '비밀번호는 최소 8자 이상이어야 합니다.'
  if (!/[A-Za-z]/.test(pw)) return '비밀번호에 영문자를 포함해야 합니다.'
  if (!/[0-9]/.test(pw)) return '비밀번호에 숫자를 포함해야 합니다.'
  return null
}

export default function Login() {
  const navigate = useNavigate()
  const [isSignup, setIsSignup] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setMessage('')

    const trimmedEmail = email.trim()

    if (isSignup) {
      const pwError = validatePassword(password)
      if (pwError) { setError(pwError); return }
    }

    setLoading(true)

    if (isSignup) {
      const redirectTo = `${window.location.origin}${import.meta.env.BASE_URL}`
      const { error } = await supabase.auth.signUp({
        email: trimmedEmail,
        password,
        options: { emailRedirectTo: redirectTo },
      })
      if (error) setError(translateError(error.message))
      else setMessage('가입 확인 이메일을 발송했습니다. 이메일을 확인해 주세요.')
    } else {
      const { error } = await supabase.auth.signInWithPassword({
        email: trimmedEmail,
        password,
      })
      if (error) setError(translateError(error.message))
      else navigate('/')
    }

    setLoading(false)
  }

  const switchMode = () => {
    setIsSignup(!isSignup)
    setError('')
    setMessage('')
    setPassword('')
  }

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-lg w-full max-w-sm p-8">
        <div className="flex items-center justify-center gap-2 mb-8">
          <CheckSquare className="text-blue-600" size={28} />
          <h1 className="text-2xl font-bold text-gray-800">My Todo</h1>
        </div>

        <h2 className="text-lg font-semibold text-gray-700 mb-6 text-center">
          {isSignup ? '회원가입' : '로그인'}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">이메일</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="you@example.com"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">비밀번호</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete={isSignup ? 'new-password' : 'current-password'}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder={isSignup ? '영문+숫자 8자 이상' : '••••••••'}
            />
            {isSignup && (
              <p className="text-xs text-gray-400 mt-1">영문 + 숫자 조합 8자 이상</p>
            )}
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg px-3 py-2">
              <p className="text-red-600 text-sm">{error}</p>
            </div>
          )}
          {message && (
            <div className="bg-green-50 border border-green-200 rounded-lg px-3 py-2">
              <p className="text-green-700 text-sm">{message}</p>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 rounded-lg text-sm transition disabled:opacity-50"
          >
            {loading ? '처리 중...' : isSignup ? '가입하기' : '로그인'}
          </button>
        </form>

        <p className="text-center text-sm text-gray-500 mt-6">
          {isSignup ? '이미 계정이 있으신가요?' : '계정이 없으신가요?'}{' '}
          <button
            onClick={switchMode}
            className="text-blue-600 hover:underline font-medium"
          >
            {isSignup ? '로그인' : '회원가입'}
          </button>
        </p>
      </div>
    </div>
  )
}
