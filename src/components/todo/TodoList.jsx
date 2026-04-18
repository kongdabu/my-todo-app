import { useState } from 'react'
import { Plus, Search } from 'lucide-react'
import { useTodoStore } from '../../store/todoStore'
import { useAuthStore } from '../../store/authStore'
import TodoCard from './TodoCard'

const sortOptions = [
  { value: 'created_desc', label: '생성일 최신순' },
  { value: 'due_asc', label: '납기일 빠른순' },
  { value: 'priority_desc', label: '우선순위 높은순' },
  { value: 'title_asc', label: '제목 가나다순' },
]

export default function TodoList() {
  const { user } = useAuthStore()
  const { addTodo, loading, sortOption, setSortOption, searchQuery, setSearchQuery, getFilteredSortedTodos } = useTodoStore()
  const [newTitle, setNewTitle] = useState('')

  const handleAdd = async () => {
    const title = newTitle.trim()
    if (!title) return
    setNewTitle('')
    await addTodo(title, user.id)
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') handleAdd()
  }

  const filtered = getFilteredSortedTodos()

  return (
    <div className="flex-1 flex flex-col overflow-hidden p-4 gap-3">
      <div className="flex gap-2">
        <div className="flex-1 flex items-center gap-2 bg-white border border-gray-200 rounded-xl px-3 py-2">
          <Plus size={16} className="text-gray-400 shrink-0" />
          <input
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="새 할 일 추가..."
            className="flex-1 text-sm outline-none text-gray-700 placeholder-gray-400"
          />
          <button
            onClick={handleAdd}
            className="text-xs bg-blue-600 text-white px-3 py-1 rounded-lg hover:bg-blue-700 transition"
          >
            추가
          </button>
        </div>
      </div>

      <div className="flex gap-2">
        <div className="flex-1 flex items-center gap-2 bg-white border border-gray-200 rounded-lg px-3 py-1.5">
          <Search size={14} className="text-gray-400 shrink-0" />
          <input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="제목 검색..."
            className="flex-1 text-sm outline-none text-gray-700 placeholder-gray-400"
          />
        </div>
        <select
          value={sortOption}
          onChange={(e) => setSortOption(e.target.value)}
          className="bg-white border border-gray-200 rounded-lg px-2 py-1.5 text-sm text-gray-600 focus:outline-none"
        >
          {sortOptions.map((o) => (
            <option key={o.value} value={o.value}>{o.label}</option>
          ))}
        </select>
      </div>

      <div className="flex-1 overflow-y-auto space-y-2 pr-0.5">
        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-7 w-7 border-b-2 border-blue-500" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-12 text-gray-400 text-sm">할 일이 없습니다.</div>
        ) : (
          filtered.map((todo) => <TodoCard key={todo.id} todo={todo} />)
        )}
      </div>
    </div>
  )
}
