import { useEffect, useState } from 'react'
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell
} from 'recharts'
import { getDashboardStats } from '../utils/stats'
import { getUser } from '../utils/auth'

type Stats = {
  totalSentThisMonth: number
  totalFeesThisMonth: number
  totalTransactions: number
  successRate: number
  dailyVolume: { date: string; amount: number }[]
  statusBreakdown: { status: string; count: number }[]
  recentTransactions: any[]
}

const STATUS_COLORS: Record<string, string> = {
  success: '#16a34a',
  pending: '#d97706',
  failed: '#dc2626'
}

export default function Dashboard() {
  const [stats, setStats] = useState<Stats | null>(null)
  const [loading, setLoading] = useState(true)
  const user = getUser()

  useEffect(() => {
    const load = async () => {
      try {
        const data = await getDashboardStats()
        setStats(data)
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  if (loading) {
    return <div className="p-8 text-gray-500">Loading dashboard...</div>
  }

  if (!stats) {
    return <div className="p-8 text-gray-500">Could not load stats</div>
  }

  const chartData = stats.dailyVolume.map(d => ({
    day: new Date(d.date).toLocaleDateString('en-US', { weekday: 'short' }),
    amount: d.amount
  }))

  const pieData = stats.statusBreakdown.map(s => ({
    name: s.status,
    value: s.count
  }))

  return (
    <div className="p-8 max-w-5xl mx-auto">
      <h1 className="text-2xl font-bold mb-1">Welcome back, {user?.name?.split(' ')[0]} 👋</h1>
      <p className="text-gray-500 text-sm mb-8">Here's how your account is doing</p>

      {/* Stat cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-blue-600 text-white p-5 rounded-2xl">
          <p className="text-blue-100 text-xs mb-1">Sent this month</p>
          <p className="text-2xl font-bold">₦{stats.totalSentThisMonth.toLocaleString()}</p>
        </div>
        <div className="bg-white border border-gray-100 p-5 rounded-2xl">
          <p className="text-gray-500 text-xs mb-1">Total transactions</p>
          <p className="text-2xl font-bold">{stats.totalTransactions}</p>
        </div>
        <div className="bg-white border border-gray-100 p-5 rounded-2xl">
          <p className="text-gray-500 text-xs mb-1">Success rate</p>
          <p className="text-2xl font-bold">{stats.successRate}%</p>
        </div>
        <div className="bg-white border border-gray-100 p-5 rounded-2xl">
          <p className="text-gray-500 text-xs mb-1">Fees paid</p>
          <p className="text-2xl font-bold">₦{stats.totalFeesThisMonth.toLocaleString()}</p>
        </div>
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="md:col-span-2 bg-white border border-gray-100 p-5 rounded-2xl">
          <p className="text-sm font-medium mb-4">Volume — last 7 days</p>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="day" tick={{ fontSize: 12 }} stroke="#999" />
              <YAxis tick={{ fontSize: 12 }} stroke="#999" />
              <Tooltip formatter={(v: number) => `₦${v.toLocaleString()}`} />
              <Line type="monotone" dataKey="amount" stroke="#2563eb" strokeWidth={2} dot={{ r: 3 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white border border-gray-100 p-5 rounded-2xl">
          <p className="text-sm font-medium mb-4">Status breakdown</p>
          {pieData.length === 0 ? (
            <p className="text-gray-400 text-xs text-center mt-12">No data yet</p>
          ) : (
            <ResponsiveContainer width="100%" height={180}>
              <PieChart>
                <Pie data={pieData} dataKey="value" nameKey="name" innerRadius={40} outerRadius={70}>
                  {pieData.map((entry, i) => (
                    <Cell key={i} fill={STATUS_COLORS[entry.name] || '#999'} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          )}
          <div className="flex flex-wrap gap-3 mt-2 justify-center">
            {pieData.map((entry, i) => (
              <div key={i} className="flex items-center gap-1.5 text-xs text-gray-500">
                <span className="w-2 h-2 rounded-full" style={{ background: STATUS_COLORS[entry.name] }} />
                {entry.name} ({entry.value})
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent transactions */}
      <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden">
        <p className="text-sm font-medium p-5 pb-0">Recent transactions</p>
        {stats.recentTransactions.length === 0 ? (
          <p className="text-gray-400 text-sm text-center py-12">No transactions yet</p>
        ) : (
          <div className="divide-y divide-gray-100">
            {stats.recentTransactions.map((tx: any) => (
              <div key={tx.id} className="flex items-center justify-between p-4">
                <div>
                  <p className="text-sm font-medium">{tx.recipient}</p>
                  <p className="text-xs text-gray-400">{tx.type} · {new Date(tx.createdAt).toLocaleDateString()}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold">₦{tx.amount.toLocaleString()}</p>
                  <span className={`text-xs ${tx.status === 'success' ? 'text-green-600' : tx.status === 'failed' ? 'text-red-600' : 'text-amber-600'}`}>
                    {tx.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
