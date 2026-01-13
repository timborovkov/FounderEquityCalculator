import { useMemo } from 'react'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import useCalculatorStore from '@/store/useCalculatorStore'
import { calculateVestedShares } from '@/lib/calculations/vesting'
import { differenceInMonths, format } from 'date-fns'

export default function VestingGantt() {
  const { company, founders, employees } = useCalculatorStore()

  const vestingData = useMemo(() => {
    const currentDate = company.currentDate || new Date()
    const data = []

    // Founders
    founders.forEach(founder => {
      if (founder.vestingStart) {
        const vesting = calculateVestedShares(
          founder.vestingStart,
          currentDate,
          100, // Use 100 for percentage
          founder.cliffMonths,
          founder.vestingMonths
        )

        const startDate = new Date(founder.vestingStart)
        const endDate = new Date(startDate)
        endDate.setMonth(endDate.getMonth() + founder.vestingMonths)

        const cliffDate = new Date(startDate)
        cliffDate.setMonth(cliffDate.getMonth() + founder.cliffMonths)

        data.push({
          name: founder.name,
          type: 'Founder',
          startDate,
          cliffDate,
          endDate,
          percentVested: vesting.percentVested,
          vestingMonths: founder.vestingMonths,
          cliffMonths: founder.cliffMonths,
          monthsElapsed: differenceInMonths(currentDate, startDate),
        })
      }
    })

    // Employees (top 10 to avoid clutter)
    employees.slice(0, 10).forEach(emp => {
      if (emp.grantDate) {
        const vesting = calculateVestedShares(
          emp.grantDate,
          currentDate,
          100,
          emp.cliffMonths || 12,
          emp.vestingMonths || 48
        )

        const startDate = new Date(emp.grantDate)
        const endDate = new Date(startDate)
        endDate.setMonth(endDate.getMonth() + (emp.vestingMonths || 48))

        const cliffDate = new Date(startDate)
        cliffDate.setMonth(cliffDate.getMonth() + (emp.cliffMonths || 12))

        data.push({
          name: emp.name,
          type: 'Employee',
          startDate,
          cliffDate,
          endDate,
          percentVested: vesting.percentVested,
          vestingMonths: emp.vestingMonths || 48,
          cliffMonths: emp.cliffMonths || 12,
          monthsElapsed: differenceInMonths(currentDate, startDate),
        })
      }
    })

    return data.sort((a, b) => a.startDate - b.startDate)
  }, [founders, employees, company.currentDate])

  if (vestingData.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Vesting Schedules</CardTitle>
          <CardDescription>Timeline view of founder and employee vesting</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-64 flex items-center justify-center text-muted-foreground">
            <p className="text-sm">Add founders or employees to see vesting schedules</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Vesting Schedules</CardTitle>
        <CardDescription>Track vesting progress for all stakeholders</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {vestingData.map((item, index) => (
            <div key={index} className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="font-medium">{item.name}</span>
                  <Badge variant={item.type === 'Founder' ? 'default' : 'secondary'}>
                    {item.type}
                  </Badge>
                </div>
                <div className="text-sm text-muted-foreground">
                  {item.percentVested.toFixed(1)}% vested
                </div>
              </div>

              <div className="space-y-1">
                <Progress value={item.percentVested} className="h-2" />

                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>{format(item.startDate, 'MMM yyyy')}</span>
                  <span className="font-medium">Cliff: {format(item.cliffDate, 'MMM yyyy')}</span>
                  <span>{format(item.endDate, 'MMM yyyy')}</span>
                </div>
              </div>

              <div className="flex items-center gap-4 text-xs text-muted-foreground">
                <span>
                  {item.monthsElapsed} of {item.vestingMonths} months
                </span>
                {item.monthsElapsed < item.cliffMonths && (
                  <Badge variant="outline" className="text-xs">
                    Pre-cliff ({item.cliffMonths - item.monthsElapsed}mo remaining)
                  </Badge>
                )}
                {item.monthsElapsed >= item.vestingMonths && (
                  <Badge variant="default" className="text-xs bg-success-600">
                    Fully Vested
                  </Badge>
                )}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
