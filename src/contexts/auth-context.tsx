
"use client"

import type { ReactNode } from "react"
import React, { createContext, useContext, useEffect, useState } from "react"
import type { User } from "firebase/auth"
import {
  onAuthStateChanged,
  signOut as firebaseSignOut,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
} from "firebase/auth"
import { auth, db, isDemoMode } from "@/lib/firebase.client"
import { doc, getDoc, serverTimestamp, setDoc } from "firebase/firestore"
import { useToast } from "@/hooks/use-toast"
import { slugify } from "@/lib/utils"

interface AuthContextType {
  user: User | null
  loading: boolean
  signInWithEmail: (email: string, password: string) => Promise<void>
  signUpWithEmail: (
    name: string,
    email: string,
    password: string
  ) => Promise<void>
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

const demoUser = {
  uid: "demo-user",
  email: "demo@example.com",
  displayName: "Demo User",
  photoURL: `https://avatar.vercel.sh/${slugify("Demo User")}.png?size=96`,
} as User

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    if (isDemoMode) {
      setLoading(false)
      return
    }

    const unsubscribe = onAuthStateChanged(
      auth,
      async (user) => {
        if (user) {
          setUser(user)
          const userRef = doc(db, "users", user.uid)
          const userSnap = await getDoc(userRef)
          if (!userSnap.exists()) {
            await setDoc(userRef, {
              uid: user.uid,
              name: user.displayName,
              email: user.email,
              college: "",
              branch: "",
              savedCompanies: [],
              createdAt: serverTimestamp(),
            })
          }
        } else {
          setUser(null)
        }
        setLoading(false)
      },
      (error) => {
        console.error("Firebase auth error:", error)
        toast({
          variant: "destructive",
          title: "Authentication Error",
          description:
            "Could not connect to Firebase. Please check your configuration and console for details.",
        })
        setLoading(false)
      }
    )

    return () => unsubscribe()
  }, [toast])

  const signInWithEmail = async (email: string, password: string) => {
    if (isDemoMode) {
      if (email.toLowerCase() === "demo@example.com") {
        setLoading(true)
        setTimeout(() => {
          setUser(demoUser)
          setLoading(false)
          toast({
            title: "Welcome to Demo Mode!",
            description: "You are now logged in as a demo user.",
          })
        }, 500)
        return
      } else {
        toast({
          variant: "destructive",
          title: "Invalid Demo Credentials",
          description: `Please use "demo@example.com" to log in while in demo mode.`,
        })
        throw new Error("Invalid demo credentials")
      }
    }

    try {
      await signInWithEmailAndPassword(auth, email, password)
    } catch (error: any) {
      let description = "An unknown error occurred. Please try again."
      if (
        error.code === "auth/user-not-found" ||
        error.code === "auth/wrong-password" ||
        error.code === "auth/invalid-credential"
      ) {
        description = "Invalid email or password. Please try again."
      } else if (error.code === "auth/invalid-api-key") {
        description =
          "Your Firebase API key appears to be invalid. Please check your configuration in `src/lib/firebase.client.ts`."
      }
      toast({
        variant: "destructive",
        title: "Sign In Failed",
        description,
      })
      throw error
    }
  }

  const signUpWithEmail = async (
    name: string,
    email: string,
    password: string
  ) => {
    if (isDemoMode) {
      toast({
        title: "Demo Mode",
        description: "Account creation is disabled in demo mode.",
      })
      return
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      )
      const user = userCredential.user

      // Update profile and local state
      await updateProfile(user, { displayName: name })
      setUser((prevUser) => (prevUser ? { ...prevUser, ...user } : user))

      // Create user document in Firestore
      const userRef = doc(db, "users", user.uid)
      await setDoc(userRef, {
        uid: user.uid,
        name: name,
        email: user.email,
        college: "",
        branch: "",
        savedCompanies: [],
        createdAt: serverTimestamp(),
      })
    } catch (error: any) {
      let description = "An unknown error occurred. Please try again."
      if (error.code === "auth/email-already-in-use") {
        description = "This email is already registered. Please sign in."
      } else if (error.code === "auth/weak-password") {
        description = "Password should be at least 6 characters."
      }
      toast({
        variant: "destructive",
        title: "Sign Up Failed",
        description,
      })
      throw error
    }
  }

  const signOut = async () => {
    if (isDemoMode) {
      setLoading(true)
      setTimeout(() => {
        setUser(null)
        setLoading(false)
        toast({
          title: "Signed Out",
          description: "You have been signed out of demo mode.",
        })
      }, 500)
      return
    }
    try {
      await firebaseSignOut(auth)
    } catch (error) {
      console.error("Error signing out: ", error)
      toast({
        variant: "destructive",
        title: "Sign Out Error",
        description: "Could not sign you out. Please try again.",
      })
    }
  }

  const value = { user, loading, signInWithEmail, signUpWithEmail, signOut }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
