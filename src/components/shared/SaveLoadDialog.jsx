import { useState, useEffect } from 'react'
import { Save, FolderOpen, Trash2, Edit2, Check, X } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import useCalculatorStore from '@/store/useCalculatorStore'
import {
  getSavedSessions,
  saveSession,
  loadSession,
  deleteSession,
  renameSession,
} from '@/lib/utils/storage'
import { format } from 'date-fns'

export default function SaveLoadDialog({ isOpen, onClose, mode = 'save' }) {
  const [savedSessions, setSavedSessions] = useState([])
  const [saveName, setSaveName] = useState('')
  const [editingId, setEditingId] = useState(null)
  const [editingName, setEditingName] = useState('')
  const [activeTab, setActiveTab] = useState(mode)

  const store = useCalculatorStore()

  useEffect(() => {
    if (isOpen) {
      loadSavedSessions()
      setActiveTab(mode)
    }
  }, [isOpen, mode])

  const loadSavedSessions = () => {
    const sessions = getSavedSessions()
    setSavedSessions(sessions.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp)))
  }

  const handleSave = () => {
    if (!saveName.trim()) {
      alert('Please enter a name for this save')
      return
    }

    try {
      const stateToSave = {
        company: store.company,
        founders: store.founders,
        rounds: store.rounds,
        employees: store.employees,
        optionPool: store.optionPool,
        scenarios: store.scenarios,
      }

      saveSession(saveName, stateToSave)
      setSaveName('')
      loadSavedSessions()
      alert('Saved successfully!')
    } catch (error) {
      alert('Error saving: ' + error.message)
    }
  }

  const handleLoad = id => {
    try {
      const data = loadSession(id)
      store.loadTemplate(data)
      onClose()
      alert('Loaded successfully!')
    } catch (error) {
      alert('Error loading: ' + error.message)
    }
  }

  const handleDelete = id => {
    if (!confirm('Are you sure you want to delete this save?')) {
      return
    }

    try {
      deleteSession(id)
      loadSavedSessions()
    } catch (error) {
      alert('Error deleting: ' + error.message)
    }
  }

  const startEditing = save => {
    setEditingId(save.id)
    setEditingName(save.name)
  }

  const cancelEditing = () => {
    setEditingId(null)
    setEditingName('')
  }

  const saveEditing = id => {
    if (!editingName.trim()) {
      alert('Name cannot be empty')
      return
    }

    try {
      renameSession(id, editingName)
      loadSavedSessions()
      cancelEditing()
    } catch (error) {
      alert('Error renaming: ' + error.message)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Save & Load</DialogTitle>
          <DialogDescription>
            Save your current progress or load a previously saved session
          </DialogDescription>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="save">
              <Save className="w-4 h-4 mr-2" />
              Save
            </TabsTrigger>
            <TabsTrigger value="load">
              <FolderOpen className="w-4 h-4 mr-2" />
              Load
            </TabsTrigger>
          </TabsList>

          {/* Save Tab */}
          <TabsContent value="save" className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="save-name">Save Name *</Label>
              <Input
                id="save-name"
                placeholder="e.g., After Series A, Q4 2024 Model"
                value={saveName}
                onChange={e => setSaveName(e.target.value)}
                onKeyDown={e => {
                  if (e.key === 'Enter') {
                    handleSave()
                  }
                }}
              />
              <p className="text-xs text-muted-foreground">
                Give this save a descriptive name so you can find it later
              </p>
            </div>

            <Button onClick={handleSave} disabled={!saveName.trim()} className="w-full">
              <Save className="w-4 h-4 mr-2" />
              Save Current Progress
            </Button>

            {/* Current State Preview */}
            <Card>
              <CardContent className="pt-6">
                <div className="text-sm space-y-1">
                  <div className="font-semibold mb-2">Current State Preview:</div>
                  <div className="grid grid-cols-2 gap-2 text-muted-foreground">
                    <div>Company: {store.company.name || 'Unnamed'}</div>
                    <div>Founders: {store.founders.length}</div>
                    <div>Rounds: {store.rounds.length}</div>
                    <div>Employees: {store.employees.length}</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Load Tab */}
          <TabsContent value="load" className="space-y-4">
            {savedSessions.length > 0 ? (
              <div className="space-y-2">
                {savedSessions.map(save => (
                  <Card key={save.id} className="hover:border-primary-200 transition-colors">
                    <CardContent className="pt-6">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          {editingId === save.id ? (
                            <div className="flex items-center gap-2">
                              <Input
                                value={editingName}
                                onChange={e => setEditingName(e.target.value)}
                                onKeyDown={e => {
                                  if (e.key === 'Enter') {
                                    saveEditing(save.id)
                                  } else if (e.key === 'Escape') {
                                    cancelEditing()
                                  }
                                }}
                                autoFocus
                              />
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => saveEditing(save.id)}
                              >
                                <Check className="w-4 h-4" />
                              </Button>
                              <Button size="sm" variant="ghost" onClick={cancelEditing}>
                                <X className="w-4 h-4" />
                              </Button>
                            </div>
                          ) : (
                            <div className="font-semibold text-lg">{save.name}</div>
                          )}

                          <div className="text-xs text-muted-foreground mt-1">
                            {format(new Date(save.timestamp), 'MMM dd, yyyy HH:mm')}
                          </div>

                          <div className="flex gap-2 mt-2 flex-wrap">
                            {save.preview && (
                              <>
                                <Badge variant="secondary">
                                  {save.preview.foundersCount}{' '}
                                  {save.preview.foundersCount === 1 ? 'Founder' : 'Founders'}
                                </Badge>
                                <Badge variant="secondary">
                                  {save.preview.roundsCount}{' '}
                                  {save.preview.roundsCount === 1 ? 'Round' : 'Rounds'}
                                </Badge>
                                <Badge variant="secondary">
                                  {save.preview.employeesCount}{' '}
                                  {save.preview.employeesCount === 1 ? 'Employee' : 'Employees'}
                                </Badge>
                              </>
                            )}
                          </div>
                        </div>

                        <div className="flex gap-1 ml-4">
                          {editingId !== save.id && (
                            <>
                              <Button size="sm" variant="ghost" onClick={() => startEditing(save)}>
                                <Edit2 className="w-4 h-4" />
                              </Button>
                              <Button
                                size="sm"
                                variant="default"
                                onClick={() => handleLoad(save.id)}
                              >
                                Load
                              </Button>
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => handleDelete(save.id)}
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 text-muted-foreground">
                <FolderOpen className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p className="text-sm">No saved sessions yet</p>
                <p className="text-xs">Save your current progress to access it later</p>
              </div>
            )}
          </TabsContent>
        </Tabs>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
