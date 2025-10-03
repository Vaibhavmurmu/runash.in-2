"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Checkbox } from "@/components/ui/checkbox"

const COOKIE_NAME = "runash_cookie_consent"
const MAX_AGE = 60 * 60 * 24 * 180 // 180 days

type ConsentPrefs = {
  essential: boolean
  performance: boolean
  functional: boolean
  marketing: boolean
}

export function CookieConsent() {
  const [open, setOpen] = useState(false)
  const [prefs, setPrefs] = useState<ConsentPrefs>({
    essential: true,
    performance: false,
    functional: false,
    marketing: false,
  })

  useEffect(() => {
    const existing = document.cookie
      .split("; ")
      .find((c) => c.startsWith(`${COOKIE_NAME}=`))
      ?.split("=")[1]
    if (!existing) {
      setOpen(true)
    }
  }, [])

  const writeCookie = (value: ConsentPrefs) => {
    try {
      const payload = encodeURIComponent(JSON.stringify(value))
      document.cookie = `${COOKIE_NAME}=${payload}; path=/; max-age=${MAX_AGE}; SameSite=Lax`
    } catch {}
  }

  const acceptAll = () => {
    const v = { essential: true, performance: true, functional: true, marketing: true }
    setPrefs(v)
    writeCookie(v)
    setOpen(false)
  }

  const declineAll = () => {
    const v = { essential: true, performance: false, functional: false, marketing: false }
    setPrefs(v)
    writeCookie(v)
    setOpen(false)
  }

  const save = () => {
    writeCookie(prefs)
    setOpen(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-[520px]">
        <DialogHeader>
          <DialogTitle>We value your privacy</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">
            We use cookies to enhance your experience, analyze usage, and personalize content. You can accept, decline,
            or customize your preferences.
          </p>

          <div className="space-y-3 border rounded-lg p-3">
            <div className="flex items-start gap-3">
              <Checkbox checked={true} disabled className="mt-1" id="essential" />
              <div>
                <label htmlFor="essential" className="font-medium">
                  Essential
                </label>
                <p className="text-sm text-muted-foreground">Required for basic site functionality.</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Checkbox
                id="performance"
                checked={prefs.performance}
                onCheckedChange={(c) => setPrefs((p) => ({ ...p, performance: Boolean(c) }))}
                className="mt-1"
              />
              <div>
                <label htmlFor="performance" className="font-medium">
                  Performance
                </label>
                <p className="text-sm text-muted-foreground">Helps us understand usage and improve features.</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Checkbox
                id="functional"
                checked={prefs.functional}
                onCheckedChange={(c) => setPrefs((p) => ({ ...p, functional: Boolean(c) }))}
                className="mt-1"
              />
              <div>
                <label htmlFor="functional" className="font-medium">
                  Functional
                </label>
                <p className="text-sm text-muted-foreground">Remembers preferences like theme and locale.</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Checkbox
                id="marketing"
                checked={prefs.marketing}
                onCheckedChange={(c) => setPrefs((p) => ({ ...p, marketing: Boolean(c) }))}
                className="mt-1"
              />
              <div>
                <label htmlFor="marketing" className="font-medium">
                  Marketing
                </label>
                <p className="text-sm text-muted-foreground">Used for personalized content and campaigns.</p>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-2 sm:justify-end">
            <Button variant="outline" onClick={declineAll}>
              Decline
            </Button>
            <Button variant="outline" onClick={save}>
              Save preferences
            </Button>
            <Button onClick={acceptAll}>Accept all</Button>
          </div>
          <p className="text-xs text-muted-foreground">
            Manage cookies anytime in{" "}
            <a className="underline" href="/cookies">
              Cookie Policy
            </a>
            .
          </p>
        </div>
      </DialogContent>
    </Dialog>
  )
}
