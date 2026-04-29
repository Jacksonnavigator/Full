"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuthStore } from "@/store/auth-store"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"
import { Eye, EyeOff, Loader2, AlertCircle, Shield, Activity, Droplets } from "lucide-react"
import Image from "next/image"
import { Alert, AlertDescription } from "@/components/ui/alert"

// Background images for the slideshow
const BACKGROUND_IMAGES = [
  "https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?q=80&w=2574&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?q=80&w=2574&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1501854140801-50d01698950b?q=80&w=2600&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1433086966358-54859d0ed716?q=80&w=2574&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1475924156734-496f6cac6ec1?q=80&w=2574&auto=format&fit=crop",
]

const ROLE_PRESETS = [
  {
    label: "Admin",
    email: "admin@majiscope.com",
    password: "admin123",
    description: "System Administrator",
    icon: Shield,
  },
  {
    label: "Utility Mgr",
    email: "manager@dawasa.go.tz",
    password: "utility123",
    description: "DAWASA Manager",
    icon: Activity,
  },
  {
    label: "DMA Mgr",
    email: "ilala@dawasa.go.tz",
    password: "dma123",
    description: "Ilala DMA Manager",
    icon: Droplets,
  },
]

export default function LoginPage() {
  const router = useRouter()
  const { login, isLoading, error, clearError } = useAuthStore()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [selectedPreset, setSelectedPreset] = useState<number | null>(null)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [isTransitioning, setIsTransitioning] = useState(false)

  // Dynamic background slideshow
  useEffect(() => {
    const interval = setInterval(() => {
      setIsTransitioning(true)
      setTimeout(() => {
        setCurrentImageIndex((prev) => (prev + 1) % BACKGROUND_IMAGES.length)
        setIsTransitioning(false)
      }, 1000)
    }, 6000)

    return () => clearInterval(interval)
  }, [])

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
        toast.success("Karibu MajiScope!")
        router.push("/dashboard")
      }
    } catch (err) {
      // Error is handled by the store
    }
  }

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-black">
      {/* Dynamic Background Images */}
      {BACKGROUND_IMAGES.map((img, index) => (
        <div
          key={img}
          className={cn(
            "absolute inset-0 bg-cover bg-center bg-no-repeat transition-opacity duration-1000",
            index === currentImageIndex && !isTransitioning ? "opacity-100" : "opacity-0"
          )}
          style={{ backgroundImage: `url(${img})` }}
        />
      ))}

      {/* Dark Overlay with gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-black/80 via-black/70 to-black/80" />
      
      {/* Animated gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-cyan-950/50 via-transparent to-blue-950/30" />

      {/* Subtle animated particles/dots */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -left-4 top-1/4 h-72 w-72 animate-pulse rounded-full bg-cyan-500/10 blur-3xl" />
        <div className="absolute -right-4 bottom-1/4 h-72 w-72 animate-pulse rounded-full bg-blue-500/10 blur-3xl" style={{ animationDelay: "1s" }} />
        <div className="absolute left-1/2 top-1/2 h-96 w-96 -translate-x-1/2 -translate-y-1/2 animate-pulse rounded-full bg-teal-500/5 blur-3xl" style={{ animationDelay: "2s" }} />
      </div>

      {/* Grid pattern overlay */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.02]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.1) 1px, transparent 1px)",
          backgroundSize: "50px 50px",
        }}
      />

      {/* Main Content */}
      <div className="relative z-10 w-full max-w-md px-6 py-12">
        {/* Logo and Brand */}
        <div className="mb-10 flex flex-col items-center text-center">
          {/* Original Logo */}
          <div className="relative mb-6">
            <div className="absolute inset-0 animate-ping rounded-full bg-cyan-400/20" style={{ animationDuration: "3s" }} />
            <div className="relative flex h-32 w-32 items-center justify-center overflow-hidden rounded-3xl bg-white/10 shadow-2xl shadow-cyan-500/30 backdrop-blur-sm">
              <Image
                src="/logo1.png"
                alt="MajiScope Logo"
                width={96}
                height={96}
                className="object-contain rounded-3xl"
                priority
              />
            </div>
          </div>

          {/* Stylized MajiScope Brand Name */}
          <h1 className="relative mb-2">
            <span className="block text-5xl font-black tracking-tight">
              <span className="bg-gradient-to-r from-cyan-300 via-blue-400 to-teal-300 bg-clip-text text-transparent drop-shadow-lg">
                Maji
              </span>
              <span className="bg-gradient-to-r from-white via-cyan-100 to-white bg-clip-text text-transparent">
                Scope
              </span>
            </span>
            {/* Decorative underline */}
            <span className="absolute -bottom-1 left-1/2 h-1 w-24 -translate-x-1/2 rounded-full bg-gradient-to-r from-transparent via-cyan-400 to-transparent" />
          </h1>

          {/* Tagline */}
          <p className="mt-4 text-sm font-medium tracking-widest text-cyan-200/70 uppercase">
            Water Infrastructure Intelligence
          </p>
          <p className="mt-1 text-xs text-white/40">
            Tanzania Water Management System
          </p>
        </div>

        {/* Login Card with Glassmorphism */}
        <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 p-8 shadow-2xl backdrop-blur-xl">
          {/* Card shine effect */}
          <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-transparent" />
          
          <div className="relative">
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-white">
                Welcome back
              </h2>
              <p className="mt-1 text-sm text-white/50">
                Sign in to access your dashboard
              </p>
            </div>

            {/* Error Alert */}
            {error && (
              <Alert variant="destructive" className="mb-6 border-red-500/30 bg-red-500/10">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription className="text-red-200">{error}</AlertDescription>
              </Alert>
            )}

            {/* Role Quick Selector */}
            <div className="mb-6">
              <Label className="mb-3 block text-xs font-medium uppercase tracking-wider text-cyan-300/70">
                Quick Access
              </Label>
              <div className="grid grid-cols-3 gap-2">
                {ROLE_PRESETS.map((preset, i) => {
                  const Icon = preset.icon
                  return (
                    <button
                      key={preset.label}
                      type="button"
                      onClick={() => handlePresetSelect(i)}
                      className={cn(
                        "group flex flex-col items-center gap-2 rounded-xl border p-3 text-center transition-all duration-300",
                        selectedPreset === i
                          ? "border-cyan-400/50 bg-cyan-400/10 shadow-lg shadow-cyan-500/10"
                          : "border-white/10 bg-white/5 hover:border-cyan-400/30 hover:bg-white/10"
                      )}
                    >
                      <Icon className={cn(
                        "h-5 w-5 transition-colors",
                        selectedPreset === i ? "text-cyan-400" : "text-white/50 group-hover:text-cyan-300"
                      )} />
                      <span className={cn(
                        "text-xs font-medium",
                        selectedPreset === i ? "text-cyan-300" : "text-white/70"
                      )}>
                        {preset.label}
                      </span>
                      <span className="text-[10px] text-white/40 leading-tight">
                        {preset.description}
                      </span>
                    </button>
                  )
                })}
              </div>
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col gap-5">
              <div className="flex flex-col gap-2">
                <Label htmlFor="email" className="text-sm font-medium text-white/70">
                  Email address
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="user@majiscope.go.tz"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value)
                    setSelectedPreset(null)
                    clearError?.()
                  }}
                  className="h-12 rounded-xl border-white/10 bg-white/5 text-white placeholder:text-white/30 focus:border-cyan-400/50 focus:ring-cyan-400/20"
                  autoComplete="email"
                />
              </div>

              <div className="flex flex-col gap-2">
                <Label htmlFor="password" className="text-sm font-medium text-white/70">
                  Password
                </Label>
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
                    className="h-12 rounded-xl border-white/10 bg-white/5 pr-12 text-white placeholder:text-white/30 focus:border-cyan-400/50 focus:ring-cyan-400/20"
                    autoComplete="current-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-white/40 transition-colors hover:text-white/70"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}
                  </button>
                </div>
              </div>

              <Button
                type="submit"
                className="mt-2 h-12 w-full rounded-xl bg-gradient-to-r from-cyan-500 via-blue-500 to-teal-500 text-sm font-semibold text-white shadow-lg shadow-cyan-500/25 transition-all duration-300 hover:shadow-cyan-500/40 hover:brightness-110 disabled:opacity-50"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Signing in...
                  </>
                ) : (
                  "Sign In"
                )}
              </Button>
            </form>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 text-center">
          <p className="text-xs text-white/30">
            MajiScope &middot; Water Infrastructure Intelligence &middot; Tanzania
          </p>
          <div className="mt-3 flex items-center justify-center gap-1">
            {BACKGROUND_IMAGES.map((_, index) => (
              <button
                key={index}
                onClick={() => {
                  setIsTransitioning(true)
                  setTimeout(() => {
                    setCurrentImageIndex(index)
                    setIsTransitioning(false)
                  }, 500)
                }}
                className={cn(
                  "h-1.5 rounded-full transition-all duration-300",
                  index === currentImageIndex
                    ? "w-6 bg-cyan-400"
                    : "w-1.5 bg-white/30 hover:bg-white/50"
                )}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

function cn(...classes: (string | boolean | undefined)[]) {
  return classes.filter(Boolean).join(" ")
}
