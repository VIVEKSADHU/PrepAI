"use client"

import type { ReactNode } from "react"
import React, { createContext, useContext, useEffect, useState } from "react"
import type { User } from "firebase/auth"
import { onAuthStateChanged, signInWithRedirect, signOut as firebaseSignOut } from "firebase/auth"
import { auth, db, googleProvider, isDemoMode } from "@/lib/firebase.client"
import { doc, getDoc, serverTimestamp, setDoc } from "firebase/firestore"
import { useToast } from "@/hooks/use-toast"
import { slugify } from "@/lib/utils"

interface AuthContextType {
  user: User | null
  loading: boolean
  signInWithGoogle: () => Promise<void>
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
      setUser(demoUser)
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
            description: "Could not connect to Firebase. Please check your configuration and console for details.",
        });
        setLoading(false)
      }
    )

    return () => unsubscribe()
  }, [toast])

  const signInWithGoogle = async () => {
    if (isDemoMode) {
      setUser(demoUser);
      toast({
        title: "Welcome to Demo Mode!",
        description: "You are now logged in as a demo user.",
      })
      return
    }
    try {
      await signInWithRedirect(auth, googleProvider)
    } catch (error) {
      console.error("Error signing in with Google: ", error)
      toast({
        variant: "destructive",
        title: "Sign In Error",
        description:
          "Could not sign in with Google. Check console for details.",
      })
    }
  }

  const signOut = async () => {
    if (isDemoMode) {
      setUser(null);
       toast({
        title: "Signed Out",
        description: "You have been signed out of demo mode.",
      })
      return;
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

  const value = { user, loading, signInWithGoogle, signOut }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}