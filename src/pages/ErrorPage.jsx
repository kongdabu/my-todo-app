import { Link } from 'react-router-dom'
import AuthCard from '../components/auth/AuthCard'

export default function ErrorPage() {
  return (
    <AuthCard title="요청 처리 오류">
      <p className="text-sm text-gray-600 text-center">
        요청을 처리하는 중 문제가 발생했습니다. 잠시 후 다시 시도해 주세요.
      </p>
      <Link
        to="/login"
        className="mt-5 block w-full text-center bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 rounded-lg text-sm transition"
      >
        로그인으로 이동
      </Link>
    </AuthCard>
  )
}
