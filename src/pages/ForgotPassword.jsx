import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import AuthCard from '../components/auth/AuthCard'
import { supabase } from '../lib/supabaseClient'
import { getAuthRedirectUrl, translateAuthError } from '../lib/authUtils'

export default function ForgotPassword() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (event) => {
    event.preventDefault()
    setError('')
    setMessage('')
    setLoading(true)

    try {
      const { error: resetError } = await supabase.auth.resetPasswordForEmail(
        email.trim(),
        {
          redirectTo: getAuthRedirectUrl('/reset-password'),
        },
      )

      if (resetError) {
        setError(translateAuthError(resetError))
        return
      }

      setMessage(
        '입력한 이메일로 재설정 링크를 보냈습니다. 계정 존재 여부와 관계없이 같은 안내가 표시됩니다.',
      )
    } catch {
      navigate('/error', { replace: true })
    } finally {
      setLoading(false)
    }
  }

  return (
    <AuthCard title="비밀번호 찾기">
      <p className="text-sm text-gray-500 mb-5">
        가입한 이메일을 입력하면 비밀번호 재설정 링크를 보내드립니다.
      </p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label
            htmlFor="recovery-email"
            className="block text-sm font-medium text-gray-600 mb-1"
          >
            이메일
          </label>
          <input
            id="recovery-email"
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            required
            autoComplete="email"
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="you@example.com"
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
          {loading ? '전송 중...' : '재설정 링크 보내기'}
        </button>
      </form>

      <p className="text-center text-sm text-gray-500 mt-6">
        <Link to="/login" className="text-blue-600 hover:underline font-medium">
          로그인으로 돌아가기
        </Link>
      </p>
    </AuthCard>
  )
}
