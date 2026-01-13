import { useState } from 'react'
import { Download, FileText, Table } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { exportCapTableToCSV, exportToPDF } from '@/lib/utils/export'
import { exportToJSON } from '@/lib/utils/storage'
import useCalculatorStore from '@/store/useCalculatorStore'

export default function ExportDialog({ isOpen, onClose }) {
  const [exporting, setExporting] = useState(false)
  const store = useCalculatorStore()

  const handleExportPDF = async () => {
    setExporting(true)
    try {
      await exportToPDF(store.company, store.founders, store.rounds, store.employees)
      alert('PDF exported successfully!')
    } catch (error) {
      alert('Error exporting PDF: ' + error.message)
    } finally {
      setExporting(false)
    }
  }

  const handleExportCSV = async () => {
    setExporting(true)
    try {
      await exportCapTableToCSV(
        store.founders,
        store.rounds,
        store.employees,
        store.optionPool,
        store.company.currentDate
      )
      alert('CSV exported successfully!')
    } catch (error) {
      alert('Error exporting CSV: ' + error.message)
    } finally {
      setExporting(false)
    }
  }

  const handleExportJSON = () => {
    setExporting(true)
    try {
      const data = {
        company: store.company,
        founders: store.founders,
        rounds: store.rounds,
        employees: store.employees,
        optionPool: store.optionPool,
        scenarios: store.scenarios,
      }
      exportToJSON(data)
      alert('JSON exported successfully!')
    } catch (error) {
      alert('Error exporting JSON: ' + error.message)
    } finally {
      setExporting(false)
    }
  }

  const exportOptions = [
    {
      id: 'pdf',
      title: 'Full Report (PDF)',
      description: 'Complete report with company overview, cap table, charts, and scenarios',
      icon: FileText,
      action: handleExportPDF,
      available: true,
    },
    {
      id: 'csv',
      title: 'Cap Table (CSV)',
      description: 'Spreadsheet-compatible file with current ownership breakdown',
      icon: Table,
      action: handleExportCSV,
      available: true,
    },
    {
      id: 'json',
      title: 'Raw Data (JSON)',
      description: 'Complete data export for backup or migration',
      icon: FileText,
      action: handleExportJSON,
      available: true,
    },
  ]

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Download className="w-5 h-5" />
            Export Data
          </DialogTitle>
          <DialogDescription>Export your equity data in various formats</DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-1 gap-4 py-4">
          {exportOptions.map(option => {
            const Icon = option.icon
            return (
              <Card
                key={option.id}
                className={`cursor-pointer transition-all hover:border-primary-200 ${
                  !option.available ? 'opacity-50' : ''
                }`}
              >
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-primary-50 dark:bg-primary-950 rounded-lg">
                        <Icon className="w-5 h-5 text-primary-600" />
                      </div>
                      <div>
                        <CardTitle className="text-base">{option.title}</CardTitle>
                        <CardDescription className="text-sm mt-1">
                          {option.description}
                        </CardDescription>
                      </div>
                    </div>
                    <Button
                      size="sm"
                      onClick={option.action}
                      disabled={!option.available || exporting}
                    >
                      {exporting ? 'Exporting...' : 'Export'}
                    </Button>
                  </div>
                </CardHeader>
              </Card>
            )
          })}
        </div>

        <div className="bg-muted p-4 rounded-lg text-sm text-muted-foreground">
          <strong>Note:</strong> PDF exports include a comprehensive report with all sections. For
          detailed customization, consider using the CSV export to import into spreadsheet software.
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
