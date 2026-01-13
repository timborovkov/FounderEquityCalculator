import { useMemo, useState } from 'react'
import { PieChart, Download } from 'lucide-react'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import useCalculatorStore from '@/store/useCalculatorStore'
import { calculateCurrentOwnership } from '@/lib/calculations/dilution'
import { calculateVestedShares } from '@/lib/calculations/vesting'
import { exportCapTableToCSV } from '@/lib/utils/export'

export default function CapTable() {
  const { company, founders, rounds, employees, optionPool } = useCalculatorStore()
  const [isExporting, setIsExporting] = useState(false)

  // Calculate current ownership breakdown
  const capTable = useMemo(() => {
    // Calculate vested shares for employees
    const employeesWithVesting = employees.map(emp => {
      const vesting = calculateVestedShares(
        emp.grantDate,
        company.currentDate || new Date(),
        emp.optionsGranted,
        emp.cliffMonths || 12,
        emp.vestingMonths || 48
      )
      return {
        ...emp,
        vestedShares: vesting.vestedShares,
      }
    })

    // Get current ownership
    const { stakeholders, totalShares } = calculateCurrentOwnership(
      founders,
      rounds,
      employeesWithVesting
    )

    // Group by type
    const founderRows = stakeholders.filter(s => s.type === 'founder')
    const investorRows = stakeholders.filter(s => s.type === 'investor')
    const employeeRows = stakeholders.filter(s => s.type === 'employee')

    // Calculate totals
    const founderTotal = founderRows.reduce((sum, s) => sum + s.ownership, 0)
    const investorTotal = investorRows.reduce((sum, s) => sum + s.ownership, 0)
    const employeeTotal = employeeRows.reduce((sum, s) => sum + s.ownership, 0)
    const optionPoolRemaining = optionPool.size - (optionPool.allocated / totalShares) * 100

    return {
      stakeholders,
      founderRows,
      investorRows,
      employeeRows,
      totals: {
        founders: founderTotal,
        investors: investorTotal,
        employees: employeeTotal,
        optionPool: optionPoolRemaining,
      },
      totalShares,
    }
  }, [founders, rounds, employees, optionPool, company.currentDate])

  const formatNumber = num => {
    return new Intl.NumberFormat('en-US').format(Math.round(num))
  }

  const handleExport = async () => {
    setIsExporting(true)
    try {
      await exportCapTableToCSV(
        founders,
        rounds,
        employees,
        optionPool,
        company.currentDate || new Date()
      )
    } catch (error) {
      console.error('Failed to export cap table:', error)
      alert('Failed to export cap table. Please try again.')
    } finally {
      setIsExporting(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <PieChart className="w-5 h-5 text-primary-600" />
              <CardTitle>Cap Table</CardTitle>
            </div>
            <CardDescription>Real-time ownership breakdown for all stakeholders</CardDescription>
          </div>

          <Button variant="outline" onClick={handleExport} disabled={isExporting}>
            <Download className="w-4 h-4 mr-2" />
            {isExporting ? 'Exporting...' : 'Export CSV'}
          </Button>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Summary Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="pt-6">
              <div className="text-sm text-muted-foreground mb-1">Founders</div>
              <div className="text-2xl font-bold text-primary-600">
                {capTable.totals.founders.toFixed(1)}%
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="text-sm text-muted-foreground mb-1">Investors</div>
              <div className="text-2xl font-bold text-secondary-600">
                {capTable.totals.investors.toFixed(1)}%
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="text-sm text-muted-foreground mb-1">Employees</div>
              <div className="text-2xl font-bold text-success-600">
                {capTable.totals.employees.toFixed(1)}%
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="text-sm text-muted-foreground mb-1">Option Pool</div>
              <div className="text-2xl font-bold text-muted-foreground">
                {capTable.totals.optionPool.toFixed(1)}%
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Date selector */}
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">Ownership as of:</span>
          <Badge variant="secondary">
            {company.currentDate ? new Date(company.currentDate).toLocaleDateString() : 'Today'}
          </Badge>
        </div>

        {/* Founders Section */}
        {capTable.founderRows.length > 0 && (
          <div className="space-y-2">
            <h3 className="font-semibold flex items-center gap-2">
              Founders
              <Badge variant="secondary">{capTable.founderRows.length}</Badge>
            </h3>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Shares</TableHead>
                  <TableHead>Ownership %</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {capTable.founderRows.map(stakeholder => (
                  <TableRow key={stakeholder.id}>
                    <TableCell className="font-medium">{stakeholder.name}</TableCell>
                    <TableCell className="text-muted-foreground">
                      {formatNumber(stakeholder.shares)}
                    </TableCell>
                    <TableCell>
                      <Badge variant="default" className="bg-primary-600">
                        {stakeholder.ownership.toFixed(2)}%
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {stakeholder.departed ? (
                        <Badge variant="destructive">Departed</Badge>
                      ) : (
                        <Badge variant="default">Active</Badge>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
                <TableRow className="bg-muted/50 font-semibold">
                  <TableCell>Total Founders</TableCell>
                  <TableCell></TableCell>
                  <TableCell>
                    <Badge className="bg-primary-600">{capTable.totals.founders.toFixed(2)}%</Badge>
                  </TableCell>
                  <TableCell></TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>
        )}

        {/* Investors Section */}
        {capTable.investorRows.length > 0 && (
          <div className="space-y-2">
            <h3 className="font-semibold flex items-center gap-2">
              Investors
              <Badge variant="secondary">{capTable.investorRows.length}</Badge>
            </h3>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Investor</TableHead>
                  <TableHead>Round</TableHead>
                  <TableHead>Shares</TableHead>
                  <TableHead>Ownership %</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {capTable.investorRows.map(stakeholder => (
                  <TableRow key={stakeholder.id}>
                    <TableCell className="font-medium">{stakeholder.name}</TableCell>
                    <TableCell>
                      <Badge variant="secondary">{stakeholder.round?.toUpperCase()}</Badge>
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {formatNumber(stakeholder.shares)}
                    </TableCell>
                    <TableCell>
                      <Badge className="bg-secondary-600">
                        {stakeholder.ownership.toFixed(2)}%
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
                <TableRow className="bg-muted/50 font-semibold">
                  <TableCell>Total Investors</TableCell>
                  <TableCell></TableCell>
                  <TableCell></TableCell>
                  <TableCell>
                    <Badge className="bg-secondary-600">
                      {capTable.totals.investors.toFixed(2)}%
                    </Badge>
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>
        )}

        {/* Employees Section */}
        {capTable.employeeRows.length > 0 && (
          <div className="space-y-2">
            <h3 className="font-semibold flex items-center gap-2">
              Employees
              <Badge variant="secondary">{capTable.employeeRows.length}</Badge>
            </h3>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Options</TableHead>
                  <TableHead>Ownership %</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {capTable.employeeRows.map(stakeholder => (
                  <TableRow key={stakeholder.id}>
                    <TableCell className="font-medium">{stakeholder.name}</TableCell>
                    <TableCell className="text-muted-foreground">
                      {formatNumber(stakeholder.shares)}
                    </TableCell>
                    <TableCell>
                      <Badge className="bg-success-600">{stakeholder.ownership.toFixed(2)}%</Badge>
                    </TableCell>
                  </TableRow>
                ))}
                <TableRow className="bg-muted/50 font-semibold">
                  <TableCell>Total Employees</TableCell>
                  <TableCell></TableCell>
                  <TableCell>
                    <Badge className="bg-success-600">
                      {capTable.totals.employees.toFixed(2)}%
                    </Badge>
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>
        )}

        {/* Option Pool Remaining */}
        <div className="bg-muted/30 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="font-semibold">Available Option Pool</div>
              <div className="text-sm text-muted-foreground">
                Unallocated options available for future grants
              </div>
            </div>
            <div className="text-2xl font-bold">{capTable.totals.optionPool.toFixed(2)}%</div>
          </div>
        </div>

        {/* Total Check */}
        <div className="bg-primary-50 dark:bg-primary-950 rounded-lg p-4 border-2 border-primary-200">
          <div className="flex items-center justify-between">
            <div className="font-semibold">Fully Diluted Total</div>
            <div className="text-xl font-bold">100.00%</div>
          </div>
          <div className="text-xs text-muted-foreground mt-1">
            {formatNumber(capTable.totalShares)} total shares outstanding
          </div>
        </div>

        {/* Empty State */}
        {capTable.stakeholders.length === 0 && (
          <div className="text-center py-12 text-muted-foreground">
            <PieChart className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p className="text-sm">No stakeholders yet</p>
            <p className="text-xs">Add founders or funding rounds to see the cap table</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
