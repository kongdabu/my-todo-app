import { differenceInDays, startOfDay } from 'date-fns'
import { useTodoStore } from '../../store/todoStore'

const statusStyle = {
  미접수: 'bg-gray-100 text-gray-600',
  진행: 'bg-blue-100 text-blue-700',
  지연: 'bg-red-100 text-red-700',
  완료: 'bg-green-100 text-green-700',
}

const priorityStyle = {
  긴급: 'bg-red-100 text-red-700',
  중요: 'bg-orange-100 text-orange-700',
  일반: 'bg-blue-100 text-blue-700',
  장기: 'bg-purple-100 text-purple-700',
}

export default function TodoCard({ todo }) {
  const { selectedTodo, setSelectedTodo, updateTodo } = useTodoStore()
  const isSelected = selectedTodo?.id === todo.id

  const today = startOfDay(new Date())
  const dueDate = todo.due_date ? startOfDay(new Date(todo.due_date)) : null
  const diffDays = dueDate ? differenceInDays(today, dueDate) : null
  const isOverdue = diffDays !== null && diffDays > 0 && todo.status !== '완료'

  const handleCheck = (e) => {
    e.stopPropagation()
    const isDone = todo.status !== '완료'
    updateTodo(todo.id, {
      status: isDone ? '완료' : '미접수',
      completed_at: isDone ? new Date().toISOString() : null,
    })
  }

  return (
    <div
      onClick={() => setSelectedTodo(isSelected ? null : todo)}
      className={`bg-white rounded-xl border p-4 cursor-pointer transition hover:shadow-md ${
        isSelected ? 'border-blue-400 shadow-md' : 'border-gray-200'
      }`}
    >
      <div className="flex items-start gap-3">
        <input
          type="checkbox"
          checked={todo.status === '완료'}
          onChange={handleCheck}
          onClick={(e) => e.stopPropagation()}
          className="mt-1 h-4 w-4 rounded border-gray-300 text-blue-600 cursor-pointer shrink-0"
        />
        <div className="flex-1 min-w-0">
          <p className={`text-sm font-medium truncate ${todo.status === '완료' ? 'line-through text-gray-400' : 'text-gray-800'}`}>
            {todo.title}
          </p>
          <div className="flex flex-wrap items-center gap-1.5 mt-2">
            <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${statusStyle[todo.status]}`}>
              {todo.status}
            </span>
            <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${priorityStyle[todo.priority]}`}>
              {todo.priority}
            </span>
            {dueDate ? (
              isOverdue ? (
                <span className="text-xs font-semibold text-red-600">D+{diffDays}</span>
              ) : (
                <span className="text-xs text-gray-400">{todo.due_date}</span>
              )
            ) : (
              <span className="text-xs text-gray-300">납기 없음</span>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
