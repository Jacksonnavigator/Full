"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useAuthStore } from "@/store/auth-store"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"
import { Eye, EyeOff, Loader2, AlertCircle } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"

const ROLE_PRESETS = [
  {
    label: "Admin",
    email: "admin@hydranet.com",
    password: "admin123",
    description: "System Administrator"
  },
  {
    label: "Utility Mgr",
    email: "manager@utility.com",
    password: "manager123",
    description: "Utility Manager"
  },
  {
    label: "DMA Mgr",
    email: "dma.manager@utility.com",
    password: "dmamanager123",
    description: "DMA Manager"
  },
]

export default function LoginPage() {
  const router = useRouter()
  const { login, isLoading, error, clearError } = useAuthStore()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [selectedPreset, setSelectedPreset] = useState<number | null>(null)

  const handlePresetSelect = (index: number) => {
    const preset = ROLE_PRESETS[index]
    setEmail(preset.email)
    setPassword(preset.password)
    setSelectedPreset(index)
    clearError?.()
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    clearError?.()

    if (!email || !password) {
      toast.error("Please enter email and password")
      return
    }

    try {
      const success = await login(email, password)
      if (success) {
        toast.success("Karibu HydraNet!")
        router.push("/dashboard")
      }
    } catch (err) {
      // Error is handled by the store
    }
  }

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-gradient-to-br from-blue-950 via-blue-900 to-blue-800">
      {/* Background decoration */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/4 top-1/4 h-96 w-96 rounded-full bg-blue-500/10 blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 h-96 w-96 rounded-full bg-cyan-500/10 blur-3xl" />
        <div className="absolute left-1/2 top-1/2 h-64 w-64 -translate-x-1/2 -translate-y-1/2 rounded-full bg-blue-400/5 blur-2xl" />
      </div>

      {/* Grid overlay */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.1) 1px, transparent 1px)",
          backgroundSize: "64px 64px",
        }}
      />

      <div className="relative z-10 w-full max-w-md px-4" style={{ marginTop: "70px" }}>
        {/* Logo */}
        <div className="mb-8 flex flex-col items-center text-center">
          <div className="mb-6 flex h-24 w-24 items-center justify-center rounded-3xl bg-white/5 shadow-xl backdrop-blur-lg">
            <img 
              src="/logo1.png" 
              alt="HydraNet Logo" 
              className="h-full w-full object-contain rounded-3xl"
            />
          </div>

          <h1 className="text-3xl font-bold tracking-tight text-white">
            HydraNet
          </h1>
          <p className="mt-1 text-sm text-blue-200/70">
            Water Infrastructure Management System - Tanzania
          </p>
        </div>

        {/* Login card */}
        <div className="glass-card rounded-2xl p-8 shadow-2xl">
          <div className="mb-6">
            <h2 className="text-lg font-semibold text-foreground">
              Sign in to your account
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Enter your credentials to access the dashboard
            </p>
          </div>

          {/* Error Alert */}
          {error && (
            <Alert variant="destructive" className="mb-6">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {/* Role quick-selector */}
          <div className="mb-6">
            <Label className="mb-2 block text-xs font-medium text-muted-foreground uppercase tracking-wider">
              Quick Access (Demo)
            </Label>
            <div className="grid grid-cols-3 gap-2">
              {ROLE_PRESETS.map((preset, i) => (
                <button
                  key={preset.label}
                  type="button"
                  onClick={() => handlePresetSelect(i)}
                  className={cn(
                    "flex flex-col items-center gap-0.5 rounded-lg border p-3 text-center transition-all duration-200 hover:bg-primary/5",
                    selectedPreset === i
                      ? "border-primary bg-primary/5 shadow-sm"
                      : "border-border"
                  )}
                >
                  <span className="text-xs font-medium leading-tight">
                    {preset.label}
                  </span>
                  <span className="text-[10px] text-muted-foreground leading-tight">
                    {preset.description}
                  </span>
                </button>
              ))}
            </div>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <Label htmlFor="email">Email address</Label>
              <Input
                id="email"
                type="email"
                placeholder="user@hydranet.go.tz"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value)
                  setSelectedPreset(null)
                  clearError?.()
                }}
                className="h-10"
                autoComplete="email"
              />
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value)
                    setSelectedPreset(null)
                    clearError?.()
                  }}
                  className="h-10 pr-10"
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>

            <Button
              type="submit"
              className="mt-2 h-11 w-full text-sm font-semibold"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Signing in...
                </>
              ) : (
                "Sign In"
              )}
            </Button>
          </form>

        </div>

        {/* Footer */}
        <p className="mt-6 text-center text-xs text-blue-200/40">
          HydraNet &middot; Water Infrastructure Management - Tanzania
        </p>
      </div>
    </div>
  )
}

function cn(...classes: (string | boolean | undefined)[]) {
  return classes.filter(Boolean).join(" ")
}
