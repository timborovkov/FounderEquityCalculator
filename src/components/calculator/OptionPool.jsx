import { useState, useMemo } from 'react'
import { Briefcase, Plus, Trash2, Edit2, AlertCircle } from 'lucide-react'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Separator } from '@/components/ui/separator'
import { Progress } from '@/components/ui/progress'
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
import { calculateVestedShares } from '@/lib/calculations/vesting'

export default function OptionPool() {
  const { company, optionPool, setOptionPool, employees, addEmployee, updateEmployee, removeEmployee } = useCalculatorStore()
  const [editingEmployee, setEditingEmployee] = useState(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    role: '',
    optionsGranted: 0,
    grantDate: new Date().toISOString().split('T')[0],
    strikePrice: 0,
    cliffMonths: DEFAULT_VESTING.cliffMonths,
    vestingMonths: DEFAULT_VESTING.vestingMonths
  })

  // Calculate pool utilization
  const poolStats = useMemo(() => {
    const allocated = employees.reduce((sum, emp) => sum + emp.optionsGranted, 0)
    const available = optionPool.size - allocated
    const utilizationPercent = optionPool.size > 0 ? (allocated / optionPool.size) * 100 : 0

    return {
      size: optionPool.size,
      allocated,
      available,
      utilizationPercent
    }
  }, [employees, optionPool.size])

  // Calculate vesting for employees
  const employeesWithVesting = useMemo(() => {
    return employees.map(emp => {
      const vesting = calculateVestedShares(
        emp.grantDate,
        company.currentDate || new Date(),
        emp.optionsGranted,
        emp.cliffMonths || 12,
        emp.vestingMonths || 48
      )

      return {
        ...emp,
        vested: vesting.vestedShares,
        unvested: vesting.unvestedShares,
        percentVested: vesting.percentVested
      }
    })
  }, [employees, company.currentDate])

  const handleOpenDialog = (employee = null) => {
    if (employee) {
      setFormData({
        name: employee.name,
        role: employee.role,
        optionsGranted: employee.optionsGranted,
        grantDate: new Date(employee.grantDate).toISOString().split('T')[0],
        strikePrice: employee.strikePrice,
        cliffMonths: employee.cliffMonths,
        vestingMonths: employee.vestingMonths
      })
      setEditingEmployee(employee.id)
    } else {
      setFormData({
        name: '',
        role: '',
        optionsGranted: 0,
        grantDate: new Date().toISOString().split('T')[0],
        strikePrice: 0,
        cliffMonths: DEFAULT_VESTING.cliffMonths,
        vestingMonths: DEFAULT_VESTING.vestingMonths
      })
      setEditingEmployee(null)
    }
    setIsDialogOpen(true)
  }

  const handleSave = () => {
    const data = {
      ...formData,
      grantDate: new Date(formData.grantDate),
      optionsGranted: parseFloat(formData.optionsGranted),
      strikePrice: parseFloat(formData.strikePrice)
    }

    if (editingEmployee) {
      updateEmployee(editingEmployee, data)
    } else {
      addEmployee(data)
    }

    setIsDialogOpen(false)
  }

  const handleDelete = (employeeId) => {
    if (confirm('Are you sure you want to remove this employee grant?')) {
      removeEmployee(employeeId)
    }
  }

  const formatNumber = (num) => {
    return new Intl.NumberFormat('en-US').format(Math.round(num))
  }

  return (
    <div className="space-y-6">
      {/* Option Pool Size */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2">
                <Briefcase className="w-5 h-5 text-primary-600" />
                <CardTitle>Option Pool Size</CardTitle>
              </div>
              <CardDescription>
                Total equity reserved for employee grants
              </CardDescription>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="pool-size">Pool Size (% of fully diluted)</Label>
              <Input
                id="pool-size"
                type="number"
                min="0"
                max="30"
                step="0.1"
                value={optionPool.size}
                onChange={(e) => setOptionPool({ size: parseFloat(e.target.value) })}
              />
              <p className="text-xs text-muted-foreground">
                Typically 10-20% for startups
              </p>
            </div>

            <div className="space-y-2">
              <div className="text-sm text-muted-foreground">Current Pool Size</div>
              <div className="text-3xl font-bold text-primary-600">
                {optionPool.size}%
              </div>
            </div>
          </div>

          {/* Warning for small pool */}
          {optionPool.size < 10 && optionPool.size > 0 && (
            <Alert>
              <AlertCircle className="w-4 h-4" />
              <AlertDescription>
                Pool size is below 10%. Consider increasing to attract senior talent.
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      {/* Pool Utilization */}
      <Card>
        <CardHeader>
          <CardTitle>Pool Utilization</CardTitle>
          <CardDescription>
            How much of the option pool has been allocated
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Allocated</span>
              <span className="font-medium">
                {formatNumber(poolStats.allocated)} ({poolStats.utilizationPercent.toFixed(1)}%)
              </span>
            </div>
            <Progress value={poolStats.utilizationPercent} className="h-2" />
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <div className="text-xs text-muted-foreground mb-1">Total Pool</div>
              <div className="text-lg font-semibold">{formatNumber(poolStats.size)}</div>
            </div>
            <div>
              <div className="text-xs text-muted-foreground mb-1">Allocated</div>
              <div className="text-lg font-semibold text-primary-600">
                {formatNumber(poolStats.allocated)}
              </div>
            </div>
            <div>
              <div className="text-xs text-muted-foreground mb-1">Available</div>
              <div className="text-lg font-semibold text-success-600">
                {formatNumber(poolStats.available)}
              </div>
            </div>
          </div>

          {/* Warning for low availability */}
          {poolStats.utilizationPercent > 80 && (
            <Alert>
              <AlertCircle className="w-4 h-4" />
              <AlertDescription>
                Option pool is {poolStats.utilizationPercent.toFixed(0)}% utilized.
                Consider refreshing the pool in your next funding round.
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      {/* Employee Grants */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Employee Grants</CardTitle>
              <CardDescription>
                Individual option grants with vesting schedules
              </CardDescription>
            </div>

            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button onClick={() => handleOpenDialog()}>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Grant
                </Button>
              </DialogTrigger>

              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>
                    {editingEmployee ? 'Edit Employee Grant' : 'Add Employee Grant'}
                  </DialogTitle>
                  <DialogDescription>
                    Configure option grant and vesting schedule
                  </DialogDescription>
                </DialogHeader>

                <div className="space-y-6 py-4">
                  {/* Name & Role */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="emp-name">Name *</Label>
                      <Input
                        id="emp-name"
                        placeholder="e.g., John Doe"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="emp-role">Role</Label>
                      <Input
                        id="emp-role"
                        placeholder="e.g., Engineering Lead"
                        value={formData.role}
                        onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                      />
                    </div>
                  </div>

                  <Separator />

                  {/* Grant Details */}
                  <div className="grid grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="options">Options Granted *</Label>
                      <Input
                        id="options"
                        type="number"
                        min="0"
                        value={formData.optionsGranted}
                        onChange={(e) => setFormData({ ...formData, optionsGranted: e.target.value })}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="grant-date">Grant Date *</Label>
                      <Input
                        id="grant-date"
                        type="date"
                        value={formData.grantDate}
                        onChange={(e) => setFormData({ ...formData, grantDate: e.target.value })}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="strike">Strike Price</Label>
                      <Input
                        id="strike"
                        type="number"
                        min="0"
                        step="0.01"
                        value={formData.strikePrice}
                        onChange={(e) => setFormData({ ...formData, strikePrice: e.target.value })}
                      />
                    </div>
                  </div>

                  <Separator />

                  {/* Vesting Schedule */}
                  <div className="space-y-4">
                    <h4 className="font-semibold">Vesting Schedule</h4>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="emp-cliff">Cliff Period (months)</Label>
                        <Input
                          id="emp-cliff"
                          type="number"
                          min="0"
                          max="48"
                          value={formData.cliffMonths}
                          onChange={(e) => setFormData({ ...formData, cliffMonths: parseInt(e.target.value) })}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="emp-vesting">Total Vesting (months)</Label>
                        <Input
                          id="emp-vesting"
                          type="number"
                          min="0"
                          max="120"
                          value={formData.vestingMonths}
                          onChange={(e) => setFormData({ ...formData, vestingMonths: parseInt(e.target.value) })}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleSave} disabled={!formData.name || formData.optionsGranted <= 0}>
                    {editingEmployee ? 'Save Changes' : 'Add Grant'}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>

        <CardContent>
          {employeesWithVesting.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Options</TableHead>
                  <TableHead>Vested</TableHead>
                  <TableHead>Progress</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {employeesWithVesting.map(emp => (
                  <TableRow key={emp.id}>
                    <TableCell className="font-medium">{emp.name}</TableCell>
                    <TableCell className="text-sm text-muted-foreground">{emp.role || '-'}</TableCell>
                    <TableCell>{formatNumber(emp.optionsGranted)}</TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="text-sm">{formatNumber(emp.vested)}</div>
                        <div className="text-xs text-muted-foreground">
                          {emp.percentVested.toFixed(0)}% vested
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="w-24">
                        <Progress value={emp.percentVested} className="h-2" />
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleOpenDialog(emp)}
                        >
                          <Edit2 className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(emp.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="text-center py-12 text-muted-foreground">
              <Briefcase className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p className="text-sm">No employee grants yet</p>
              <p className="text-xs">Click "Add Grant" to allocate options</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
