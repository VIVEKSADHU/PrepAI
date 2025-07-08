"use client"

import { useEffect, useState } from "react"
import { collection, getDocs, orderBy, query } from "firebase/firestore"
import { CompanyCard } from "@/components/company-card"
import { Skeleton } from "@/components/ui/skeleton"
import { db } from "@/lib/firebase.client"

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

  useEffect(() => {
    async function getCompanies(): Promise<void> {
      try {
        const companiesRef = collection(db, "companies")
        const q = query(companiesRef, orderBy("name", "asc"))
        const querySnapshot = await getDocs(q)

        if (querySnapshot.empty) {
          setCompanies([])
          return
        }

        const companiesData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          name: doc.data().name,
          logoURL: doc.data().logoURL || "https://placehold.co/96x96.png",
          numExperiences: doc.data().numExperiences || 0,
          avgCGPA: doc.data().avgCGPA || 0,
          aiHint: doc.data().aiHint || "company building",
        }))
        setCompanies(companiesData)
      } catch (error) {
        console.error("Error fetching companies:", error)
        // In case of error (e.g., permissions), we'll show no companies.
        setCompanies([])
      } finally {
        setLoading(false)
      }
    }

    getCompanies()
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
      ) : (
        <div className="flex items-center justify-center h-64 rounded-lg border border-dashed">
          <div className="text-center">
            <h3 className="text-lg font-semibold">No companies found</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Could not load company data or no experiences have been submitted yet.
            </p>
          </div>
        </div>
      )}
    </div>
  )
}
