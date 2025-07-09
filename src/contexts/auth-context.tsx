"use client"

import type { ReactNode } from "react"
import React, { createContext, useContext, useEffect, useState } from "react"
import type { User } from "firebase/auth"
import { onAuthStateChanged, signInWithRedirect, signOut as firebaseSignOut } from "firebase/auth"
import { auth, db, googleProvider } from "@/lib/firebase.client"
import { doc, getDoc, serverTimestamp, setDoc } from "firebase/firestore"
import { useToast } from "@/hooks/use-toast"

interface AuthContextType {
  user: User | null
  loading: boolean
  signInWithGoogle: () => Promise<void>
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setUser(user)
        const userRef = doc(db, "users", user.uid);
        const userSnap = await getDoc(userRef);
        if (!userSnap.exists()) {
          await setDoc(userRef, {
            uid: user.uid,
            name: user.displayName,
            email: user.email,
            college: "",
            branch: "",
            savedCompanies: [],
            createdAt: serverTimestamp(),
          });
        }
      } else {
        setUser(null)
      }
      setLoading(false)
    }, (error) => {
        console.error("Firebase auth error:", error);
        // If there is an auth error (e.g. invalid API key), stop loading
        setLoading(false);
    });

    return () => unsubscribe()
  }, [])

  const signInWithGoogle = async () => {
    try {
      await signInWithRedirect(auth, googleProvider)
    } catch (error) {
      console.error("Error signing in with Google: ", error)
      toast({
        variant: "destructive",
        title: "Sign In Error",
        description: "Could not sign in with Google. Check console for details.",
      });
    }
  }

  const signOut = async () => {
    try {
      await firebaseSignOut(auth)
    } catch (error) {
      console.error("Error signing out: ", error)
      toast({
        variant: "destructive",
        title: "Sign Out Error",
        description: "Could not sign you out. Please try again.",
      });
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
