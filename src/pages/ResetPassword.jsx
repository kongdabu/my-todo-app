import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import AuthCard from '../components/auth/AuthCard'
import { supabase } from '../lib/supabaseClient'
import { translateAuthError, validatePassword } from '../lib/authUtils'

export default function ResetPassword() {
  const navigate = useNavigate()
  const [recoveryStatus, setRecoveryStatus] = useState('checking')
  const [password, setPassword] = useState('')
  const [passwordConfirm, setPasswordConfirm] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    let isActive = true
    const recoveryParams = new URLSearchParams(window.location.hash.slice(1))
    const isRecoveryLink = recoveryParams.get('type') === 'recovery'

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (isActive && event === 'PASSWORD_RECOVERY' && session) {
        setRecoveryStatus('ready')
      }
    })

    const verifyRecoverySession = async () => {
      try {
        const {
          data: { session },
          error: sessionError,
        } = await supabase.auth.getSession()

        if (!isActive) {
          return
        }

        if (sessionError || !session || !isRecoveryLink) {
          setRecoveryStatus('invalid')
          return
        }

        setRecoveryStatus('ready')
      } catch {
        if (isActive) {
          navigate('/error', { replace: true })
        }
      }
    }

    verifyRecoverySession()

    return () => {
      isActive = false
      subscription.unsubscribe()
    }
  }, [navigate])

  const handleSubmit = async (event) => {
    event.preventDefault()
    setError('')

    const passwordError = validatePassword(password)
    if (passwordError) {
      setError(passwordError)
      return
    }

    if (password !== passwordConfirm) {
      setError('비밀번호가 서로 일치하지 않습니다.')
      return
    }

    setLoading(true)

    try {
      const { error: updateError } = await supabase.auth.updateUser({ password })

      if (updateError) {
        setError(translateAuthError(updateError))
        return
      }

      const { error: signOutError } = await supabase.auth.signOut()
      if (signOutError) {
        navigate('/error', { replace: true })
        return
      }

      navigate('/login', {
        replace: true,
        state: { message: '비밀번호가 변경되었습니다. 새 비밀번호로 로그인해 주세요.' },
      })
    } catch {
      navigate('/error', { replace: true })
    } finally {
      setLoading(false)
    }
  }

  if (recoveryStatus === 'checking') {
    return (
      <AuthCard title="재설정 링크 확인">
        <div className="flex items-center justify-center py-8" role="status">
          <div
            className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"
            aria-hidden="true"
          />
          <span className="sr-only">재설정 링크를 확인하는 중입니다.</span>
        </div>
      </AuthCard>
    )
  }

  if (recoveryStatus === 'invalid') {
    return (
      <AuthCard title="재설정 링크 오류">
        <div
          className="bg-red-50 border border-red-200 rounded-lg px-3 py-3"
          role="alert"
        >
          <p className="text-red-600 text-sm">
            재설정 링크가 유효하지 않거나 만료되었습니다. 새 링크를 요청해 주세요.
          </p>
        </div>
        <Link
          to="/forgot-password"
          className="mt-5 block w-full text-center bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 rounded-lg text-sm transition"
        >
          새 링크 요청하기
        </Link>
      </AuthCard>
    )
  }

  return (
    <AuthCard title="새 비밀번호 설정">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label
            htmlFor="new-password"
            className="block text-sm font-medium text-gray-600 mb-1"
          >
            새 비밀번호
          </label>
          <input
            id="new-password"
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            required
            minLength={8}
            autoComplete="new-password"
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="영문+숫자 8자 이상"
          />
          <p className="text-xs text-gray-400 mt-1">영문 + 숫자 조합 8자 이상</p>
        </div>

        <div>
          <label
            htmlFor="new-password-confirm"
            className="block text-sm font-medium text-gray-600 mb-1"
          >
            새 비밀번호 확인
          </label>
          <input
            id="new-password-confirm"
            type="password"
            value={passwordConfirm}
            onChange={(event) => setPasswordConfirm(event.target.value)}
            required
            minLength={8}
            autoComplete="new-password"
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="새 비밀번호를 다시 입력하세요"
          />
        </div>

        {error ? (
          <div
            className="bg-red-50 border border-red-200 rounded-lg px-3 py-2"
            role="alert"
          >
            <p className="text-red-600 text-sm">{error}</p>
          </div>
        ) : null}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 rounded-lg text-sm transition disabled:opacity-50"
        >
          {loading ? '변경 중...' : '비밀번호 변경'}
        </button>
      </form>
    </AuthCard>
  )
}
