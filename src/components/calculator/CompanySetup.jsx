import { Building2, Calendar } from 'lucide-react'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import useCalculatorStore from '@/store/useCalculatorStore'

export default function CompanySetup() {
  const { company, setCompanyInfo } = useCalculatorStore()

  const handleChange = (field, value) => {
    setCompanyInfo({ [field]: value })
  }

  return (
    <Card className="border-2 shadow-sm">
      <CardHeader className="border-b bg-gradient-to-r from-primary-50 to-secondary-50 dark:from-primary-950 dark:to-secondary-950">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-primary-100 dark:bg-primary-900 rounded-lg">
            <Building2 className="w-5 h-5 text-primary-600 dark:text-primary-400" />
          </div>
          <div>
            <CardTitle className="text-xl">Company Information</CardTitle>
            <CardDescription className="mt-1">Basic details about your startup</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6 pt-6">
        {/* Company Name */}
        <div className="space-y-2">
          <Label htmlFor="company-name">Company Name</Label>
          <Input
            id="company-name"
            placeholder="e.g., Acme Inc."
            value={company.name || ''}
            onChange={e => handleChange('name', e.target.value)}
            aria-describedby="company-name-help"
          />
          <p id="company-name-help" className="text-xs text-muted-foreground">
            The legal or operating name of your startup
          </p>
        </div>

        {/* Founded Date */}
        <div className="space-y-2">
          <Label htmlFor="founded-date" className="flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            Founded Date
          </Label>
          <Input
            id="founded-date"
            type="date"
            value={
              company.foundedDate ? new Date(company.foundedDate).toISOString().split('T')[0] : ''
            }
            onChange={e => handleChange('foundedDate', new Date(e.target.value))}
            aria-describedby="founded-date-help"
          />
          <p id="founded-date-help" className="text-xs text-muted-foreground">
            When the company was officially founded
          </p>
        </div>

        {/* Current Date (for calculations) */}
        <div className="space-y-2">
          <Label htmlFor="current-date">Current Date (for calculations)</Label>
          <Input
            id="current-date"
            type="date"
            value={
              company.currentDate ? new Date(company.currentDate).toISOString().split('T')[0] : ''
            }
            onChange={e => handleChange('currentDate', new Date(e.target.value))}
            aria-describedby="current-date-help"
          />
          <p id="current-date-help" className="text-xs text-muted-foreground">
            The date to calculate vesting progress and ownership. Usually today&apos;s date.
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
