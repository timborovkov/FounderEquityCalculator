import { useMemo } from 'react'
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import useCalculatorStore from '@/store/useCalculatorStore'
import { calculateCurrentOwnership } from '@/lib/calculations/dilution'

const COLORS = {
  founder: '#0ea5e9', // primary-500
  investor: '#a855f7', // secondary-500
  employee: '#10b981', // success-500
  pool: '#94a3b8', // muted
}

export default function OwnershipPieChart() {
  const { founders, rounds, employees, optionPool } = useCalculatorStore()

  const chartData = useMemo(() => {
    const { stakeholders } = calculateCurrentOwnership(founders, rounds, employees)

    // Group by type
    const founderOwnership = stakeholders
      .filter(s => s.type === 'founder')
      .reduce((sum, s) => sum + s.ownership, 0)

    const investorOwnership = stakeholders
      .filter(s => s.type === 'investor')
      .reduce((sum, s) => sum + s.ownership, 0)

    const employeeOwnership = stakeholders
      .filter(s => s.type === 'employee')
      .reduce((sum, s) => sum + s.ownership, 0)

    const poolRemaining = optionPool.size - employeeOwnership

    const data = []

    if (founderOwnership > 0) {
      data.push({
        name: 'Founders',
        value: founderOwnership,
        color: COLORS.founder,
      })
    }

    if (investorOwnership > 0) {
      data.push({
        name: 'Investors',
        value: investorOwnership,
        color: COLORS.investor,
      })
    }

    if (employeeOwnership > 0) {
      data.push({
        name: 'Employees',
        value: employeeOwnership,
        color: COLORS.employee,
      })
    }

    if (poolRemaining > 0) {
      data.push({
        name: 'Option Pool',
        value: poolRemaining,
        color: COLORS.pool,
      })
    }

    return data
  }, [founders, rounds, employees, optionPool])

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-background border rounded-lg p-3 shadow-lg">
          <p className="font-semibold">{payload[0].name}</p>
          <p className="text-sm text-muted-foreground">{payload[0].value.toFixed(2)}%</p>
        </div>
      )
    }
    return null
  }

  if (chartData.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Ownership Breakdown</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64 flex items-center justify-center text-muted-foreground">
            <p className="text-sm">No data to display</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Ownership Breakdown</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, value }) => `${name}: ${value.toFixed(1)}%`}
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
              animationBegin={0}
              animationDuration={800}
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
