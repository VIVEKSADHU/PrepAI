
"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { collection, onSnapshot, orderBy, query } from "firebase/firestore"
import { CompanyCard } from "@/components/company-card"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { db } from "@/lib/firebase.client"
import { Terminal, PenSquare } from "lucide-react"
import { slugify } from "@/lib/utils"

type CompanyData = {
  id: string
  name: string
  logoURL: string
  numExperiences: number
  avgCGPA: number
  aiHint?: string
}

function DashboardSkeleton() {
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {Array.from({ length: 8 }).map((_, i) => (
        <Skeleton key={i} className="h-56 w-full" />
      ))}
    </div>
  )
}

export default function DashboardPage() {
  const [companies, setCompanies] = useState<CompanyData[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const companiesRef = collection(db, "companies")
    const q = query(companiesRef, orderBy("name", "asc"))

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      if (querySnapshot.empty) {
        setCompanies([])
      } else {
        const companiesData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          name: doc.data().name,
          logoURL: doc.data().logoURL || `https://avatar.vercel.sh/${slugify(doc.data().name)}.png?size=96`,
          numExperiences: doc.data().numExperiences || 0,
          avgCGPA: doc.data().avgCgpa || 0,
          aiHint: doc.data().aiHint || "company building",
        }))
        setCompanies(companiesData)
      }
      setError(null);
      setLoading(false)
    }, (error) => {
      console.error("Error fetching companies in real-time:", error)
      setError("Could not fetch company data. Please check your Firebase configuration and security rules.");
      setCompanies([])
      setLoading(false)
    });
    
    return () => unsubscribe();
  }, [])

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight font-headline">
          Company Dashboard
        </h1>
        <p className="text-muted-foreground">
          Explore student experiences from various companies.
        </p>
      </div>

       {error && (
          <Alert variant="destructive">
              <Terminal className="h-4 w-4" />
              <AlertTitle>Database Error</AlertTitle>
              <AlertDescription>
                {error}
              </AlertDescription>
          </Alert>
      )}

      {loading ? (
        <DashboardSkeleton />
      ) : companies.length > 0 ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {companies.map((company) => (
            <CompanyCard
              key={company.id}
              name={company.name}
              logoUrl={company.logoURL}
              experienceCount={company.numExperiences}
              avgCgpa={company.avgCGPA}
              aiHint={company.aiHint}
            />
          ))}
        </div>
      ) : !error ? (
        <div className="flex flex-col items-center justify-center h-64 rounded-lg border border-dashed">
          <div className="text-center">
            <PenSquare className="mx-auto h-12 w-12 text-muted-foreground" />
            <h3 className="mt-4 text-lg font-semibold">No experiences yet</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Be the first to help the community.
            </p>
            <Button asChild className="mt-4">
              <Link href="/submit-experience">Share Your Experience</Link>
            </Button>
          </div>
        </div>
      ) : null}
    </div>
  )
}
