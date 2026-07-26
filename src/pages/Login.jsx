import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabaseClient'
import AuthCard from '../components/auth/AuthCard'
import {
  isExistingAccountError,
  translateAuthError,
  validatePassword,
} from '../lib/authUtils'

export default function Login() {
  const navigate = useNavigate()
  const location = useLocation()
  const [isSignup, setIsSignup] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState(() => location.state?.message ?? '')

  const handleSubmit = async (event) => {
    event.preventDefault()
    setError('')
    setMessage('')

    const trimmedEmail = email.trim()

    if (isSignup) {
      const passwordError = validatePassword(password)
      if (passwordError) {
        setError(passwordError)
        return
      }
    }

    setLoading(true)

    try {
      if (isSignup) {
        const redirectTo = `${window.location.origin}${import.meta.env.BASE_URL}`
        const { error: signupError } = await supabase.auth.signUp({
          email: trimmedEmail,
          password,
          options: { emailRedirectTo: redirectTo },
        })
        if (signupError && !isExistingAccountError(signupError)) {
          setError(translateAuthError(signupError))
        } else {
          setMessage(
            '가입 가능한 이메일이면 확인 메일이 발송됩니다. 이메일을 확인해 주세요.',
          )
        }
      } else {
        const { error: loginError } = await supabase.auth.signInWithPassword({
          email: trimmedEmail,
          password,
        })
        if (loginError) {
          setError(translateAuthError(loginError))
        } else {
          navigate('/')
        }
      }
    } catch {
      navigate('/error', { replace: true })
    } finally {
      setLoading(false)
    }
  }

  const switchMode = () => {
    setIsSignup(!isSignup)
    setError('')
    setMessage('')
    setPassword('')
  }

  return (
    <AuthCard title={isSignup ? '회원가입' : '로그인'}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label
            htmlFor="login-email"
            className="block text-sm font-medium text-gray-600 mb-1"
          >
            이메일
          </label>
          <input
            id="login-email"
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            required
            autoComplete="email"
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="you@example.com"
          />
        </div>
        <div>
          <label
            htmlFor="login-password"
            className="block text-sm font-medium text-gray-600 mb-1"
          >
            비밀번호
          </label>
          <input
            id="login-password"
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            required
            minLength={isSignup ? 8 : undefined}
            autoComplete={isSignup ? 'new-password' : 'current-password'}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder={isSignup ? '영문+숫자 8자 이상' : '••••••••'}
          />
          {isSignup ? (
            <p className="text-xs text-gray-400 mt-1">영문 + 숫자 조합 8자 이상</p>
          ) : (
            <div className="text-right mt-2">
              <Link
                to="/forgot-password"
                className="text-sm text-blue-600 hover:underline"
              >
                비밀번호를 잊으셨나요?
              </Link>
            </div>
          )}
        </div>

        {error ? (
          <div
            className="bg-red-50 border border-red-200 rounded-lg px-3 py-2"
            role="alert"
          >
            <p className="text-red-600 text-sm">{error}</p>
          </div>
        ) : null}
        {message ? (
          <div
            className="bg-green-50 border border-green-200 rounded-lg px-3 py-2"
            role="status"
          >
            <p className="text-green-700 text-sm">{message}</p>
          </div>
        ) : null}

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
          type="button"
          onClick={switchMode}
          className="text-blue-600 hover:underline font-medium"
        >
          {isSignup ? '로그인' : '회원가입'}
        </button>
      </p>
    </AuthCard>
  )
}
