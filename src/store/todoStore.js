import { create } from 'zustand'
import { supabase } from '../lib/supabaseClient'
import { isAfter, startOfDay, startOfWeek, endOfWeek } from 'date-fns'

export const useTodoStore = create((set, get) => ({
  todos: [],
  loading: false,
  selectedTodo: null,
  sidebarFilter: 'all',
  sortOption: 'created_desc',
  searchQuery: '',

  setSelectedTodo: (todo) => set({ selectedTodo: todo }),
  setSidebarFilter: (filter) => set({ sidebarFilter: filter }),
  setSortOption: (option) => set({ sortOption: option }),
  setSearchQuery: (query) => set({ searchQuery: query }),

  fetchTodos: async () => {
    set({ loading: true })
    const { data, error } = await supabase
      .from('todos')
      .select('*')
      .order('created_at', { ascending: false })
    if (!error) set({ todos: data })
    set({ loading: false })
  },

  autoUpdateDelayed: async () => {
    const today = startOfDay(new Date())
    const { todos } = get()
    const toDelay = todos.filter(
      (t) => t.due_date && t.status !== '완료' && t.status !== '지연' &&
        isAfter(today, startOfDay(new Date(t.due_date)))
    )
    for (const t of toDelay) {
      await supabase.from('todos').update({ status: '지연' }).eq('id', t.id)
    }
    if (toDelay.length > 0) {
      await get().fetchTodos()
    }
  },

  addTodo: async (title, userId) => {
    const { error } = await supabase.from('todos').insert({
      title,
      status: '미접수',
      priority: '일반',
      user_id: userId,
    })
    if (!error) await get().fetchTodos()
  },

  updateTodo: async (id, updates) => {
    const { error } = await supabase.from('todos').update(updates).eq('id', id)
    if (!error) {
      await get().fetchTodos()
      const updated = get().todos.find((t) => t.id === id)
      if (updated) set({ selectedTodo: updated })
    }
  },

  deleteTodo: async (id) => {
    await supabase.from('todos').delete().eq('id', id)
    set({ selectedTodo: null })
    await get().fetchTodos()
  },

  getFilteredSortedTodos: () => {
    const { todos, sidebarFilter, sortOption, searchQuery } = get()
    const statusList = ['미접수', '진행', '지연', '완료']
    const priorityList = ['긴급', '중요', '일반', '장기']

    let result = [...todos]

    if (searchQuery) {
      result = result.filter((t) =>
        t.title.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    if (sidebarFilter !== 'all' && sidebarFilter !== 'dashboard') {
      if (statusList.includes(sidebarFilter)) {
        result = result.filter((t) => t.status === sidebarFilter)
      } else if (priorityList.includes(sidebarFilter)) {
        result = result.filter((t) => t.priority === sidebarFilter)
      }
    }

    const priorityOrder = { 긴급: 0, 중요: 1, 일반: 2, 장기: 3 }
    result.sort((a, b) => {
      switch (sortOption) {
        case 'due_asc':
          if (!a.due_date) return 1
          if (!b.due_date) return -1
          return new Date(a.due_date) - new Date(b.due_date)
        case 'priority_desc':
          return priorityOrder[a.priority] - priorityOrder[b.priority]
        case 'created_desc':
          return new Date(b.created_at) - new Date(a.created_at)
        case 'title_asc':
          return a.title.localeCompare(b.title, 'ko')
        default:
          return 0
      }
    })

    return result
  },

  getDashboardStats: () => {
    const { todos } = get()
    const today = startOfDay(new Date())
    const weekStart = startOfWeek(new Date(), { weekStartsOn: 1 })
    const weekEnd = endOfWeek(new Date(), { weekStartsOn: 1 })

    const statusCounts = { 미접수: 0, 진행: 0, 지연: 0, 완료: 0 }
    todos.forEach((t) => { statusCounts[t.status] = (statusCounts[t.status] || 0) + 1 })

    const todayDue = todos.filter(
      (t) => t.due_date && startOfDay(new Date(t.due_date)).getTime() === today.getTime()
    )

    const delayedCount = todos.filter((t) => t.status === '지연').length

    const weeklyCompleted = todos.filter(
      (t) =>
        t.status === '완료' &&
        t.completed_at &&
        new Date(t.completed_at) >= weekStart &&
        new Date(t.completed_at) <= weekEnd
    ).length

    return { statusCounts, todayDue, delayedCount, weeklyCompleted }
  },
}))
