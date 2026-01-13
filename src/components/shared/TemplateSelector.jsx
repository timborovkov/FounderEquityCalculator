import { useState } from 'react'
import { FileText, Check, Rocket } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { getTemplates, loadTemplate } from '@/lib/templates/scenarios'
import useCalculatorStore from '@/store/useCalculatorStore'

export default function TemplateSelector({ trigger, onTemplateLoaded }) {
  const [isOpen, setIsOpen] = useState(false)
  const [selectedTemplate, setSelectedTemplate] = useState(null)
  const { loadTemplate: loadTemplateToStore } = useCalculatorStore()

  const templates = getTemplates()

  const handleLoadTemplate = () => {
    if (!selectedTemplate) return

    const templateData = loadTemplate(selectedTemplate)
    loadTemplateToStore(templateData)

    setIsOpen(false)
    setSelectedTemplate(null)

    // Notify parent if callback provided
    if (onTemplateLoaded) {
      onTemplateLoaded(selectedTemplate)
    }
  }

  const getTemplateStats = (key) => {
    const data = loadTemplate(key)
    return {
      founders: data.founders.length,
      rounds: data.rounds.length,
      employees: data.employees.length,
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant="outline">
            <FileText className="w-4 h-4 mr-2" />
            Load Template
          </Button>
        )}
      </DialogTrigger>

      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Rocket className="w-5 h-5" />
            Start from a Template
          </DialogTitle>
          <DialogDescription>
            Choose a pre-configured scenario to get started quickly. You can customize everything after loading.
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-4">
          {templates.map((template) => {
            const stats = getTemplateStats(template.key)
            const isSelected = selectedTemplate === template.key

            return (
              <Card
                key={template.key}
                className={`cursor-pointer transition-all ${
                  isSelected
                    ? 'border-primary-500 bg-primary-50 dark:bg-primary-950'
                    : 'hover:border-primary-200'
                }`}
                onClick={() => setSelectedTemplate(template.key)}
              >
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-lg">{template.name}</CardTitle>
                      <CardDescription className="mt-1">
                        {template.description}
                      </CardDescription>
                    </div>
                    {isSelected && (
                      <Check className="w-5 h-5 text-primary-600 flex-shrink-0 ml-2" />
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex gap-2 flex-wrap">
                    <Badge variant="secondary">
                      {stats.founders} {stats.founders === 1 ? 'Founder' : 'Founders'}
                    </Badge>
                    <Badge variant="secondary">
                      {stats.rounds} {stats.rounds === 1 ? 'Round' : 'Rounds'}
                    </Badge>
                    <Badge variant="secondary">
                      {stats.employees} {stats.employees === 1 ? 'Employee' : 'Employees'}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => setIsOpen(false)}>
            Cancel
          </Button>
          <Button onClick={handleLoadTemplate} disabled={!selectedTemplate}>
            Load Template
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
