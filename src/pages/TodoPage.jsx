import TodoList from '../components/todo/TodoList'
import DetailPanel from '../components/todo/DetailPanel'
import { useTodoStore } from '../store/todoStore'

export default function TodoPage() {
  const { selectedTodo } = useTodoStore()

  return (
    <div className="flex flex-1 overflow-hidden">
      <TodoList />
      {selectedTodo && <DetailPanel />}
    </div>
  )
}
