import { useState, useEffect } from 'react'
import Navigation from '@/components/shared/Navigation'
import Sidebar from '@/components/calculator/Sidebar'
import SummaryPanel from '@/components/calculator/SummaryPanel'
import Timeline from '@/components/calculator/Timeline'
import CompanySetup from '@/components/calculator/CompanySetup'
import FoundersSection from '@/components/calculator/FoundersSection'
import FundingRounds from '@/components/calculator/FundingRounds'
import CapTable from '@/components/calculator/CapTable'
import OptionPool from '@/components/calculator/OptionPool'
import ChartsSection from '@/components/calculator/ChartsSection'
import ExitScenarios from '@/components/calculator/ExitScenarios'
import SaveLoadDialog from '@/components/shared/SaveLoadDialog'
import ExportDialog from '@/components/shared/ExportDialog'
import ShareDialog from '@/components/shared/ShareDialog'
import useCalculatorStore from '@/store/useCalculatorStore'
import useKeyboardShortcuts from '@/hooks/useKeyboardShortcuts'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { loadSharedState } from '@/lib/utils/url-share'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { TrendingUp, Users, Briefcase } from 'lucide-react'

export default function CalculatorPage() {
  const [activeSection, setActiveSection] = useState('company')
  const [activeTab, setActiveTab] = useState('timeline')
  const [saveLoadMode, setSaveLoadMode] = useState('save')
  const [isSaveLoadOpen, setIsSaveLoadOpen] = useState(false)
  const [isExportOpen, setIsExportOpen] = useState(false)
  const [isShareOpen, setIsShareOpen] = useState(false)
  const [isAddEventOpen, setIsAddEventOpen] = useState(false)

  const { undo, redo, founders, rounds, employees, loadTemplate } = useCalculatorStore()

  // Handle section change from sidebar
  const handleSectionChange = sectionId => {
    setActiveSection(sectionId)
    // Switch to table view when clicking sidebar items
    setActiveTab('table')
  }

  // Load shared state from URL on mount
  useEffect(() => {
    const sharedState = loadSharedState()
    if (sharedState) {
      loadTemplate(sharedState)
      // Remove the share parameter from URL after loading
      const url = new URL(window.location.href)
      url.searchParams.delete('share')
      window.history.replaceState({}, '', url)
    }
  }, [loadTemplate])

  // Keyboard shortcuts
  useKeyboardShortcuts({
    onSave: () => handleSave(),
    onUndo: () => undo(),
    onRedo: () => redo(),
    onExport: type => handleExport(type),
  })

  const handleSave = () => {
    setSaveLoadMode('save')
    setIsSaveLoadOpen(true)
  }

  const handleLoad = () => {
    setSaveLoadMode('load')
    setIsSaveLoadOpen(true)
  }

  const handleExport = () => {
    setIsExportOpen(true)
  }

  const handleShare = () => {
    setIsShareOpen(true)
  }

  const handleAddEvent = eventType => {
    setIsAddEventOpen(false)
    setActiveTab('table')
    setActiveSection(eventType)
  }

  // Calculate counts for sidebar badges
  const counts = {
    founders: founders.length,
    rounds: rounds.length,
    options: employees.length,
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      {/* Top Navigation */}
      <Navigation
        onSave={handleSave}
        onLoad={handleLoad}
        onExport={handleExport}
        onShare={handleShare}
      />

      {/* Left Sidebar */}
      <Sidebar
        activeSection={activeSection}
        onSectionChange={handleSectionChange}
        counts={counts}
      />

      {/* Right Summary Panel */}
      <SummaryPanel />

      {/* Main Content Area - responsive margins */}
      <main
        id="main-content"
        className="md:ml-64 md:mr-80 pt-24 pb-16 px-4 md:px-8 min-h-screen"
        role="main"
        aria-label="Calculator content"
      >
        <div className="max-w-6xl mx-auto">
          {/* Tabs for Timeline vs Details View */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <div className="mb-8 flex items-center justify-center">
              <TabsList
                className="inline-flex p-1 bg-muted/50 backdrop-blur-sm border-2 shadow-sm"
                role="tablist"
                aria-label="View selector"
              >
                <TabsTrigger
                  value="timeline"
                  aria-label="Switch to timeline view"
                  className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-primary-500 data-[state=active]:to-secondary-500 data-[state=active]:text-white"
                >
                  Timeline View
                </TabsTrigger>
                <TabsTrigger
                  value="table"
                  aria-label="Switch to details view"
                  className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-primary-500 data-[state=active]:to-secondary-500 data-[state=active]:text-white"
                >
                  Details View
                </TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="timeline" className="space-y-8">
              {/* Interactive Timeline */}
              <Timeline
                onEventClick={event => {
                  // Navigate to the appropriate section based on event type
                  if (event.type === 'funding-round') {
                    setActiveTab('table')
                    setActiveSection('rounds')
                  } else if (event.type === 'vesting-milestone') {
                    setActiveTab('table')
                    setActiveSection('founders')
                  }
                }}
                onAddEvent={() => {
                  setIsAddEventOpen(true)
                }}
              />
            </TabsContent>

            <TabsContent value="table" className="space-y-8 mt-4">
              {/* Section Content Based on Active Section */}
              {activeSection === 'company' && (
                <div className="animate-in fade-in duration-300">
                  <CompanySetup />
                </div>
              )}

              {activeSection === 'founders' && (
                <div className="animate-in fade-in duration-300">
                  <FoundersSection />
                </div>
              )}

              {activeSection === 'rounds' && (
                <div className="animate-in fade-in duration-300">
                  <FundingRounds />
                </div>
              )}

              {activeSection === 'cap-table' && (
                <div className="animate-in fade-in duration-300">
                  <CapTable />
                </div>
              )}

              {activeSection === 'options' && (
                <div className="animate-in fade-in duration-300">
                  <OptionPool />
                </div>
              )}

              {activeSection === 'charts' && (
                <div className="animate-in fade-in duration-300">
                  <ChartsSection />
                </div>
              )}

              {activeSection === 'scenarios' && (
                <div className="animate-in fade-in duration-300">
                  <ExitScenarios />
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </main>

      {/* Dialogs */}
      <SaveLoadDialog
        isOpen={isSaveLoadOpen}
        onClose={() => setIsSaveLoadOpen(false)}
        mode={saveLoadMode}
      />
      <ExportDialog isOpen={isExportOpen} onClose={() => setIsExportOpen(false)} />
      <ShareDialog isOpen={isShareOpen} onClose={() => setIsShareOpen(false)} />

      {/* Add Event Dialog */}
      <Dialog open={isAddEventOpen} onOpenChange={setIsAddEventOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Add Event to Timeline</DialogTitle>
            <DialogDescription>
              Choose what type of event you&apos;d like to add to your timeline
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-3 py-4">
            <Button
              variant="outline"
              className="justify-start h-auto py-4"
              onClick={() => handleAddEvent('rounds')}
            >
              <TrendingUp className="mr-3 h-5 w-5 text-primary-600" />
              <div className="text-left">
                <div className="font-semibold">Funding Round</div>
                <div className="text-sm text-muted-foreground">Add a new investment round</div>
              </div>
            </Button>
            <Button
              variant="outline"
              className="justify-start h-auto py-4"
              onClick={() => handleAddEvent('founders')}
            >
              <Users className="mr-3 h-5 w-5 text-secondary-600" />
              <div className="text-left">
                <div className="font-semibold">Founder</div>
                <div className="text-sm text-muted-foreground">
                  Add a founder with vesting schedule
                </div>
              </div>
            </Button>
            <Button
              variant="outline"
              className="justify-start h-auto py-4"
              onClick={() => handleAddEvent('options')}
            >
              <Briefcase className="mr-3 h-5 w-5 text-blue-600" />
              <div className="text-left">
                <div className="font-semibold">Employee Grant</div>
                <div className="text-sm text-muted-foreground">Add employee stock options</div>
              </div>
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
