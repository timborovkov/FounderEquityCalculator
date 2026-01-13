import { BarChart3 } from 'lucide-react'
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import OwnershipPieChart from '@/components/charts/OwnershipPieChart'
import DilutionChart from '@/components/charts/DilutionChart'
import ValuationChart from '@/components/charts/ValuationChart'
import VestingGantt from '@/components/charts/VestingGantt'

export default function ChartsSection() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-primary-600" />
            <CardTitle>Charts & Visualizations</CardTitle>
          </div>
          <CardDescription>
            Visual insights into ownership, dilution, valuation, and vesting
          </CardDescription>
        </CardHeader>
      </Card>

      {/* Charts Tabs */}
      <Tabs defaultValue="ownership" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="ownership">Ownership</TabsTrigger>
          <TabsTrigger value="dilution">Dilution</TabsTrigger>
          <TabsTrigger value="valuation">Valuation</TabsTrigger>
          <TabsTrigger value="vesting">Vesting</TabsTrigger>
        </TabsList>

        <TabsContent value="ownership" className="space-y-4">
          <OwnershipPieChart />
        </TabsContent>

        <TabsContent value="dilution" className="space-y-4">
          <DilutionChart />
        </TabsContent>

        <TabsContent value="valuation" className="space-y-4">
          <ValuationChart />
        </TabsContent>

        <TabsContent value="vesting" className="space-y-4">
          <VestingGantt />
        </TabsContent>
      </Tabs>

      {/* All Charts at Once (for export/print) */}
      <div className="hidden print:block space-y-6">
        <OwnershipPieChart />
        <DilutionChart />
        <ValuationChart />
        <VestingGantt />
      </div>
    </div>
  )
}
