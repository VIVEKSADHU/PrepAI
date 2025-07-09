
"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Building2, Loader2, AlertTriangle } from "lucide-react"
import { isDemoMode } from "@/lib/firebase.client"
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert"

export default function SignupPage() {
  const { user, loading, signUpWithEmail } = useAuth()
  const router = useRouter()
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    if (!loading && user) {
      router.push("/")
    }
  }, [user, loading, router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setIsSubmitting(true)
    try {
      await signUpWithEmail(name, email, password)
      // Successful signup will trigger the useEffect above to redirect.
    } catch (err: any) {
      setError(
        err.message || "An unexpected error occurred. Please try again."
      )
      setIsSubmitting(false)
    }
  }

  if (loading || (!loading && user)) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  return (
    <Card className="w-full max-w-sm">
      <CardHeader className="text-center">
        <div className="mx-auto mb-4 flex items-center justify-center gap-2 text-primary">
          <Building2 className="h-8 w-8" />
          <span className="text-2xl font-bold">PrepAI</span>
        </div>
        <CardTitle className="text-2xl font-bold">Create an Account</CardTitle>
        <CardDescription>
          Enter your details below to get started.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {isDemoMode && (
          <Alert>
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Demo Mode is Active</AlertTitle>
            <AlertDescription>
              Account creation is disabled. Please use the login page to
              continue as a demo user.
            </AlertDescription>
          </Alert>
        )}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Full Name</Label>
            <Input
              id="name"
              placeholder="John Doe"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              disabled={isDemoMode}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="name@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={isDemoMode}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={isDemoMode}
            />
          </div>
          <Button
            type="submit"
            disabled={isSubmitting || isDemoMode}
            className="w-full"
          >
            {isSubmitting ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              "Sign Up"
            )}
          </Button>
        </form>
      </CardContent>
      <CardFooter>
        <p className="w-full text-center text-sm text-muted-foreground">
          Already have an account?{" "}
          <Link
            href="/login"
            className="font-medium text-primary hover:underline"
          >
            Sign In
          </Link>
        </p>
      </CardFooter>
    </Card>
  )
}
