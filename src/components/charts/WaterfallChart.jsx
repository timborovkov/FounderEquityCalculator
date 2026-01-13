import { useMemo } from 'react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'

const COLORS = ['#0ea5e9', '#a855f7', '#10b981', '#f59e0b', '#ef4444']

export default function WaterfallChart({ waterfallData, exitValuation }) {
  const chartData = useMemo(() => {
    if (!waterfallData || !waterfallData.stakeholderTotals) return []

    return waterfallData.stakeholderTotals.map((st, index) => ({
      stakeholder: st.stakeholder,
      payout: st.total / 1000000, // Convert to millions
      color: COLORS[index % COLORS.length]
    }))
  }, [waterfallData])

  const formatCurrency = (value) => {
    return `$${value.toFixed(2)}M`
  }

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-background border rounded-lg p-3 shadow-lg">
          <p className="font-semibold mb-1">{payload[0].payload.stakeholder}</p>
          <p className="text-sm text-muted-foreground">
            Payout: {formatCurrency(payload[0].value)}
          </p>
          <p className="text-xs text-muted-foreground">
            {((payload[0].value / (exitValuation / 1000000)) * 100).toFixed(1)}% of exit
          </p>
        </div>
      )
    }
    return null
  }

  if (chartData.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Waterfall Analysis</CardTitle>
          <CardDescription>
            Distribution of exit proceeds to stakeholders
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-64 flex items-center justify-center text-muted-foreground">
            <p className="text-sm">Create an exit scenario to see the waterfall</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Waterfall Analysis</CardTitle>
        <CardDescription>
          Exit proceeds distribution at {formatCurrency(exitValuation / 1000000)}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData} layout="vertical">
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis type="number" tickFormatter={formatCurrency} />
            <YAxis dataKey="stakeholder" type="category" width={120} />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="payout" name="Payout">
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
