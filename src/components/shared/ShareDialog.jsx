import { useState } from 'react'
import { Share2, Link2, Copy, Check, AlertCircle } from 'lucide-react'
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
import { Alert, AlertDescription } from '@/components/ui/alert'
import useCalculatorStore from '@/store/useCalculatorStore'
import { generateShareURL, copyToClipboard } from '@/lib/utils/url-share'

export default function ShareDialog({ isOpen, onClose }) {
  const [shareURL, setShareURL] = useState('')
  const [copied, setCopied] = useState(false)
  const [error, setError] = useState(null)
  const [generating, setGenerating] = useState(false)

  const store = useCalculatorStore()

  const handleGenerateLink = async () => {
    setGenerating(true)
    setError(null)
    setCopied(false)

    try {
      const state = {
        company: store.company,
        founders: store.founders,
        rounds: store.rounds,
        employees: store.employees,
        optionPool: store.optionPool,
        scenarios: store.scenarios,
      }

      const url = generateShareURL(state)
      setShareURL(url)
    } catch (err) {
      setError('Failed to generate share link. Your data might be too large to share via URL.')
      console.error(err)
    } finally {
      setGenerating(false)
    }
  }

  const handleCopy = async () => {
    try {
      await copyToClipboard(shareURL)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      setError('Failed to copy to clipboard')
    }
  }

  // Generate link when dialog opens
  if (isOpen && !shareURL && !generating && !error) {
    handleGenerateLink()
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Share2 className="w-5 h-5" />
            Share Your Calculator
          </DialogTitle>
          <DialogDescription>
            Generate a shareable link that includes all your current data
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="w-4 h-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="space-y-2">
            <Label htmlFor="share-url">Shareable Link</Label>
            <div className="flex gap-2">
              <Input
                id="share-url"
                value={shareURL}
                readOnly
                placeholder={
                  generating ? 'Generating link...' : 'Click Generate to create a shareable link'
                }
                className="flex-1 font-mono text-sm"
              />
              <Button onClick={handleCopy} disabled={!shareURL || generating} variant="outline">
                {copied ? (
                  <>
                    <Check className="w-4 h-4 mr-2" />
                    Copied!
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4 mr-2" />
                    Copy
                  </>
                )}
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">
              Anyone with this link can view your calculator setup. The data is encoded in the URL.
            </p>
          </div>

          {!shareURL && !generating && !error && (
            <Button onClick={handleGenerateLink} className="w-full">
              <Link2 className="w-4 h-4 mr-2" />
              Generate Share Link
            </Button>
          )}

          {/* Info Box */}
          <Alert>
            <AlertCircle className="w-4 h-4" />
            <AlertDescription>
              <strong>Privacy Note:</strong> The link contains all your calculator data encoded in
              the URL. Anyone with this link can view your equity structure. For sensitive data,
              consider using the Save feature instead.
            </AlertDescription>
          </Alert>

          {/* Preview of what's being shared */}
          {shareURL && (
            <div className="bg-muted p-4 rounded-lg">
              <div className="text-sm font-semibold mb-2">What&apos;s included in this link:</div>
              <div className="grid grid-cols-2 gap-2 text-sm text-muted-foreground">
                <div>• Company: {store.company.name || 'Unnamed'}</div>
                <div>• Founders: {store.founders.length}</div>
                <div>• Funding Rounds: {store.rounds.length}</div>
                <div>• Employees: {store.employees.length}</div>
                <div>• Option Pool: {store.optionPool.size}</div>
                <div>• Scenarios: {store.scenarios.length}</div>
              </div>
            </div>
          )}
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
