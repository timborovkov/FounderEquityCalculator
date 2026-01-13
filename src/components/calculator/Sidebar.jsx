import {
  Building2,
  Users,
  TrendingUp,
  PieChart,
  Briefcase,
  DollarSign,
  BarChart3,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react'
import { Button } from '../ui/button'
import { cn } from '@/lib/utils'
import { Badge } from '../ui/badge'
import { Separator } from '../ui/separator'
import { useState } from 'react'

const sections = [
  { id: 'company', label: 'Company Setup', icon: Building2 },
  { id: 'founders', label: 'Founders', icon: Users },
  { id: 'rounds', label: 'Funding Rounds', icon: TrendingUp },
  { id: 'cap-table', label: 'Cap Table', icon: PieChart },
  { id: 'options', label: 'Option Pool', icon: Briefcase },
  { id: 'charts', label: 'Charts', icon: BarChart3 },
  { id: 'scenarios', label: 'Exit Scenarios', icon: DollarSign },
]

export default function Sidebar({ activeSection, onSectionChange, counts = {} }) {
  const [collapsed, setCollapsed] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <>
      {/* Mobile menu button */}
      <button
        className="md:hidden fixed left-4 top-20 z-50 p-2 bg-background border rounded-lg shadow-lg"
        onClick={() => setMobileOpen(!mobileOpen)}
        aria-label="Toggle sidebar"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4 6h16M4 12h16M4 18h16"
          />
        </svg>
      </button>

      {/* Overlay for mobile */}
      {mobileOpen && (
        <div
          className="md:hidden fixed inset-0 bg-black/50 z-40 top-16"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          'fixed left-0 top-16 h-[calc(100vh-4rem)] bg-muted/30 border-r transition-all duration-300 z-40',
          'md:translate-x-0',
          collapsed ? 'w-16' : 'w-64',
          mobileOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        )}
        role="navigation"
        aria-label="Calculator sections"
      >
        <div className="flex flex-col h-full">
          {/* Toggle Button */}
          <div className="p-4 flex justify-end">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setCollapsed(!collapsed)}
              className="h-8 w-8 p-0"
              aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
              title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            >
              {collapsed ? (
                <ChevronRight className="w-4 h-4" />
              ) : (
                <ChevronLeft className="w-4 h-4" />
              )}
              <span className="sr-only">{collapsed ? 'Expand' : 'Collapse'}</span>
            </Button>
          </div>

          <Separator />

          {/* Navigation Items */}
          <nav className="flex-1 p-2 space-y-1">
            {sections.map(section => {
              const Icon = section.icon
              const count = counts[section.id] || 0
              const isActive = activeSection === section.id

              return (
                <button
                  key={section.id}
                  onClick={() => {
                    onSectionChange(section.id)
                    setMobileOpen(false) // Close mobile menu after selection
                  }}
                  className={cn(
                    'w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors',
                    'hover:bg-accent hover:text-accent-foreground',
                    isActive && 'bg-accent text-accent-foreground font-medium',
                    collapsed && 'justify-center'
                  )}
                  title={collapsed ? section.label : ''}
                  aria-label={`Navigate to ${section.label}`}
                  aria-current={isActive ? 'page' : undefined}
                >
                  <Icon className="w-5 h-5 flex-shrink-0" />
                  {!collapsed && (
                    <>
                      <span className="flex-1 text-left text-sm">{section.label}</span>
                      {count > 0 && (
                        <Badge variant="secondary" className="ml-auto">
                          {count}
                        </Badge>
                      )}
                    </>
                  )}
                </button>
              )
            })}
          </nav>

          {/* Footer */}
          {!collapsed && (
            <>
              <Separator />
              <div className="p-4">
                <div className="text-xs text-muted-foreground space-y-1">
                  <div className="flex justify-between">
                    <span>Auto-save:</span>
                    <span className="text-success-600">Active</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Last saved:</span>
                    <span>Just now</span>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </aside>
    </>
  )
}
