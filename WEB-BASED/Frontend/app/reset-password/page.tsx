"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { CONFIG } from "@/lib/config"
import { AlertCircle, CheckCircle2, Loader2, Mail } from "lucide-react"
import { toast } from "sonner"

interface ResetValidation {
  valid: boolean
  message: string
  account_type?: string
  email?: string
  role?: string
  expires_at?: string
}

export default function ResetPasswordPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const token = searchParams.get("token") ?? ""

  const [loading, setLoading] = useState(Boolean(token))
  const [submitting, setSubmitting] = useState(false)
  const [validation, setValidation] = useState<ResetValidation | null>(null)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")

  useEffect(() => {
    const validateToken = async () => {
      if (!token) {
        setLoading(false)
        return
      }

      try {
        const response = await fetch(
          `${CONFIG.backend.fullUrl}${CONFIG.auth.validatePasswordResetEndpoint}?token=${encodeURIComponent(token)}`,
        )
        const data = await response.json().catch(() => ({
          valid: false,
          message: "Unable to validate the reset link right now.",
        }))
        setValidation(data as ResetValidation)
      } catch (error) {
        console.error("Error validating password reset token:", error)
        setValidation({
          valid: false,
          message: "Unable to validate the reset link right now. Please try again shortly.",
        })
      } finally {
        setLoading(false)
      }
    }

    void validateToken()
  }, [token])

  const handleRequestReset = async (event: React.FormEvent) => {
    event.preventDefault()

    if (!email.trim()) {
      toast.error("Enter the account email to continue")
      return
    }

    try {
      setSubmitting(true)
      const response = await fetch(`${CONFIG.backend.fullUrl}${CONFIG.auth.requestPasswordResetEndpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim().toLowerCase() }),
      })
      const data = await response.json().catch(() => ({}))
      if (!response.ok) {
        toast.error((data as { detail?: string; error?: string }).detail || (data as { detail?: string; error?: string }).error || "Unable to send reset email")
        return
      }

      const successMessage = (data as { message?: string }).message || "If an account exists for this email, a reset link has been sent."
      toast.success(successMessage)
    } catch (error) {
      console.error("Error requesting password reset:", error)
      toast.error("Unable to send reset email")
    } finally {
      setSubmitting(false)
    }
  }

  const handleCompleteReset = async (event: React.FormEvent) => {
    event.preventDefault()

    if (!validation?.valid) return
    if (!password.trim() || password.trim().length < 8) {
      toast.error("Password must be at least 8 characters")
      return
    }
    if (password !== confirmPassword) {
      toast.error("Passwords do not match")
      return
    }

    try {
      setSubmitting(true)
      const response = await fetch(`${CONFIG.backend.fullUrl}${CONFIG.auth.completePasswordResetEndpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          token,
          password,
          confirm_password: confirmPassword,
        }),
      })
      const data = await response.json().catch(() => ({}))
      if (!response.ok) {
        toast.error((data as { detail?: string; error?: string }).detail || (data as { detail?: string; error?: string }).error || "Unable to reset password")
        return
      }

      toast.success("Password reset completed. You can now sign in.")
      router.push("/login")
    } catch (error) {
      console.error("Error completing password reset:", error)
      toast.error("Unable to reset password")
    } finally {
      setSubmitting(false)
    }
  }

  const sharedWrapperClass =
    "relative flex min-h-screen items-center justify-center overflow-hidden bg-gradient-to-br from-blue-950 via-blue-900 to-blue-800 px-4 py-10"

  return (
    <div className={sharedWrapperClass}>
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/4 top-1/4 h-96 w-96 rounded-full bg-blue-500/10 blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 h-96 w-96 rounded-full bg-cyan-500/10 blur-3xl" />
      </div>

      <Card className="relative z-10 w-full max-w-xl border-white/10 bg-white/95 shadow-2xl">
        <CardContent className="p-8">
          <div className="mb-6 text-center">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-teal-500 to-cyan-600">
              {token ? <CheckCircle2 className="h-7 w-7 text-white" /> : <Mail className="h-7 w-7 text-white" />}
            </div>
            <h1 className="text-2xl font-bold text-slate-900">
              {token ? "Choose a new password" : "Forgot your password?"}
            </h1>
            <p className="mt-2 text-sm text-slate-500">
              {token
                ? "Set a new password for your HydraNet account using the secure link from your email."
                : "Enter your account email and we will send you a secure password reset link."}
            </p>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-14">
              <Loader2 className="h-8 w-8 animate-spin text-slate-400" />
            </div>
          ) : token ? (
            !validation?.valid ? (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{validation?.message || "This reset link is not valid."}</AlertDescription>
              </Alert>
            ) : (
              <form onSubmit={handleCompleteReset} className="space-y-5">
                <div className="grid gap-4 rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-600 sm:grid-cols-2">
                  <div>
                    <p className="text-xs uppercase tracking-wide text-slate-400">Email</p>
                    <p className="font-medium text-slate-800">{validation.email}</p>
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-wide text-slate-400">Account Type</p>
                    <p className="font-medium capitalize text-slate-800">{(validation.role || "").replace("_", " ")}</p>
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="grid gap-2">
                    <Label htmlFor="password">New Password</Label>
                    <Input id="password" type="password" value={password} onChange={(event) => setPassword(event.target.value)} placeholder="Create a new password" />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="confirm-password">Confirm Password</Label>
                    <Input id="confirm-password" type="password" value={confirmPassword} onChange={(event) => setConfirmPassword(event.target.value)} placeholder="Repeat your new password" />
                  </div>
                </div>

                <Button type="submit" disabled={submitting} className="h-11 w-full bg-gradient-to-r from-teal-500 to-cyan-600 text-white hover:from-teal-600 hover:to-cyan-700">
                  {submitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                  Reset Password
                </Button>
              </form>
            )
          ) : (
            <form onSubmit={handleRequestReset} className="space-y-5">
              <div className="grid gap-2">
                <Label htmlFor="email">Account Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="user@hydranet.go.tz"
                  autoComplete="email"
                />
              </div>

              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  If the account has not finished onboarding yet, the user should use the original invitation email instead of password reset.
                </AlertDescription>
              </Alert>

              <Button type="submit" disabled={submitting} className="h-11 w-full bg-gradient-to-r from-teal-500 to-cyan-600 text-white hover:from-teal-600 hover:to-cyan-700">
                {submitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                Send Reset Link
              </Button>
            </form>
          )}

          <div className="mt-6 text-center text-sm text-slate-500">
            <Link href="/login" className="font-medium text-cyan-700 hover:text-cyan-800">
              Back to sign in
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
