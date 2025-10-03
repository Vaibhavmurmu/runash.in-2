"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowRight, Check, ChevronRight, Play, Sparkles, Zap, Github, Mail, Eye, EyeOff, Loader2 } from "lucide-react"
import { signIn } from "next-auth/react"
import ThemeToggle from "@/components/theme-toggle"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp"
import { useSession } from "next-auth/react"
import { Separator } from "@/components/ui/separator"
import { Phone, Building2, KeyRound, ShieldCheck } from "lucide-react"
import { ShoppingCart } from "lucide-react"

const dashboardByType: Record<string, string> = {
  creator: "/dashboard",
  seller: "/seller/dashboard",
  buyer: "/grocery",
  enterprise: "/business",
}

export default function GetStartedPage() {
  const [step, setStep] = useState(1)
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    name: "",
    username: "",
    platforms: [] as string[],
    contentTypes: [] as string[],
  })
  const router = useRouter()
  const { data: session, status } = useSession()
  const [userType, setUserType] = useState<"creator" | "seller" | "buyer" | "enterprise" | null>(null)
  const [emailForOtp, setEmailForOtp] = useState("")
  const [smsForOtp, setSmsForOtp] = useState("")
  const [otpCode, setOtpCode] = useState("")
  const [otpDialogOpen, setOtpDialogOpen] = useState<null | "email" | "sms">(null)
  const [resendMsg, setResendMsg] = useState<string | null>(null)
  const [passkeyEmail, setPasskeyEmail] = useState("")

  useEffect(() => {
    if (status === "authenticated") {
      const target = userType ? dashboardByType[userType] : "/dashboard"
      router.replace(target)
    }
  }, [status, userType, router])

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleCheckboxChange = (field: string, value: string, checked: boolean) => {
    setFormData((prev) => ({
      ...prev,
      [field]: checked
        ? [...(prev[field as keyof typeof prev] as string[]), value]
        : (prev[field as keyof typeof prev] as string[]).filter((item) => item !== value),
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      if (step === 1) {
        // Create account
        const response = await fetch("/api/auth/register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: formData.email,
            password: formData.password,
            name: formData.name,
          }),
        })

        if (response.ok) {
          setStep(2)
        } else {
          const error = await response.json()
          console.error("Registration error:", error)
        }
      } else if (step === 2) {
        // Complete profile setup
        await new Promise((resolve) => setTimeout(resolve, 1500))
        setStep(3)
      }
    } catch (error) {
      console.error("Error:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleOAuthSignIn = async (provider: string) => {
    setIsLoading(true)
    try {
      await signIn(provider, { callbackUrl: "/dashboard" })
    } catch (error) {
      console.error("OAuth error:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const sendMagic = async () => {
    if (!formData.email) return
    setIsLoading(true)
    try {
      const res = await fetch("/api/auth/magic-link", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: formData.email }),
      })
      const j = await res.json()
      if (!res.ok) throw new Error(j.error || j.message || "Failed")
      alert(j.message || "Magic link sent!")
    } catch (e: any) {
      console.error("[v0] magic link error:", e?.message)
    } finally {
      setIsLoading(false)
    }
  }

  const resendVerification = async () => {
    if (!formData.email) return
    setIsLoading(true)
    setResendMsg(null)
    try {
      const res = await fetch("/api/auth/resend-verification", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: formData.email }),
      })
      const j = await res.json()
      setResendMsg(j.message || "If an account exists, a link was sent.")
    } catch (e) {
      setResendMsg("Please try again later.")
    } finally {
      setIsLoading(false)
    }
  }

  const sendEmailOtp = async () => {
    if (!emailForOtp) return
    setIsLoading(true)
    try {
      const res = await fetch("/api/auth/otp/email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: emailForOtp, purpose: "login" }),
      })
      const j = await res.json()
      if (!j.success) throw new Error(j.message)
      setOtpDialogOpen("email")
    } catch (e) {
      console.error("[v0] email otp send error:", e)
    } finally {
      setIsLoading(false)
    }
  }

  const verifyEmailOtp = async () => {
    if (!emailForOtp || otpCode.length !== 6) return
    setIsLoading(true)
    try {
      const res = await fetch("/api/auth/otp/email", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: emailForOtp, code: otpCode, purpose: "login" }),
      })
      const j = await res.json()
      if (!j.success) throw new Error(j.message)
      alert("Email verified. Please continue with magic link or set a password.")
      setOtpDialogOpen(null)
    } catch (e: any) {
      alert(e.message || "Failed to verify code")
    } finally {
      setIsLoading(false)
    }
  }

  const sendSmsOtp = async () => {
    if (!smsForOtp) return
    setIsLoading(true)
    try {
      const res = await fetch("/api/auth/otp/sms", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phoneNumber: smsForOtp, purpose: "login" }),
      })
      const j = await res.json()
      if (!j.success) throw new Error(j.message)
      setOtpDialogOpen("sms")
    } catch (e) {
      console.error("[v0] sms otp send error:", e)
    } finally {
      setIsLoading(false)
    }
  }

  const verifySmsOtp = async () => {
    if (!smsForOtp || otpCode.length !== 6) return
    setIsLoading(true)
    try {
      const res = await fetch("/api/auth/otp/sms", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phoneNumber: smsForOtp, code: otpCode, purpose: "login" }),
      })
      const j = await res.json()
      if (!j.success) throw new Error(j.message)
      alert("Mobile verified. Please continue with magic link or OAuth.")
      setOtpDialogOpen(null)
    } catch (e: any) {
      alert(e.message || "Failed to verify code")
    } finally {
      setIsLoading(false)
    }
  }

  const loginWithPasskey = async () => {
    try {
      setIsLoading(true)
      const optsRes = await fetch(
        `/api/auth/passkey/authenticate${passkeyEmail ? `?email=${encodeURIComponent(passkeyEmail)}` : ""}`,
      )
      const options = await optsRes.json()
      const publicKey: PublicKeyCredentialRequestOptions = {
        ...options,
        challenge: Uint8Array.from(atob(options.challenge.replace(/-/g, "+").replace(/_/g, "/")), (c) =>
          c.charCodeAt(0),
        ),
        allowCredentials: options.allowCredentials?.map((c: any) => ({
          ...c,
          id: Uint8Array.from(atob(c.id.replace(/-/g, "+").replace(/_/g, "/")), (ch) => ch.charCodeAt(0)),
        })),
      }
      const cred = (await navigator.credentials.get({ publicKey })) as PublicKeyCredential
      const response = {
        id: cred.id,
        rawId: btoa(String.fromCharCode(...new Uint8Array(cred.rawId as ArrayBuffer)))
          .replace(/\+/g, "-")
          .replace(/\//g, "_")
          .replace(/=+$/, ""),
        response: {
          clientDataJSON: btoa(String.fromCharCode(...new Uint8Array(cred.response.clientDataJSON as ArrayBuffer)))
            .replace(/\+/g, "-")
            .replace(/\//g, "_")
            .replace(/=+$/, ""),
          authenticatorData: btoa(
            String.fromCharCode(...new Uint8Array((cred.response as any).authenticatorData as ArrayBuffer)),
          )
            .replace(/\+/g, "-")
            .replace(/\//g, "_")
            .replace(/=+$/, ""),
          signature: btoa(String.fromCharCode(...new Uint8Array((cred.response as any).signature as ArrayBuffer)))
            .replace(/\+/g, "-")
            .replace(/\//g, "_")
            .replace(/=+$/, ""),
          userHandle: (cred.response as any).userHandle
            ? btoa(String.fromCharCode(...new Uint8Array((cred.response as any).userHandle as ArrayBuffer)))
                .replace(/\+/g, "-")
                .replace(/\//g, "_")
                .replace(/=+$/, "")
            : null,
        },
        type: cred.type as "public-key",
      }
      const verifyRes = await fetch("/api/auth/passkey/authenticate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ response, expectedChallenge: options.challenge }),
      })
      if (!verifyRes.ok) throw new Error("Passkey verification failed")
      const target = userType ? dashboardByType[userType] : "/dashboard"
      router.replace(target)
    } catch (e) {
      console.error("[v0] passkey auth error:", e)
      alert("Passkey login failed. Try another method.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-amber-50 dark:from-orange-950/20 dark:via-gray-950 dark:to-amber-950/20 text-gray-900 dark:text-white flex flex-col">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebApplication",
            name: "RunAsh AI",
            applicationCategory: "Multimedia",
            offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
            url: (typeof window !== "undefined" && window.location.origin) || "https://runash.in",
          }),
        }}
      />
      <header className="w-full py-6 px-6 flex justify-between items-center">
        <Link href="/" className="flex items-center group">
          <div className="relative mr-3 h-10 w-10 overflow-hidden rounded-xl bg-gradient-to-br from-orange-500 to-amber-400 shadow-lg group-hover:shadow-xl transition-all duration-300">
            <div className="absolute inset-0 flex items-center justify-center text-white font-bold text-lg">R</div>
          </div>
          <span className="text-2xl font-bold bg-gradient-to-r from-orange-600 via-orange-500 to-amber-500 dark:from-orange-400 dark:via-orange-300 dark:to-amber-300 text-transparent bg-clip-text">
            RunAsh
          </span>
        </Link>
        <div className="flex items-center gap-4">
          <ThemeToggle />
          <Link
            href="/login"
            className="text-sm text-gray-600 dark:text-gray-400 hover:text-orange-600 dark:hover:text-orange-400 transition-colors"
          >
            Already have an account?
          </Link>
        </div>
      </header>

      <main className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-4xl">
          <div className="mb-6">
            <h2 className="sr-only">Select user type</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {[
                { key: "creator", label: "Creator", icon: Sparkles },
                { key: "seller", label: "Seller", icon: Zap },
                { key: "buyer", label: "Buyer", icon: ShoppingCart },
                { key: "enterprise", label: "Enterprise", icon: Building2 },
              ].map((t) => (
                <button
                  key={t.key}
                  onClick={() => setUserType(t.key as any)}
                  className={`flex items-center gap-2 rounded-lg border px-3 py-2 text-sm transition-colors ${
                    userType === t.key
                      ? "border-orange-500 bg-orange-50 dark:bg-orange-900/20"
                      : "border-gray-200 dark:border-gray-800 hover:border-orange-300"
                  }`}
                  aria-pressed={userType === t.key}
                >
                  <t.icon className="h-4 w-4 text-orange-600 dark:text-orange-400" />
                  <span>{t.label}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="mb-12">
            <div className="flex items-center justify-between max-w-md mx-auto">
              {[1, 2, 3].map((stepNumber) => (
                <div key={stepNumber} className="flex flex-col items-center">
                  <div
                    className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 ${
                      step >= stepNumber
                        ? "bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-lg"
                        : "bg-white dark:bg-gray-800 text-gray-400 border-2 border-gray-200 dark:border-gray-700"
                    }`}
                  >
                    {step > stepNumber ? <Check className="h-6 w-6" /> : stepNumber}
                  </div>
                  <span className="text-sm mt-3 font-medium">
                    {stepNumber === 1 ? "Account" : stepNumber === 2 ? "Profile" : "Complete"}
                  </span>
                  {stepNumber < 3 && (
                    <div className="absolute mt-6 ml-12 w-24 h-1 bg-gray-200 dark:bg-gray-700">
                      <div
                        className={`h-full bg-gradient-to-r from-orange-500 to-amber-500 transition-all duration-300 ${
                          step > stepNumber ? "w-full" : "w-0"
                        }`}
                      />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {step === 1 && (
            <Card className="max-w-md mx-auto shadow-2xl border-0 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm">
              <CardHeader className="text-center pb-6">
                <CardTitle className="text-2xl font-bold bg-gradient-to-r from-orange-600 to-amber-600 text-transparent bg-clip-text">
                  Create your account
                </CardTitle>
                <CardDescription className="text-gray-600 dark:text-gray-400">
                  Start your AI-powered streaming journey
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-3">
                  <Button
                    onClick={() => handleOAuthSignIn("google")}
                    variant="outline"
                    className="w-full h-12 border-orange-200 hover:border-orange-300 hover:bg-orange-50 dark:border-orange-800 dark:hover:bg-orange-950/20"
                    disabled={isLoading}
                  >
                    <Mail className="mr-3 h-5 w-5 text-red-500" />
                    Continue with Google
                  </Button>
                  <Button
                    onClick={() => handleOAuthSignIn("github")}
                    variant="outline"
                    className="w-full h-12 border-orange-200 hover:border-orange-300 hover:bg-orange-50 dark:border-orange-800 dark:hover:bg-orange-950/20"
                    disabled={isLoading}
                  >
                    <Github className="mr-3 h-5 w-5" />
                    Continue with GitHub
                  </Button>
                </div>

                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-200 dark:border-gray-700" />
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-4 bg-white dark:bg-gray-900 text-gray-500">Or continue with email</span>
                  </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input
                      id="name"
                      placeholder="Enter your full name"
                      value={formData.name}
                      onChange={(e) => handleInputChange("name", e.target.value)}
                      required
                      className="h-12 border-orange-200 focus:border-orange-400 dark:border-orange-800"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="you@example.com"
                      value={formData.email}
                      onChange={(e) => handleInputChange("email", e.target.value)}
                      required
                      className="h-12 border-orange-200 focus:border-orange-400 dark:border-orange-800"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <div className="relative">
                      <Input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Create a strong password"
                        value={formData.password}
                        onChange={(e) => handleInputChange("password", e.target.value)}
                        required
                        className="h-12 pr-12 border-orange-200 focus:border-orange-400 dark:border-orange-800"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="absolute right-0 top-0 h-12 w-12"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">Confirm Password</Label>
                    <Input
                      id="confirmPassword"
                      type="password"
                      placeholder="Confirm your password"
                      value={formData.confirmPassword}
                      onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
                      required
                      className="h-12 border-orange-200 focus:border-orange-400 dark:border-orange-800"
                    />
                  </div>

                  <div className="flex items-start space-x-3 pt-2">
                    <Checkbox id="terms" required className="mt-1" />
                    <Label htmlFor="terms" className="text-sm leading-relaxed text-gray-600 dark:text-gray-400">
                      I agree to the{" "}
                      <Link
                        href="/terms"
                        className="text-orange-600 hover:text-orange-700 dark:text-orange-400 underline"
                      >
                        Terms of Service
                      </Link>{" "}
                      and{" "}
                      <Link
                        href="/privacy"
                        className="text-orange-600 hover:text-orange-700 dark:text-orange-400 underline"
                      >
                        Privacy Policy
                      </Link>
                    </Label>
                  </div>

                  <Button
                    type="submit"
                    disabled={isLoading}
                    className="w-full h-12 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-medium shadow-lg hover:shadow-xl transition-all duration-300"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Creating account...
                      </>
                    ) : (
                      <>
                        Continue
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </>
                    )}
                  </Button>
                </form>

                <Accordion type="single" collapsible className="w-full">
                  <AccordionItem value="enterprise-sso">
                    <AccordionTrigger>
                      <div className="flex items-center gap-2">
                        <ShieldCheck className="h-4 w-4 text-orange-600 dark:text-orange-400" />
                        Enterprise SSO (SAML/OIDC)
                      </div>
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="space-y-3">
                        <Label htmlFor="enterprise-email">Work Email</Label>
                        <Input
                          id="enterprise-email"
                          type="email"
                          placeholder="you@company.com"
                          onChange={(e) => handleInputChange("email", e.target.value)}
                          value={formData.email}
                        />
                        <Button
                          variant="outline"
                          onClick={async () => {
                            try {
                              setIsLoading(true)
                              const res = await fetch("/api/auth/sso/check", {
                                method: "POST",
                                headers: { "Content-Type": "application/json" },
                                body: JSON.stringify({ email: formData.email }),
                              })
                              const j = await res.json()
                              if (j.hasSSO && j.redirectUrl) {
                                window.location.href = j.redirectUrl
                              } else if (j.ssoUrl) {
                                window.location.href = j.ssoUrl
                              } else {
                                alert("No SSO found for this domain. Try OAuth or email.")
                              }
                            } finally {
                              setIsLoading(false)
                            }
                          }}
                        >
                          Continue with SSO
                        </Button>
                      </div>
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="passkeys">
                    <AccordionTrigger>
                      <div className="flex items-center gap-2">
                        <KeyRound className="h-4 w-4 text-orange-600 dark:text-orange-400" />
                        Passkeys (passwordless)
                      </div>
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="space-y-3">
                        <Label htmlFor="passkey-email">Email (optional)</Label>
                        <Input
                          id="passkey-email"
                          type="email"
                          value={passkeyEmail}
                          onChange={(e) => setPasskeyEmail(e.target.value)}
                          placeholder="you@example.com"
                        />
                        <Button onClick={loginWithPasskey} disabled={isLoading} className="w-full">
                          Use Passkey
                        </Button>
                        <p className="text-xs text-muted-foreground">
                          Tip: Register a passkey after sign-in from your account security settings.
                        </p>
                      </div>
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="magic-link">
                    <AccordionTrigger>
                      <div className="flex items-center gap-2">
                        <Mail className="h-4 w-4 text-orange-600 dark:text-orange-400" />
                        Magic Link
                      </div>
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="space-y-3">
                        <Label htmlFor="ml-email">Email</Label>
                        <Input
                          id="ml-email"
                          type="email"
                          value={formData.email}
                          onChange={(e) => handleInputChange("email", e.target.value)}
                          placeholder="you@example.com"
                        />
                        <div className="flex items-center gap-2">
                          <Button variant="outline" onClick={sendMagic} disabled={isLoading}>
                            Send Magic Link
                          </Button>
                          <Button variant="ghost" size="sm" onClick={resendVerification} disabled={isLoading}>
                            Resend verification
                          </Button>
                        </div>
                        {resendMsg && <p className="text-xs text-muted-foreground">{resendMsg}</p>}
                      </div>
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="email-otp">
                    <AccordionTrigger>Email OTP</AccordionTrigger>
                    <AccordionContent>
                      <div className="space-y-3">
                        <Label htmlFor="otp-email">Email</Label>
                        <Input
                          id="otp-email"
                          type="email"
                          value={emailForOtp}
                          onChange={(e) => setEmailForOtp(e.target.value)}
                          placeholder="you@example.com"
                        />
                        <Button variant="outline" onClick={sendEmailOtp} disabled={isLoading}>
                          Send Code
                        </Button>
                      </div>
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="sms-otp">
                    <AccordionTrigger className="flex items-center gap-2">
                      <Phone className="h-4 w-4 text-orange-600 dark:text-orange-400" />
                      Mobile OTP
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="space-y-3">
                        <Label htmlFor="otp-sms">Mobile (E.164)</Label>
                        <Input
                          id="otp-sms"
                          type="tel"
                          value={smsForOtp}
                          onChange={(e) => setSmsForOtp(e.target.value)}
                          placeholder="+11234567890"
                        />
                        <Button variant="outline" onClick={sendSmsOtp} disabled={isLoading}>
                          Send Code
                        </Button>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>

                <Separator />
              </CardContent>
            </Card>
          )}

          <Dialog open={otpDialogOpen !== null} onOpenChange={(open) => !open && setOtpDialogOpen(null)}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Enter verification code</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <InputOTP maxLength={6} value={otpCode} onChange={setOtpCode}>
                  <InputOTPGroup>
                    <InputOTPSlot index={0} />
                    <InputOTPSlot index={1} />
                    <InputOTPSlot index={2} />
                    <InputOTPSlot index={3} />
                    <InputOTPSlot index={4} />
                    <InputOTPSlot index={5} />
                  </InputOTPGroup>
                </InputOTP>
                <p className="text-xs text-muted-foreground">
                  We sent a 6-digit code to {otpDialogOpen === "email" ? emailForOtp : smsForOtp}.
                </p>
              </div>
              <DialogFooter>
                <Button
                  onClick={otpDialogOpen === "email" ? verifyEmailOtp : verifySmsOtp}
                  disabled={otpCode.length !== 6 || isLoading}
                >
                  Verify
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          {step === 2 && (
            <Card className="max-w-md mx-auto shadow-2xl border-0 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm">
              <CardHeader className="text-center pb-6">
                <CardTitle className="text-2xl font-bold bg-gradient-to-r from-orange-600 to-amber-600 text-transparent bg-clip-text">
                  Set up your profile
                </CardTitle>
                <CardDescription className="text-gray-600 dark:text-gray-400">
                  Tell us about your streaming preferences
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="username">Username</Label>
                    <div className="flex">
                      <span className="inline-flex items-center px-4 rounded-l-lg border border-r-0 border-orange-200 dark:border-orange-800 bg-orange-50 dark:bg-orange-950/20 text-gray-600 dark:text-gray-400 text-sm">
                        runash.ai/
                      </span>
                      <Input
                        id="username"
                        placeholder="username"
                        value={formData.username}
                        onChange={(e) => handleInputChange("username", e.target.value)}
                        required
                        className="rounded-l-none border-orange-200 focus:border-orange-400 dark:border-orange-800"
                      />
                    </div>
                  </div>

                  <div className="space-y-3">
                    <Label>Streaming Platforms</Label>
                    <div className="grid grid-cols-2 gap-3">
                      {["Twitch", "YouTube", "Facebook", "Instagram"].map((platform) => (
                        <div key={platform} className="flex items-center space-x-2">
                          <Checkbox
                            id={`platform-${platform.toLowerCase()}`}
                            checked={formData.platforms.includes(platform)}
                            onCheckedChange={(checked) =>
                              handleCheckboxChange("platforms", platform, checked as boolean)
                            }
                          />
                          <Label htmlFor={`platform-${platform.toLowerCase()}`} className="text-sm">
                            {platform}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-3">
                    <Label>Content Type</Label>
                    <div className="grid grid-cols-2 gap-3">
                      {["Creative", "Selling", "Businesses", "IRL"].map((type) => (
                        <div key={type} className="flex items-center space-x-2">
                          <Checkbox
                            id={`content-${type.toLowerCase()}`}
                            checked={formData.contentTypes.includes(type)}
                            onCheckedChange={(checked) =>
                              handleCheckboxChange("contentTypes", type, checked as boolean)
                            }
                          />
                          <Label htmlFor={`content-${type.toLowerCase()}`} className="text-sm">
                            {type}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>

                  <Button
                    type="submit"
                    disabled={isLoading}
                    className="w-full h-12 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-medium shadow-lg hover:shadow-xl transition-all duration-300"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Saving profile...
                      </>
                    ) : (
                      <>
                        Continue
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          )}

          {step === 3 && (
            <Card className="max-w-lg mx-auto shadow-2xl border-0 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm">
              <CardContent className="pt-8">
                <div className="text-center mb-8">
                  <div className="w-20 h-20 bg-gradient-to-r from-orange-500 to-amber-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                    <Check className="h-10 w-10 text-white" />
                  </div>
                  <h1 className="text-3xl font-bold mb-3 bg-gradient-to-r from-orange-600 to-amber-600 text-transparent bg-clip-text">
                    Welcome to RunAsh!
                  </h1>
                  <p className="text-gray-600 dark:text-gray-400 text-lg">
                    Your AI-powered streaming journey starts now
                  </p>
                </div>

                <Tabs defaultValue="explore" className="mb-8">
                  <TabsList className="grid grid-cols-3 bg-orange-100/50 dark:bg-orange-900/20">
                    <TabsTrigger value="explore">Explore</TabsTrigger>
                    <TabsTrigger value="setup">Quick Setup</TabsTrigger>
                    <TabsTrigger value="learn">Learn</TabsTrigger>
                  </TabsList>

                  <TabsContent value="explore" className="mt-6">
                    <div className="space-y-4">
                      {[
                        { icon: Sparkles, title: "AI Features", desc: "Discover AI-powered streaming tools" },
                        { icon: Zap, title: "Dashboard", desc: "View your analytics and insights" },
                        { icon: Play, title: "Start Streaming", desc: "Go live with enhanced features" },
                      ].map((item, index) => (
                        <Card
                          key={index}
                          className="border-orange-200/50 dark:border-orange-900/30 hover:border-orange-300 dark:hover:border-orange-700 transition-colors cursor-pointer"
                        >
                          <CardContent className="p-4 flex items-center gap-4">
                            <div className="p-3 bg-gradient-to-r from-orange-100 to-amber-100 dark:from-orange-900/30 dark:to-amber-900/30 rounded-lg">
                              <item.icon className="h-6 w-6 text-orange-600 dark:text-orange-400" />
                            </div>
                            <div className="flex-1">
                              <h3 className="font-semibold text-gray-900 dark:text-white">{item.title}</h3>
                              <p className="text-sm text-gray-600 dark:text-gray-400">{item.desc}</p>
                            </div>
                            <ChevronRight className="h-5 w-5 text-gray-400" />
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </TabsContent>

                  <TabsContent value="setup" className="mt-6">
                    <div className="text-center py-8">
                      <p className="text-gray-600 dark:text-gray-400">
                        Quick setup guides and tutorials will be available here
                      </p>
                    </div>
                  </TabsContent>

                  <TabsContent value="learn" className="mt-6">
                    <div className="text-center py-8">
                      <p className="text-gray-600 dark:text-gray-400">
                        Learning resources and documentation will be available here
                      </p>
                    </div>
                  </TabsContent>
                </Tabs>

                <Button
                  onClick={() => {
                    const target = userType ? dashboardByType[userType] : "/dashboard"
                    router.push(target)
                  }}
                  className="w-full h-12 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-medium shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  Go to {userType ? userType.charAt(0).toUpperCase() + userType.slice(1) : "Dashboard"}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </main>

      <footer className="py-8">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              © {new Date().getFullYear()} RunAsh AI. All rights reserved.
            </p>
            <div className="flex items-center gap-6 mt-4 md:mt-0">
              <Link
                href="/support"
                className="text-sm text-gray-500 dark:text-gray-400 hover:text-orange-600 dark:hover:text-orange-400 transition-colors"
              >
                Help Center
              </Link>
              <Link
                href="/terms"
                className="text-sm text-gray-500 dark:text-gray-400 hover:text-orange-600 dark:hover:text-orange-400 transition-colors"
              >
                Terms
              </Link>
              <Link
                href="/privacy"
                className="text-sm text-gray-500 dark:text-gray-400 hover:text-orange-600 dark:hover:text-orange-400 transition-colors"
              >
                Privacy
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
