import { LayoutDashboard, List, AlertCircle, Clock, CheckCircle2, Zap, Star, Minus, Timer, X } from 'lucide-react'
import { useTodoStore } from '../../store/todoStore'

const statusItems = [
  { key: '미접수', label: '미접수', icon: <List size={16} />, color: 'text-gray-500' },
  { key: '진행', label: '진행', icon: <Clock size={16} />, color: 'text-blue-500' },
  { key: '지연', label: '지연', icon: <AlertCircle size={16} />, color: 'text-red-500' },
  { key: '완료', label: '완료', icon: <CheckCircle2 size={16} />, color: 'text-green-500' },
]

const priorityItems = [
  { key: '긴급', label: '긴급', icon: <Zap size={16} />, color: 'text-red-500' },
  { key: '중요', label: '중요', icon: <Star size={16} />, color: 'text-orange-500' },
  { key: '일반', label: '일반', icon: <Minus size={16} />, color: 'text-blue-500' },
  { key: '장기', label: '장기', icon: <Timer size={16} />, color: 'text-purple-500' },
]

export default function Sidebar({ isOpen, onClose }) {
  const { todos, sidebarFilter, setSidebarFilter } = useTodoStore()

  const countFor = (key) => {
    const statusList = ['미접수', '진행', '지연', '완료']
    const priorityList = ['긴급', '중요', '일반', '장기']
    if (statusList.includes(key)) return todos.filter((t) => t.status === key).length
    if (priorityList.includes(key)) return todos.filter((t) => t.priority === key).length
    return todos.length
  }

  const handleSelect = (key) => {
    setSidebarFilter(key)
    onClose?.()
  }

  const Item = ({ itemKey, label, icon, color }) => {
    const active = sidebarFilter === itemKey
    return (
      <button
        onClick={() => handleSelect(itemKey)}
        className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm transition ${
          active ? 'bg-blue-50 text-blue-700 font-medium' : 'text-gray-600 hover:bg-gray-100'
        }`}
      >
        <span className={`flex items-center gap-2 ${active ? 'text-blue-600' : color}`}>
          {icon}
          <span className={active ? 'text-blue-700' : 'text-gray-700'}>{label}</span>
        </span>
        <span className={`text-xs px-1.5 py-0.5 rounded-full ${active ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-500'}`}>
          {countFor(itemKey)}
        </span>
      </button>
    )
  }

  return (
    <>
      {/* 모바일 오버레이 배경 */}
      {isOpen && (
        <div
          className="md:hidden fixed inset-0 bg-black/40 z-20"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      <aside className={`
        fixed md:static inset-y-0 left-0 z-30
        w-56 shrink-0 bg-white border-r border-gray-200 p-3
        flex flex-col gap-1 overflow-y-auto
        transition-transform duration-200
        md:translate-x-0
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        {/* 모바일 닫기 버튼 */}
        <div className="md:hidden flex justify-end mb-1">
          <button onClick={onClose} className="p-1 text-gray-400 hover:text-gray-600" aria-label="메뉴 닫기">
            <X size={18} />
          </button>
        </div>

        <button
          onClick={() => handleSelect('dashboard')}
          className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition ${
            sidebarFilter === 'dashboard' ? 'bg-blue-50 text-blue-700 font-medium' : 'text-gray-600 hover:bg-gray-100'
          }`}
        >
          <LayoutDashboard size={16} className={sidebarFilter === 'dashboard' ? 'text-blue-600' : 'text-gray-400'} />
          대시보드
        </button>

        <button
          onClick={() => handleSelect('all')}
          className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm transition ${
            sidebarFilter === 'all' ? 'bg-blue-50 text-blue-700 font-medium' : 'text-gray-600 hover:bg-gray-100'
          }`}
        >
          <span className="flex items-center gap-2">
            <List size={16} className={sidebarFilter === 'all' ? 'text-blue-600' : 'text-gray-400'} />
            전체 할 일
          </span>
          <span className={`text-xs px-1.5 py-0.5 rounded-full ${sidebarFilter === 'all' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-500'}`}>
            {todos.length}
          </span>
        </button>

        <div className="pt-2">
          <p className="text-xs font-semibold text-gray-400 uppercase px-3 mb-1">상태별</p>
          {statusItems.map((item) => (
            <Item key={item.key} itemKey={item.key} label={item.label} icon={item.icon} color={item.color} />
          ))}
        </div>

        <div className="pt-2">
          <p className="text-xs font-semibold text-gray-400 uppercase px-3 mb-1">우선순위</p>
          {priorityItems.map((item) => (
            <Item key={item.key} itemKey={item.key} label={item.label} icon={item.icon} color={item.color} />
          ))}
        </div>
      </aside>
    </>
  )
}
