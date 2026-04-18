import { CheckSquare, LogOut, Menu } from 'lucide-react'
import { useAuthStore } from '../../store/authStore'

export default function Header({ onMenuClick }) {
  const { user, logout } = useAuthStore()

  return (
    <header className="bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between shrink-0">
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuClick}
          className="md:hidden text-gray-500 hover:text-gray-700 p-1 rounded-lg hover:bg-gray-100 transition"
          aria-label="메뉴 열기"
        >
          <Menu size={20} />
        </button>
        <div className="flex items-center gap-2">
          <CheckSquare className="text-blue-600" size={22} />
          <span className="font-bold text-gray-800 text-base">My Todo</span>
        </div>
      </div>
      <div className="flex items-center gap-3">
        <span className="text-sm text-gray-500 hidden sm:block truncate max-w-40">{user?.email}</span>
        <button
          onClick={logout}
          className="flex items-center gap-1 text-sm text-gray-500 hover:text-red-500 transition"
          aria-label="로그아웃"
        >
          <LogOut size={16} />
          <span className="hidden sm:inline">로그아웃</span>
        </button>
      </div>
    </header>
  )
}
