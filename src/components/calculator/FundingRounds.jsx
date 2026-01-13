import { useState } from 'react'
import { TrendingUp, Plus, Trash2, Edit2, AlertTriangle } from 'lucide-react'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Separator } from '@/components/ui/separator'
import { Switch } from '@/components/ui/switch'
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import useCalculatorStore from '@/store/useCalculatorStore'
import { ROUND_TYPES } from '@/data/constants'
import { calculateRoundDilution } from '@/lib/calculations/dilution'

export default function FundingRounds() {
  const { rounds, addRound, updateRound, removeRound } = useCalculatorStore()
  const [editingRound, setEditingRound] = useState(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  // Form state
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    type: 'seed',
    preMoneyValuation: 0,
    investment: 0,
    leadInvestors: '',
    liquidationPreference: 1,
    participating: false,
    proRataRights: true
  })

  const formatCurrency = (amount) => {
    if (amount >= 1e9) return `$${(amount / 1e9).toFixed(2)}B`
    if (amount >= 1e6) return `$${(amount / 1e6).toFixed(2)}M`
    if (amount >= 1e3) return `$${(amount / 1e3).toFixed(0)}K`
    return `$${amount.toFixed(0)}`
  }

  const handleOpenDialog = (round = null) => {
    if (round) {
      setFormData({
        date: new Date(round.date).toISOString().split('T')[0],
        type: round.type,
        preMoneyValuation: round.preMoneyValuation,
        investment: round.investment,
        leadInvestors: round.leadInvestors?.join(', ') || '',
        liquidationPreference: round.liquidationPreference,
        participating: round.participating,
        proRataRights: round.proRataRights
      })
      setEditingRound(round.id)
    } else {
      setFormData({
        date: new Date().toISOString().split('T')[0],
        type: 'seed',
        preMoneyValuation: 0,
        investment: 0,
        leadInvestors: '',
        liquidationPreference: 1,
        participating: false,
        proRataRights: true
      })
      setEditingRound(null)
    }
    setIsDialogOpen(true)
  }

  const handleSave = () => {
    const data = {
      ...formData,
      date: new Date(formData.date),
      preMoneyValuation: parseFloat(formData.preMoneyValuation),
      investment: parseFloat(formData.investment),
      postMoneyValuation: parseFloat(formData.preMoneyValuation) + parseFloat(formData.investment),
      leadInvestors: formData.leadInvestors.split(',').map(s => s.trim()).filter(Boolean)
    }

    if (editingRound) {
      updateRound(editingRound, data)
    } else {
      addRound(data)
    }

    setIsDialogOpen(false)
  }

  const handleDelete = (roundId) => {
    if (confirm('Are you sure you want to remove this funding round?')) {
      removeRound(roundId)
    }
  }

  // Calculate dilution for each round
  const roundsWithDilution = rounds.map((round, index) => {
    const previousShares = index === 0 ? 10000000 : 10000000 // Simplified
    const dilution = calculateRoundDilution(
      round.preMoneyValuation,
      round.investment,
      previousShares
    )

    return {
      ...round,
      dilution: dilution.dilutionPercentage,
      hasWarning: dilution.dilutionPercentage > 40
    }
  })

  const totalRaised = rounds.reduce((sum, r) => sum + r.investment, 0)

  const postMoney = formData.preMoneyValuation ?
    parseFloat(formData.preMoneyValuation) + parseFloat(formData.investment || 0) : 0

  const investorOwnership = postMoney > 0 ?
    ((formData.investment || 0) / postMoney * 100).toFixed(1) : 0

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-primary-600" />
              <CardTitle>Funding Rounds</CardTitle>
            </div>
            <CardDescription>
              Model your fundraising journey and track dilution
            </CardDescription>
          </div>

          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={() => handleOpenDialog()}>
                <Plus className="w-4 h-4 mr-2" />
                Add Round
              </Button>
            </DialogTrigger>

            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>
                  {editingRound ? 'Edit Funding Round' : 'Add Funding Round'}
                </DialogTitle>
                <DialogDescription>
                  Configure round details, valuation, and investor terms
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-6 py-4">
                {/* Date & Type */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="round-date">Date *</Label>
                    <Input
                      id="round-date"
                      type="date"
                      value={formData.date}
                      onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="round-type">Round Type *</Label>
                    <Select
                      value={formData.type}
                      onValueChange={(value) => setFormData({ ...formData, type: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {ROUND_TYPES.map(type => (
                          <SelectItem key={type.value} value={type.value}>
                            {type.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <Separator />

                {/* Valuation */}
                <div className="space-y-4">
                  <h4 className="font-semibold">Valuation</h4>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="pre-money">Pre-Money Valuation *</Label>
                      <Input
                        id="pre-money"
                        type="number"
                        min="0"
                        step="1000000"
                        value={formData.preMoneyValuation}
                        onChange={(e) => setFormData({ ...formData, preMoneyValuation: e.target.value })}
                      />
                      <p className="text-xs text-muted-foreground">
                        Company value before investment
                      </p>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="investment">Investment Amount *</Label>
                      <Input
                        id="investment"
                        type="number"
                        min="0"
                        step="100000"
                        value={formData.investment}
                        onChange={(e) => setFormData({ ...formData, investment: e.target.value })}
                      />
                      <p className="text-xs text-muted-foreground">
                        Amount being invested
                      </p>
                    </div>
                  </div>

                  {/* Calculated Values */}
                  {postMoney > 0 && (
                    <div className="bg-muted/50 rounded-lg p-4 space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Post-Money Valuation:</span>
                        <span className="font-semibold">{formatCurrency(postMoney)}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Investor Ownership:</span>
                        <span className="font-semibold">{investorOwnership}%</span>
                      </div>
                    </div>
                  )}
                </div>

                <Separator />

                {/* Investors */}
                <div className="space-y-2">
                  <Label htmlFor="investors">Lead Investors</Label>
                  <Input
                    id="investors"
                    placeholder="e.g., Acme Ventures, ABC Capital"
                    value={formData.leadInvestors}
                    onChange={(e) => setFormData({ ...formData, leadInvestors: e.target.value })}
                  />
                  <p className="text-xs text-muted-foreground">
                    Separate multiple investors with commas
                  </p>
                </div>

                <Separator />

                {/* Terms */}
                <div className="space-y-4">
                  <h4 className="font-semibold">Investor Terms</h4>

                  <div className="space-y-2">
                    <Label htmlFor="liq-pref">Liquidation Preference</Label>
                    <Select
                      value={formData.liquidationPreference.toString()}
                      onValueChange={(value) => setFormData({ ...formData, liquidationPreference: parseInt(value) })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">1x (Standard)</SelectItem>
                        <SelectItem value="2">2x</SelectItem>
                        <SelectItem value="3">3x</SelectItem>
                      </SelectContent>
                    </Select>
                    <p className="text-xs text-muted-foreground">
                      Multiple of investment returned before others in exit
                    </p>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="participating">Participating Preferred</Label>
                      <p className="text-xs text-muted-foreground">
                        Investors get preference + pro-rata share
                      </p>
                    </div>
                    <Switch
                      id="participating"
                      checked={formData.participating}
                      onCheckedChange={(checked) => setFormData({ ...formData, participating: checked })}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="pro-rata">Pro-Rata Rights</Label>
                      <p className="text-xs text-muted-foreground">
                        Right to maintain ownership % in future rounds
                      </p>
                    </div>
                    <Switch
                      id="pro-rata"
                      checked={formData.proRataRights}
                      onCheckedChange={(checked) => setFormData({ ...formData, proRataRights: checked })}
                    />
                  </div>
                </div>
              </div>

              <DialogFooter>
                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
                <Button
                  onClick={handleSave}
                  disabled={!formData.preMoneyValuation || !formData.investment}
                >
                  {editingRound ? 'Save Changes' : 'Add Round'}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Summary */}
        <div className="flex items-center gap-4">
          <div>
            <div className="text-sm text-muted-foreground">Total Raised</div>
            <div className="text-2xl font-bold">{formatCurrency(totalRaised)}</div>
          </div>
          <Separator orientation="vertical" className="h-12" />
          <div>
            <div className="text-sm text-muted-foreground">Rounds</div>
            <div className="text-2xl font-bold">{rounds.length}</div>
          </div>
          {rounds.length > 0 && (
            <>
              <Separator orientation="vertical" className="h-12" />
              <div>
                <div className="text-sm text-muted-foreground">Latest Valuation</div>
                <div className="text-2xl font-bold">
                  {formatCurrency(rounds[rounds.length - 1].postMoneyValuation)}
                </div>
              </div>
            </>
          )}
        </div>

        {/* Rounds Table */}
        {roundsWithDilution.length > 0 ? (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Round</TableHead>
                <TableHead>Investment</TableHead>
                <TableHead>Valuation</TableHead>
                <TableHead>Dilution</TableHead>
                <TableHead>Investors</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {roundsWithDilution.map(round => (
                <TableRow key={round.id}>
                  <TableCell className="text-sm">
                    {new Date(round.date).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <Badge style={{
                      backgroundColor: ROUND_TYPES.find(t => t.value === round.type)?.color
                    }}>
                      {ROUND_TYPES.find(t => t.value === round.type)?.label}
                    </Badge>
                  </TableCell>
                  <TableCell className="font-medium">
                    {formatCurrency(round.investment)}
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {formatCurrency(round.postMoneyValuation)}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Badge variant={round.hasWarning ? 'destructive' : 'secondary'}>
                        {round.dilution.toFixed(1)}%
                      </Badge>
                      {round.hasWarning && (
                        <AlertTriangle className="w-4 h-4 text-warning-500" />
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground max-w-[200px] truncate">
                    {round.leadInvestors?.join(', ') || '-'}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleOpenDialog(round)}
                      >
                        <Edit2 className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(round.id)}
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
            <TrendingUp className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p className="text-sm">No funding rounds added yet</p>
            <p className="text-xs">Click "Add Round" to model your fundraising</p>
          </div>
        )}

        {/* Warning for high dilution */}
        {roundsWithDilution.some(r => r.hasWarning) && (
          <Alert>
            <AlertTriangle className="w-4 h-4" />
            <AlertDescription>
              One or more rounds have dilution exceeding 40%. Consider adjusting valuations.
            </AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  )
}
