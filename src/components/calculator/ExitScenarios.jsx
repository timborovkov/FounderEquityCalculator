import { useState, useMemo } from 'react'
import { DollarSign, Plus, Trash2, TrendingUp, Calculator } from 'lucide-react'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import WaterfallChart from '@/components/charts/WaterfallChart'
import useCalculatorStore from '@/store/useCalculatorStore'
import { calculateLiquidationWaterfall, calculateIRR, calculateMOIC } from '@/lib/calculations/waterfall'
import { calculateCurrentOwnership } from '@/lib/calculations/dilution'

export default function ExitScenarios() {
  const { company, founders, rounds, employees, scenarios, addScenario, updateScenario, removeScenario } = useCalculatorStore()
  const [editingScenario, setEditingScenario] = useState(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [selectedScenario, setSelectedScenario] = useState(null)

  const [formData, setFormData] = useState({
    name: '',
    exitValuation: 0
  })

  // Get current ownership for waterfall calculations
  const { stakeholders } = useMemo(() => {
    return calculateCurrentOwnership(founders, rounds, employees)
  }, [founders, rounds, employees])

  // Calculate waterfall for selected scenario
  const waterfallData = useMemo(() => {
    if (!selectedScenario) return null

    return calculateLiquidationWaterfall(
      selectedScenario.exitValuation,
      stakeholders,
      rounds
    )
  }, [selectedScenario, stakeholders, rounds])

  const formatCurrency = (amount) => {
    if (amount >= 1e9) return `$${(amount / 1e9).toFixed(2)}B`
    if (amount >= 1e6) return `$${(amount / 1e6).toFixed(2)}M`
    if (amount >= 1e3) return `$${(amount / 1e3).toFixed(0)}K`
    return `$${amount.toFixed(0)}`
  }

  const handleOpenDialog = (scenario = null) => {
    if (scenario) {
      setFormData({
        name: scenario.name,
        exitValuation: scenario.exitValuation
      })
      setEditingScenario(scenario.id)
    } else {
      setFormData({
        name: '',
        exitValuation: 0
      })
      setEditingScenario(null)
    }
    setIsDialogOpen(true)
  }

  const handleSave = () => {
    const data = {
      ...formData,
      exitValuation: parseFloat(formData.exitValuation)
    }

    if (editingScenario) {
      updateScenario(editingScenario, data)
    } else {
      const newScenario = addScenario(data)
      // Select the newly created scenario
      setTimeout(() => {
        const created = scenarios.find(s => s.name === data.name)
        if (created) setSelectedScenario(created)
      }, 100)
    }

    setIsDialogOpen(false)
  }

  const handleDelete = (scenarioId) => {
    if (confirm('Are you sure you want to remove this scenario?')) {
      if (selectedScenario?.id === scenarioId) {
        setSelectedScenario(null)
      }
      removeScenario(scenarioId)
    }
  }

  // Quick scenario templates
  const createQuickScenario = (multiplier) => {
    const latestValuation = rounds.length > 0
      ? rounds[rounds.length - 1].postMoneyValuation
      : 10000000

    const exitVal = latestValuation * multiplier
    const name = multiplier === 2 ? 'Modest Exit'
      : multiplier === 5 ? 'Good Exit'
      : multiplier === 10 ? 'Great Exit'
      : 'Unicorn Exit'

    addScenario({
      name,
      exitValuation: exitVal
    })
  }

  return (
    <div className="space-y-6">
      {/* Header Card */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2">
                <DollarSign className="w-5 h-5 text-primary-600" />
                <CardTitle>Exit Scenarios</CardTitle>
              </div>
              <CardDescription>
                Model different exit valuations and see waterfall distribution
              </CardDescription>
            </div>

            <div className="flex gap-2">
              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                  <Button onClick={() => handleOpenDialog()}>
                    <Plus className="w-4 h-4 mr-2" />
                    New Scenario
                  </Button>
                </DialogTrigger>

                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>
                      {editingScenario ? 'Edit Scenario' : 'Create Exit Scenario'}
                    </DialogTitle>
                    <DialogDescription>
                      Model an exit at a specific valuation
                    </DialogDescription>
                  </DialogHeader>

                  <div className="space-y-4 py-4">
                    <div className="space-y-2">
                      <Label htmlFor="scenario-name">Scenario Name *</Label>
                      <Input
                        id="scenario-name"
                        placeholder="e.g., Conservative Exit"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="exit-val">Exit Valuation *</Label>
                      <Input
                        id="exit-val"
                        type="number"
                        min="0"
                        step="1000000"
                        value={formData.exitValuation}
                        onChange={(e) => setFormData({ ...formData, exitValuation: e.target.value })}
                      />
                      <p className="text-xs text-muted-foreground">
                        Total company value at exit (acquisition or IPO)
                      </p>
                    </div>
                  </div>

                  <DialogFooter>
                    <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                      Cancel
                    </Button>
                    <Button onClick={handleSave} disabled={!formData.name || formData.exitValuation <= 0}>
                      {editingScenario ? 'Save Changes' : 'Create Scenario'}
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </CardHeader>

        <CardContent>
          {/* Quick Scenario Buttons */}
          <div className="space-y-2">
            <Label>Quick Scenarios (Based on Latest Valuation)</Label>
            <div className="flex flex-wrap gap-2">
              <Button variant="outline" size="sm" onClick={() => createQuickScenario(2)}>
                2x Exit
              </Button>
              <Button variant="outline" size="sm" onClick={() => createQuickScenario(5)}>
                5x Exit
              </Button>
              <Button variant="outline" size="sm" onClick={() => createQuickScenario(10)}>
                10x Exit
              </Button>
              <Button variant="outline" size="sm" onClick={() => createQuickScenario(20)}>
                20x Exit
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Scenarios List */}
      <Card>
        <CardHeader>
          <CardTitle>Your Scenarios</CardTitle>
          <CardDescription>
            Select a scenario to view detailed waterfall analysis
          </CardDescription>
        </CardHeader>
        <CardContent>
          {scenarios.length > 0 ? (
            <div className="space-y-2">
              {scenarios.map(scenario => (
                <div
                  key={scenario.id}
                  className={`flex items-center justify-between p-4 border rounded-lg cursor-pointer transition-all ${
                    selectedScenario?.id === scenario.id
                      ? 'border-primary-500 bg-primary-50 dark:bg-primary-950'
                      : 'hover:border-primary-200'
                  }`}
                  onClick={() => setSelectedScenario(scenario)}
                >
                  <div>
                    <div className="font-semibold">{scenario.name}</div>
                    <div className="text-sm text-muted-foreground">
                      Exit at {formatCurrency(scenario.exitValuation)}
                    </div>
                  </div>
                  <div className="flex gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation()
                        handleOpenDialog(scenario)
                      }}
                    >
                      <Calculator className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation()
                        handleDelete(scenario.id)
                      }}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-muted-foreground">
              <DollarSign className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p className="text-sm">No exit scenarios yet</p>
              <p className="text-xs">Create scenarios to model different exit outcomes</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Waterfall Analysis */}
      {selectedScenario && waterfallData && (
        <>
          {/* Waterfall Chart */}
          <WaterfallChart
            waterfallData={waterfallData}
            exitValuation={selectedScenario.exitValuation}
          />

          {/* Detailed Breakdown Table */}
          <Card>
            <CardHeader>
              <CardTitle>Detailed Payout Breakdown</CardTitle>
              <CardDescription>
                How {formatCurrency(selectedScenario.exitValuation)} gets distributed
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Stakeholder</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Payout</TableHead>
                    <TableHead>% of Exit</TableHead>
                    <TableHead>Multiple (MOIC)</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {waterfallData.stakeholderTotals.map((st, index) => {
                    // Find if this is an investor to calculate MOIC
                    const round = rounds.find(r =>
                      r.leadInvestors?.some(inv => st.stakeholder.includes(inv))
                    )
                    const moic = round
                      ? calculateMOIC(st.total, round.investment)
                      : null

                    return (
                      <TableRow key={index}>
                        <TableCell className="font-medium">{st.stakeholder}</TableCell>
                        <TableCell>
                          <Badge variant="secondary">{st.type}</Badge>
                        </TableCell>
                        <TableCell className="font-semibold">
                          {formatCurrency(st.total)}
                        </TableCell>
                        <TableCell>
                          {((st.total / selectedScenario.exitValuation) * 100).toFixed(2)}%
                        </TableCell>
                        <TableCell>
                          {moic ? (
                            <Badge variant={moic >= 3 ? 'default' : 'secondary'}>
                              {moic.toFixed(2)}x
                            </Badge>
                          ) : (
                            '-'
                          )}
                        </TableCell>
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>

              {/* Summary Row */}
              <div className="mt-4 pt-4 border-t">
                <div className="flex justify-between items-center">
                  <span className="font-semibold">Total Distributed</span>
                  <span className="text-2xl font-bold text-primary-600">
                    {formatCurrency(waterfallData.totalDistributed)}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  )
}
