import { useMemo } from 'react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import useCalculatorStore from '@/store/useCalculatorStore'
import { format } from 'date-fns'

export default function ValuationChart() {
  const { rounds } = useCalculatorStore()

  const chartData = useMemo(() => {
    return rounds.map(round => ({
      round: round.type.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' '),
      date: format(new Date(round.date), 'MMM yyyy'),
      preMoneyValuation: round.preMoneyValuation / 1000000, // Convert to millions
      investment: round.investment / 1000000,
      postMoneyValuation: round.postMoneyValuation / 1000000
    }))
  }, [rounds])

  const formatCurrency = (value) => {
    return `$${value.toFixed(1)}M`
  }

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-background border rounded-lg p-3 shadow-lg">
          <p className="font-semibold mb-2">{label}</p>
          {payload.map((entry, index) => (
            <p key={index} className="text-sm" style={{ color: entry.color }}>
              {entry.name}: {formatCurrency(entry.value)}
            </p>
          ))}
        </div>
      )
    }
    return null
  }

  if (chartData.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Valuation Growth</CardTitle>
          <CardDescription>
            Company valuation evolution across funding rounds
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-64 flex items-center justify-center text-muted-foreground">
            <p className="text-sm">Add funding rounds to see valuation growth</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Valuation Growth</CardTitle>
        <CardDescription>
          Pre-money, investment, and post-money valuations
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="round" />
            <YAxis
              label={{ value: 'Valuation ($M)', angle: -90, position: 'insideLeft' }}
              tickFormatter={formatCurrency}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            <Bar dataKey="preMoneyValuation" name="Pre-Money" fill="#0ea5e9" />
            <Bar dataKey="investment" name="Investment" fill="#10b981" />
            <Bar dataKey="postMoneyValuation" name="Post-Money" fill="#a855f7" />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
