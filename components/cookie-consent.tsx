"use client"

import { useEffect, useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"

export default function CookieConsent() {
  const [open, setOpen] = useState(false)
  const [analytics, setAnalytics] = useState(true)
  const [marketing, setMarketing] = useState(false)

  useEffect(() => {
    const seen = localStorage.getItem("cookie-consent-v1")
    if (!seen) setOpen(true)
  }, [])

  const accept = () => {
    localStorage.setItem("cookie-consent-v1", JSON.stringify({ accepted: true, analytics, marketing, ts: Date.now() }))
    setOpen(false)
  }

  const decline = () => {
    localStorage.setItem("cookie-consent-v1", JSON.stringify({ accepted: false, ts: Date.now() }))
    setOpen(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>We value your privacy</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 text-sm">
          <p>
            We use cookies to enhance your experience, analyze site usage, and for marketing. You can manage your
            preferences below.
          </p>
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <Checkbox id="analytics" checked={analytics} onCheckedChange={(v) => setAnalytics(!!v)} />
              <label htmlFor="analytics">Analytics cookies</label>
            </div>
            <div className="flex items-center gap-3">
              <Checkbox id="marketing" checked={marketing} onCheckedChange={(v) => setMarketing(!!v)} />
              <label htmlFor="marketing">Marketing cookies</label>
            </div>
          </div>
          <div className="flex gap-2 justify-end">
            <Button variant="outline" onClick={decline}>
              Decline
            </Button>
            <Button onClick={accept}>Accept</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
