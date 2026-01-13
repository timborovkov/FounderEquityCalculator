import { Link } from 'react-router-dom'
import { Save, FolderOpen, Download, Share2, Moon, Sun, Home, Undo2, Redo2, FileText } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import useCalculatorStore from '@/store/useCalculatorStore'
import TemplateSelector from '@/components/shared/TemplateSelector'
import { useState } from 'react'

export default function Navigation({ onSave, onLoad, onExport, onShare }) {
  const { settings, setTheme, undo, redo, history } = useCalculatorStore()
  const [theme, setLocalTheme] = useState(settings.theme)

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light'
    setLocalTheme(newTheme)
    setTheme(newTheme)
    document.documentElement.classList.toggle('dark')
  }

  const canUndo = history.past.length > 0
  const canRedo = history.future.length > 0

  return (
    <nav
      className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60"
      role="navigation"
      aria-label="Main navigation"
    >
      <div className="px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Left: Logo and Home */}
          <div className="flex items-center gap-4">
            <Link to="/" className="flex items-center gap-2 font-bold text-xl">
              <div className="w-8 h-8 bg-gradient-primary rounded-lg" />
              <span className="hidden sm:inline">Equity Calculator</span>
            </Link>

            <Separator orientation="vertical" className="h-6 hidden md:block" />

            <Link to="/">
              <Button variant="ghost" size="sm">
                <Home className="w-4 h-4 mr-2" />
                Home
              </Button>
            </Link>
          </div>

          {/* Center: Actions */}
          <div className="flex items-center gap-2">
            {/* Undo/Redo */}
            <Button
              variant="ghost"
              size="sm"
              onClick={undo}
              disabled={!canUndo}
              title="Undo (Cmd+Z)"
              aria-label="Undo last action"
            >
              <Undo2 className="w-4 h-4" />
              <span className="sr-only">Undo</span>
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={redo}
              disabled={!canRedo}
              title="Redo (Cmd+Shift+Z)"
              aria-label="Redo last action"
            >
              <Redo2 className="w-4 h-4" />
              <span className="sr-only">Redo</span>
            </Button>

            <Separator orientation="vertical" className="h-6 mx-2" />

            {/* Save */}
            <Button
              variant="ghost"
              size="sm"
              onClick={onSave}
              title="Save (Cmd+S)"
              aria-label="Save current calculator state"
            >
              <Save className="w-4 h-4 mr-2" />
              <span className="hidden md:inline">Save</span>
              <span className="md:hidden sr-only">Save</span>
            </Button>

            {/* Load */}
            <Button
              variant="ghost"
              size="sm"
              onClick={onLoad}
              aria-label="Load saved calculator state"
            >
              <FolderOpen className="w-4 h-4 mr-2" />
              <span className="hidden md:inline">Load</span>
              <span className="md:hidden sr-only">Load</span>
            </Button>

            {/* Template */}
            <TemplateSelector
              trigger={
                <Button variant="ghost" size="sm">
                  <FileText className="w-4 h-4 mr-2" />
                  <span className="hidden md:inline">Template</span>
                </Button>
              }
            />

            {/* Export */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  aria-label="Export calculator data"
                >
                  <Download className="w-4 h-4 mr-2" />
                  <span className="hidden md:inline">Export</span>
                  <span className="md:hidden sr-only">Export</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => onExport('pdf')}>
                  Export as PDF
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onExport('csv')}>
                  Export Cap Table (CSV)
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onExport('json')}>
                  Export Data (JSON)
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Share */}
            <Button
              variant="ghost"
              size="sm"
              onClick={onShare}
              aria-label="Share calculator via link"
            >
              <Share2 className="w-4 h-4 mr-2" />
              <span className="hidden md:inline">Share</span>
              <span className="md:hidden sr-only">Share</span>
            </Button>
          </div>

          {/* Right: Theme Toggle */}
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleTheme}
            title="Toggle theme"
            aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
          >
            {theme === 'light' ? (
              <Moon className="w-4 h-4" />
            ) : (
              <Sun className="w-4 h-4" />
            )}
            <span className="sr-only">{theme === 'light' ? 'Dark mode' : 'Light mode'}</span>
          </Button>
        </div>
      </div>
    </nav>
  )
}
