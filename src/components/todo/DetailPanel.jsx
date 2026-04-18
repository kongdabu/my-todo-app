import { useState, useEffect } from 'react'
import { X, Trash2 } from 'lucide-react'
import { useTodoStore } from '../../store/todoStore'

const statusOptions = ['미접수', '진행', '지연', '완료']
const priorityOptions = ['긴급', '중요', '일반', '장기']

export default function DetailPanel() {
  const { selectedTodo, setSelectedTodo, updateTodo, deleteTodo } = useTodoStore()
  const [form, setForm] = useState(null)

  useEffect(() => {
    if (selectedTodo) setForm({ ...selectedTodo })
  }, [selectedTodo])

  if (!selectedTodo || !form) return null

  const handleChange = (field, value) => {
    const updated = { ...form, [field]: value }
    if (field === 'status' && value === '완료' && !form.completed_at) {
      updated.completed_at = new Date().toISOString()
    }
    if (field === 'status' && value !== '완료') {
      updated.completed_at = null
    }
    setForm(updated)
  }

  const handleBlur = (field) => {
    updateTodo(selectedTodo.id, { [field]: form[field] })
  }

  const handleSelectChange = (field, value) => {
    const updated = { ...form, [field]: value }
    if (field === 'status' && value === '완료' && !form.completed_at) {
      updated.completed_at = new Date().toISOString()
    }
    if (field === 'status' && value !== '완료') {
      updated.completed_at = null
    }
    setForm(updated)
    updateTodo(selectedTodo.id, updated)
  }

  const handleDelete = async () => {
    if (confirm('삭제하시겠습니까?')) deleteTodo(selectedTodo.id)
  }

  const formatDatetimeLocal = (iso) => {
    if (!iso) return ''
    const d = new Date(iso)
    const pad = (n) => String(n).padStart(2, '0')
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`
  }

  return (
    <aside className="w-80 shrink-0 bg-white border-l border-gray-200 flex flex-col overflow-y-auto">
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200">
        <h2 className="font-semibold text-gray-700 text-sm">상세 / 편집</h2>
        <button onClick={() => setSelectedTodo(null)} className="text-gray-400 hover:text-gray-600">
          <X size={18} />
        </button>
      </div>

      <div className="p-4 space-y-4 flex-1">
        <div>
          <label className="text-xs font-medium text-gray-500 mb-1 block">제목</label>
          <input
            value={form.title}
            onChange={(e) => handleChange('title', e.target.value)}
            onBlur={() => handleBlur('title')}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="text-xs font-medium text-gray-500 mb-1 block">설명</label>
          <textarea
            value={form.description || ''}
            onChange={(e) => handleChange('description', e.target.value)}
            onBlur={() => handleBlur('description')}
            rows={3}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-xs font-medium text-gray-500 mb-1 block">상태</label>
            <select
              value={form.status}
              onChange={(e) => handleSelectChange('status', e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-2 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {statusOptions.map((s) => <option key={s}>{s}</option>)}
            </select>
          </div>
          <div>
            <label className="text-xs font-medium text-gray-500 mb-1 block">우선순위</label>
            <select
              value={form.priority}
              onChange={(e) => handleSelectChange('priority', e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-2 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {priorityOptions.map((p) => <option key={p}>{p}</option>)}
            </select>
          </div>
        </div>

        <div>
          <label className="text-xs font-medium text-gray-500 mb-1 block">생성일</label>
          <p className="text-sm text-gray-600">{new Date(form.created_at).toLocaleString('ko-KR')}</p>
        </div>

        <div>
          <label className="text-xs font-medium text-gray-500 mb-1 block">납기일</label>
          <input
            type="date"
            value={form.due_date || ''}
            onChange={(e) => handleChange('due_date', e.target.value || null)}
            onBlur={() => handleBlur('due_date')}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {form.status === '완료' && (
          <div>
            <label className="text-xs font-medium text-gray-500 mb-1 block">완료일시</label>
            <input
              type="datetime-local"
              value={formatDatetimeLocal(form.completed_at)}
              onChange={(e) => handleChange('completed_at', e.target.value ? new Date(e.target.value).toISOString() : null)}
              onBlur={() => handleBlur('completed_at')}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        )}
      </div>

      <div className="p-4 border-t border-gray-200">
        <button
          onClick={handleDelete}
          className="w-full flex items-center justify-center gap-2 text-sm text-red-500 hover:bg-red-50 border border-red-200 rounded-lg py-2 transition"
        >
          <Trash2 size={15} />
          삭제
        </button>
      </div>
    </aside>
  )
}
