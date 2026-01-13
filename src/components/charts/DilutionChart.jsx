import { useMemo } from 'react'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import useCalculatorStore from '@/store/useCalculatorStore'
import { format } from 'date-fns'

export default function DilutionChart() {
  const { rounds } = useCalculatorStore()

  const chartData = useMemo(() => {
    if (rounds.length === 0) return []

    const data = []
    let founderOwnership = 100 // Start at 100%

    // Initial state (before any rounds)
    data.push({
      date: 'Start',
      founderOwnership: 100,
      investorOwnership: 0,
      round: 'Initial',
    })

    // After each round
    rounds.forEach(round => {
      const dilution = (round.investment / round.postMoneyValuation) * 100
      founderOwnership = founderOwnership * (1 - dilution / 100)
      const investorOwnership = 100 - founderOwnership

      data.push({
        date: format(new Date(round.date), 'MMM yyyy'),
        founderOwnership: parseFloat(founderOwnership.toFixed(2)),
        investorOwnership: parseFloat(investorOwnership.toFixed(2)),
        round: round.type,
      })
    })

    return data
  }, [rounds])

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-background border rounded-lg p-3 shadow-lg">
          <p className="font-semibold mb-2">{label}</p>
          {payload.map((entry, index) => (
            <p key={index} className="text-sm" style={{ color: entry.color }}>
              {entry.name}: {entry.value.toFixed(2)}%
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
          <CardTitle>Dilution Over Time</CardTitle>
          <CardDescription>Track ownership changes as funding rounds happen</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-64 flex items-center justify-center text-muted-foreground">
            <p className="text-sm">Add funding rounds to see dilution progression</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Dilution Over Time</CardTitle>
        <CardDescription>Founder ownership decreases as investors join</CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis label={{ value: 'Ownership %', angle: -90, position: 'insideLeft' }} />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            <Line
              type="monotone"
              dataKey="founderOwnership"
              name="Founder Ownership"
              stroke="#0ea5e9"
              strokeWidth={2}
              dot={{ r: 4 }}
              activeDot={{ r: 6 }}
            />
            <Line
              type="monotone"
              dataKey="investorOwnership"
              name="Investor Ownership"
              stroke="#a855f7"
              strokeWidth={2}
              dot={{ r: 4 }}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
