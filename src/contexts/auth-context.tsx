"use client"

import type { ReactNode } from "react"
import React, { createContext, useContext, useEffect, useState } from "react"
import type { User } from "firebase/auth"
import { onAuthStateChanged, signInWithRedirect, signOut as firebaseSignOut } from "firebase/auth"
import { auth, db, googleProvider, isDemoMode } from "@/lib/firebase.client"
import { doc, getDoc, serverTimestamp, setDoc } from "firebase/firestore"
import { useToast } from "@/hooks/use-toast"

// Create a mock user for demo mode
const demoUser = {
    uid: "demo-user-uid",
    email: "demo@example.com",
    displayName: "Demo User",
    photoURL: "https://avatar.vercel.sh/demo-user.png?size=96",
} as User;

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
    if (isDemoMode) {
        setUser(demoUser);
        setLoading(false);
        return;
    }

    // This check is important to prevent errors if auth is null
    if (!auth) {
        setLoading(false);
        return;
    }

    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setUser(user)
        // This check is important to prevent errors if db is null
        if(db) {
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
        }
      } else {
        setUser(null)
      }
      setLoading(false)
    })

    return () => unsubscribe()
  }, [])

  const signInWithGoogle = async () => {
    if (isDemoMode || !auth || !googleProvider) {
        toast({
            variant: "destructive",
            title: "Demo Mode",
            description: "Sign-in is disabled. Please configure Firebase to enable authentication.",
        });
        return;
    }
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
    if (isDemoMode || !auth) {
      // In demo mode, we just clear the user state to simulate logout
      setUser(null);
      toast({
          title: "Signed Out",
          description: "You have been signed out of Demo Mode.",
      });
      return;
    }
    try {
      await firebaseSignOut(auth)
    } catch (error) {
      console.error("Error signing out: ", error)
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
