"use client"

import { useEffect, useState } from "react"
import { collection, onSnapshot, orderBy, query } from "firebase/firestore"
import { CompanyCard } from "@/components/company-card"
import { Skeleton } from "@/components/ui/skeleton"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { db, isDemoMode } from "@/lib/firebase.client"
import { Terminal } from "lucide-react"
import { slugify } from "@/lib/utils"

type CompanyData = {
  id: string
  name: string
  logoURL: string
  numExperiences: number
  avgCGPA: number
  aiHint?: string
}

const mockCompanies: CompanyData[] = [
    { id: "1", name: "Innovate Inc.", logoURL: `https://avatar.vercel.sh/${slugify("Innovate Inc.")}.png?size=96`, numExperiences: 42, avgCGPA: 8.7, aiHint: "office building" },
    { id: "2", name: "QuantumLeap", logoURL: `https://avatar.vercel.sh/${slugify("QuantumLeap")}.png?size=96`, numExperiences: 15, avgCGPA: 9.1, aiHint: "tech startup" },
    { id: "3", name: "DataWeavers", logoURL: `https://avatar.vercel.sh/${slugify("DataWeavers")}.png?size=96`, numExperiences: 28, avgCGPA: 8.2, aiHint: "data center" },
    { id: "4", name: "Synergy Corp", logoURL: `https://avatar.vercel.sh/${slugify("Synergy Corp")}.png?size=96`, numExperiences: 50, avgCGPA: 8.5, aiHint: "corporate building" },
]

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
    if (isDemoMode) {
      setCompanies(mockCompanies);
      setLoading(false);
      return;
    }
    
    if (!db) {
      setLoading(false);
      setCompanies([]);
      return;
    }

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
          avgCGPA: doc.data().avgCGPA || 0,
          aiHint: doc.data().aiHint || "company building",
        }))
        setCompanies(companiesData)
      }
      setLoading(false)
    }, (error) => {
      console.error("Error fetching companies in real-time:", error)
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

      {isDemoMode && (
          <Alert>
              <Terminal className="h-4 w-4" />
              <AlertTitle>Demo Mode</AlertTitle>
              <AlertDescription>
                This is a demo. Company data is mocked. Please configure your Firebase credentials in 
                <code className="relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm font-semibold mx-1">
                  src/lib/firebase.client.ts
                </code> 
                to connect to your own database.
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
      ) : (
        <div className="flex items-center justify-center h-64 rounded-lg border border-dashed">
          <div className="text-center">
            <h3 className="text-lg font-semibold">No companies found</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              {isDemoMode 
                ? "This is where your company data will appear."
                : "Could not load company data or no experiences have been submitted yet."
              }
            </p>
          </div>
        </div>
      )}
    </div>
  )
}
