import { useState } from 'react'
import { Users, Plus, Trash2, Edit2, UserX } from 'lucide-react'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Slider } from '@/components/ui/slider'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Separator } from '@/components/ui/separator'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import useCalculatorStore from '@/store/useCalculatorStore'
import { DEFAULT_VESTING } from '@/data/constants'

export default function FoundersSection() {
  const { founders, addFounder, updateFounder, removeFounder, markFounderDeparted } = useCalculatorStore()
  const [editingFounder, setEditingFounder] = useState(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    equity: 0,
    vestingStart: new Date().toISOString().split('T')[0],
    cliffMonths: DEFAULT_VESTING.cliffMonths,
    vestingMonths: DEFAULT_VESTING.vestingMonths,
    contributionWeights: {
      idea: 33,
      execution: 34,
      capital: 33
    },
    contributions: {
      workHours: 0,
      hourlyRate: 0,
      cashInvested: 0
    }
  })

  const totalEquity = founders.reduce((sum, f) => sum + (f.equity || 0), 0)
  const isOverAllocated = totalEquity > 100

  // Calculate contribution-based recommendations
  const calculateRecommendedSplit = () => {
    const foundersWithContributions = founders.map(founder => {
      const contributions = founder.contributions || { workHours: 0, hourlyRate: 0, cashInvested: 0 }
      const workValue = contributions.workHours * contributions.hourlyRate
      const totalValue = workValue + contributions.cashInvested
      return {
        ...founder,
        workValue,
        totalValue
      }
    })

    const totalContributionValue = foundersWithContributions.reduce((sum, f) => sum + f.totalValue, 0)

    if (totalContributionValue === 0) {
      return []
    }

    return foundersWithContributions.map(founder => ({
      ...founder,
      recommendedEquity: (founder.totalValue / totalContributionValue) * 100
    }))
  }

  const recommendations = calculateRecommendedSplit()
  const hasContributions = recommendations.some(r => r.totalValue > 0)

  const applyRecommendedSplit = () => {
    if (confirm('Apply the recommended equity split based on contributions? This will overwrite current equity percentages.')) {
      recommendations.forEach(rec => {
        if (rec.recommendedEquity > 0) {
          updateFounder(rec.id, { equity: parseFloat(rec.recommendedEquity.toFixed(2)) })
        }
      })
    }
  }

  const handleOpenDialog = (founder = null) => {
    if (founder) {
      setFormData({
        name: founder.name,
        equity: founder.equity,
        vestingStart: new Date(founder.vestingStart).toISOString().split('T')[0],
        cliffMonths: founder.cliffMonths,
        vestingMonths: founder.vestingMonths,
        contributionWeights: founder.contributionWeights || {
          idea: 33,
          execution: 34,
          capital: 33
        },
        contributions: founder.contributions || {
          workHours: 0,
          hourlyRate: 0,
          cashInvested: 0
        }
      })
      setEditingFounder(founder.id)
    } else {
      setFormData({
        name: '',
        equity: 0,
        vestingStart: new Date().toISOString().split('T')[0],
        cliffMonths: DEFAULT_VESTING.cliffMonths,
        vestingMonths: DEFAULT_VESTING.vestingMonths,
        contributionWeights: {
          idea: 33,
          execution: 34,
          capital: 33
        },
        contributions: {
          workHours: 0,
          hourlyRate: 0,
          cashInvested: 0
        }
      })
      setEditingFounder(null)
    }
    setIsDialogOpen(true)
  }

  const handleSave = () => {
    const data = {
      ...formData,
      vestingStart: new Date(formData.vestingStart),
      equity: parseFloat(formData.equity)
    }

    if (editingFounder) {
      updateFounder(editingFounder, data)
    } else {
      addFounder(data)
    }

    setIsDialogOpen(false)
  }

  const handleDelete = (founderId) => {
    if (confirm('Are you sure you want to remove this founder?')) {
      removeFounder(founderId)
    }
  }

  const handleMarkDeparted = (founderId) => {
    if (confirm('Mark this founder as departed? Their unvested shares will be forfeited.')) {
      const departureDate = prompt('Departure date (YYYY-MM-DD):', new Date().toISOString().split('T')[0])
      if (departureDate) {
        markFounderDeparted(founderId, new Date(departureDate))
      }
    }
  }

  return (
    <Card className="border-2 shadow-sm">
      <CardHeader className="border-b bg-gradient-to-r from-primary-50 to-secondary-50 dark:from-primary-950 dark:to-secondary-950">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary-100 dark:bg-primary-900 rounded-lg">
              <Users className="w-5 h-5 text-primary-600 dark:text-primary-400" />
            </div>
            <div>
              <CardTitle className="text-xl">Founders</CardTitle>
              <CardDescription className="mt-1">
                Equity splits, contributions & vesting schedules
              </CardDescription>
            </div>
          </div>

          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={() => handleOpenDialog()}>
                <Plus className="w-4 h-4 mr-2" />
                Add Founder
              </Button>
            </DialogTrigger>

            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>
                  {editingFounder ? 'Edit Founder' : 'Add Founder'}
                </DialogTitle>
                <DialogDescription>
                  Set equity percentage and vesting schedule
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-6 py-4">
                {/* Name */}
                <div className="space-y-2">
                  <Label htmlFor="founder-name">Name *</Label>
                  <Input
                    id="founder-name"
                    placeholder="e.g., Jane Doe"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                </div>

                {/* Equity Percentage */}
                <div className="space-y-2">
                  <Label htmlFor="equity">Equity Percentage *</Label>
                  <div className="flex items-center gap-4">
                    <Input
                      id="equity"
                      type="number"
                      min="0"
                      max="100"
                      step="0.1"
                      value={formData.equity}
                      onChange={(e) => setFormData({ ...formData, equity: e.target.value })}
                      className="w-32"
                    />
                    <span className="text-2xl font-bold text-primary-600">
                      {formData.equity}%
                    </span>
                  </div>
                </div>

                <Separator />

                {/* Vesting Schedule */}
                <div className="space-y-4">
                  <h4 className="font-semibold">Vesting Schedule</h4>

                  <div className="space-y-2">
                    <Label htmlFor="vesting-start">Vesting Start Date</Label>
                    <Input
                      id="vesting-start"
                      type="date"
                      value={formData.vestingStart}
                      onChange={(e) => setFormData({ ...formData, vestingStart: e.target.value })}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="cliff">Cliff Period (months)</Label>
                      <Input
                        id="cliff"
                        type="number"
                        min="0"
                        max="48"
                        value={formData.cliffMonths}
                        onChange={(e) => setFormData({ ...formData, cliffMonths: parseInt(e.target.value) })}
                      />
                      <p className="text-xs text-muted-foreground">
                        Typically 12 months
                      </p>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="vesting-period">Total Vesting Period (months)</Label>
                      <Input
                        id="vesting-period"
                        type="number"
                        min="0"
                        max="120"
                        value={formData.vestingMonths}
                        onChange={(e) => setFormData({ ...formData, vestingMonths: parseInt(e.target.value) })}
                      />
                      <p className="text-xs text-muted-foreground">
                        Typically 48 months (4 years)
                      </p>
                    </div>
                  </div>
                </div>

                <Separator />

                {/* Contribution Calculator */}
                <div className="space-y-4">
                  <h4 className="font-semibold">Contribution Calculator</h4>
                  <p className="text-sm text-muted-foreground">
                    Track work hours, cash investment, and other contributions to help determine fair equity splits
                  </p>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="work-hours">Work Hours Contributed</Label>
                      <Input
                        id="work-hours"
                        type="number"
                        min="0"
                        step="1"
                        placeholder="e.g., 2000"
                        value={formData.contributions.workHours}
                        onChange={(e) => setFormData({
                          ...formData,
                          contributions: { ...formData.contributions, workHours: parseFloat(e.target.value) || 0 }
                        })}
                      />
                      <p className="text-xs text-muted-foreground">
                        Total hours spent building
                      </p>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="hourly-rate">Hourly Rate ($)</Label>
                      <Input
                        id="hourly-rate"
                        type="number"
                        min="0"
                        step="1"
                        placeholder="e.g., 100"
                        value={formData.contributions.hourlyRate}
                        onChange={(e) => setFormData({
                          ...formData,
                          contributions: { ...formData.contributions, hourlyRate: parseFloat(e.target.value) || 0 }
                        })}
                      />
                      <p className="text-xs text-muted-foreground">
                        Market value per hour
                      </p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="cash-invested">Cash Invested ($)</Label>
                    <Input
                      id="cash-invested"
                      type="number"
                      min="0"
                      step="100"
                      placeholder="e.g., 50000"
                      value={formData.contributions.cashInvested}
                      onChange={(e) => setFormData({
                        ...formData,
                        contributions: { ...formData.contributions, cashInvested: parseFloat(e.target.value) || 0 }
                      })}
                    />
                    <p className="text-xs text-muted-foreground">
                      Personal capital invested in the company
                    </p>
                  </div>

                  {/* Calculated Total Value */}
                  <div className="p-4 bg-primary-50 dark:bg-primary-950 rounded-lg border border-primary-200 dark:border-primary-800">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium text-primary-700 dark:text-primary-300">
                        Total Contribution Value:
                      </span>
                      <span className="text-xl font-bold text-primary-900 dark:text-primary-100">
                        ${((formData.contributions.workHours * formData.contributions.hourlyRate) + formData.contributions.cashInvested).toLocaleString()}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      (Work: ${(formData.contributions.workHours * formData.contributions.hourlyRate).toLocaleString()} + Cash: ${formData.contributions.cashInvested.toLocaleString()})
                    </p>
                  </div>
                </div>
              </div>

              <DialogFooter>
                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleSave} disabled={!formData.name || formData.equity <= 0}>
                  {editingFounder ? 'Save Changes' : 'Add Founder'}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Warning if over-allocated */}
        {isOverAllocated && (
          <Alert variant="destructive">
            <AlertDescription>
              Total equity ({totalEquity.toFixed(1)}%) exceeds 100%. Please adjust founder percentages.
            </AlertDescription>
          </Alert>
        )}

        {/* Total Equity Badge */}
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">Total Allocated:</span>
          <Badge variant={isOverAllocated ? 'destructive' : totalEquity === 100 ? 'default' : 'secondary'}>
            {totalEquity.toFixed(1)}%
          </Badge>
        </div>

        {/* Founders Table */}
        {founders.length > 0 ? (
          <Table aria-label="Founders list">
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Equity</TableHead>
                <TableHead>Contribution</TableHead>
                <TableHead>Vesting</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {founders.map(founder => {
                const contributions = founder.contributions || { workHours: 0, hourlyRate: 0, cashInvested: 0 }
                const totalContribution = (contributions.workHours * contributions.hourlyRate) + contributions.cashInvested

                return (
                  <TableRow key={founder.id}>
                    <TableCell className="font-medium">{founder.name}</TableCell>
                    <TableCell>
                      <Badge variant="secondary">{founder.equity}%</Badge>
                    </TableCell>
                    <TableCell className="text-sm">
                      {totalContribution > 0 ? (
                        <span className="font-medium text-primary-600">
                          ${totalContribution.toLocaleString()}
                        </span>
                      ) : (
                        <span className="text-muted-foreground">-</span>
                      )}
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {founder.vestingMonths}mo / {founder.cliffMonths}mo cliff
                    </TableCell>
                    <TableCell>
                      {founder.departed ? (
                        <Badge variant="destructive">Departed</Badge>
                      ) : (
                        <Badge variant="default">Active</Badge>
                      )}
                    </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleOpenDialog(founder)}
                        aria-label={`Edit ${founder.name}`}
                        title={`Edit ${founder.name}`}
                      >
                        <Edit2 className="w-4 h-4" />
                        <span className="sr-only">Edit</span>
                      </Button>
                      {!founder.departed && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleMarkDeparted(founder.id)}
                          aria-label={`Mark ${founder.name} as departed`}
                          title={`Mark ${founder.name} as departed`}
                        >
                          <UserX className="w-4 h-4" />
                          <span className="sr-only">Mark departed</span>
                        </Button>
                      )}
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(founder.id)}
                        aria-label={`Delete ${founder.name}`}
                        title={`Delete ${founder.name}`}
                      >
                        <Trash2 className="w-4 h-4" />
                        <span className="sr-only">Delete</span>
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
                )
              })}
            </TableBody>
          </Table>
        ) : (
          <div className="text-center py-12 text-muted-foreground">
            <Users className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p className="text-sm">No founders added yet</p>
            <p className="text-xs">Click "Add Founder" to get started</p>
          </div>
        )}

        {/* Contribution-Based Recommendations */}
        {founders.length > 0 && hasContributions && (
          <>
            <Separator className="my-6" />
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-semibold">Recommended Equity Split</h4>
                  <p className="text-xs text-muted-foreground">
                    Based on work hours, hourly rates, and cash invested
                  </p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={applyRecommendedSplit}
                >
                  Apply to Equity
                </Button>
              </div>

              <div className="grid gap-3">
                {recommendations.map(rec => (
                  <div
                    key={rec.id}
                    className="p-4 bg-muted/50 rounded-lg border"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium">{rec.name}</span>
                      <Badge variant="secondary" className="text-base px-3">
                        {rec.recommendedEquity.toFixed(1)}%
                      </Badge>
                    </div>
                    <div className="grid grid-cols-3 gap-2 text-xs text-muted-foreground">
                      <div>
                        <div className="font-medium">Work Value</div>
                        <div>${rec.workValue.toLocaleString()}</div>
                      </div>
                      <div>
                        <div className="font-medium">Cash Invested</div>
                        <div>${rec.contributions?.cashInvested?.toLocaleString() || 0}</div>
                      </div>
                      <div>
                        <div className="font-medium">Total Value</div>
                        <div>${rec.totalValue.toLocaleString()}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <Alert>
                <AlertDescription className="text-xs">
                  <strong>Note:</strong> This is a suggestion tool to help with fair equity distribution.
                  It doesn't automatically affect your cap table. Click "Apply to Equity" to use these percentages.
                </AlertDescription>
              </Alert>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  )
}
