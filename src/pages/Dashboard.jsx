import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { useTodoStore } from '../store/todoStore'
import { AlertCircle, CheckCircle2, Calendar, TrendingUp } from 'lucide-react'

const STATUS_COLORS = {
  미접수: '#9ca3af',
  진행: '#3b82f6',
  지연: '#ef4444',
  완료: '#22c55e',
}

export default function Dashboard() {
  const { getDashboardStats } = useTodoStore()
  const { statusCounts, todayDue, delayedCount, weeklyCompleted } = getDashboardStats()

  const chartData = Object.entries(statusCounts)
    .filter(([, v]) => v > 0)
    .map(([name, value]) => ({ name, value }))

  return (
    <div className="flex-1 overflow-y-auto p-6">
      <h2 className="text-lg font-bold text-gray-800 mb-5">대시보드</h2>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {Object.entries(statusCounts).map(([status, count]) => (
          <div key={status} className="bg-white rounded-xl border border-gray-200 p-4 text-center">
            <p className="text-2xl font-bold" style={{ color: STATUS_COLORS[status] }}>{count}</p>
            <p className="text-xs text-gray-500 mt-1">{status}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
        <div className="bg-white rounded-xl border border-gray-200 p-4 flex items-center gap-4">
          <div className="p-2 bg-red-50 rounded-lg">
            <AlertCircle className="text-red-500" size={22} />
          </div>
          <div>
            <p className="text-2xl font-bold text-gray-800">{delayedCount}</p>
            <p className="text-xs text-gray-500">지연 중인 항목</p>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4 flex items-center gap-4">
          <div className="p-2 bg-green-50 rounded-lg">
            <CheckCircle2 className="text-green-500" size={22} />
          </div>
          <div>
            <p className="text-2xl font-bold text-gray-800">{weeklyCompleted}</p>
            <p className="text-xs text-gray-500">이번 주 완료</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <h3 className="text-sm font-semibold text-gray-700 mb-4 flex items-center gap-2">
            <TrendingUp size={16} className="text-blue-500" /> 상태별 현황
          </h3>
          {chartData.length > 0 ? (
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie data={chartData} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={55} outerRadius={85} paddingAngle={3}>
                  {chartData.map((entry) => (
                    <Cell key={entry.name} fill={STATUS_COLORS[entry.name]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-sm text-gray-400 text-center py-8">데이터가 없습니다.</p>
          )}
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <h3 className="text-sm font-semibold text-gray-700 mb-4 flex items-center gap-2">
            <Calendar size={16} className="text-blue-500" /> 오늘 납기
          </h3>
          {todayDue.length === 0 ? (
            <p className="text-sm text-gray-400 text-center py-8">오늘 납기인 항목이 없습니다.</p>
          ) : (
            <ul className="space-y-2">
              {todayDue.map((t) => (
                <li key={t.id} className="flex items-center gap-2 text-sm text-gray-700 bg-gray-50 rounded-lg px-3 py-2">
                  <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: STATUS_COLORS[t.status] }} />
                  <span className="truncate">{t.title}</span>
                  <span className="ml-auto text-xs text-gray-400 shrink-0">{t.status}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  )
}
