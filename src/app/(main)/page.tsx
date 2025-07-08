import { CompanyCard } from "@/components/company-card"
import { db, isFirebaseEnabled } from "@/lib/firebase"
import { collection, getDocs, orderBy, query } from "firebase/firestore"
import type { Metadata } from "next"
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert"
import { AlertTriangle } from "lucide-react"

export const metadata: Metadata = {
  title: "Dashboard | PrepAI",
}

type CompanyData = {
  id: string
  name: string
  logoURL: string
  numExperiences: number
  avgCGPA: number
}

async function getCompanies(): Promise<CompanyData[]> {
  if (!isFirebaseEnabled || !db) {
    // Return mock data if Firebase is not configured
    return [
      { id: '1', name: 'Demo Company A', logoURL: 'https://placehold.co/96x96.png', numExperiences: 10, avgCGPA: 8.5, aiHint: "office building" },
      { id: '2', name: 'Demo Company B', logoURL: 'https://placehold.co/96x96.png', numExperiences: 5, avgCGPA: 7.9, aiHint: "tech office" },
      { id: '3', name: 'Demo Company C', logoURL: 'https://placehold.co/96x96.png', numExperiences: 12, avgCGPA: 9.1, aiHint: "software company" },
    ]
  }

  const companiesRef = collection(db, "companies")
  const q = query(companiesRef, orderBy("name", "asc"))
  const querySnapshot = await getDocs(q)
  
  if (querySnapshot.empty) {
    return []
  }

  return querySnapshot.docs.map(doc => ({
    id: doc.id,
    name: doc.data().name,
    logoURL: doc.data().logoURL || "https://placehold.co/96x96.png",
    numExperiences: doc.data().numExperiences || 0,
    avgCGPA: doc.data().avgCGPA || 0,
  }))
}

export default async function DashboardPage() {
  const companies = await getCompanies()

  return (
    <div className="flex flex-col gap-6">
       {!isFirebaseEnabled && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Firebase Not Configured</AlertTitle>
          <AlertDescription>
            The application is running in offline mode. Please add your Firebase configuration to the .env file to connect to the database. Displaying sample data.
          </AlertDescription>
        </Alert>
      )}
      <div>
        <h1 className="text-3xl font-bold tracking-tight font-headline">
          Company Dashboard
        </h1>
        <p className="text-muted-foreground">
          Explore student experiences from various companies.
        </p>
      </div>
      {companies.length > 0 ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {companies.map((company) => (
            <CompanyCard
              key={company.id}
              name={company.name}
              logoUrl={company.logoURL}
              experienceCount={company.numExperiences}
              avgCgpa={company.avgCGPA}
            />
          ))}
        </div>
      ) : (
        <div className="flex items-center justify-center h-64 rounded-lg border border-dashed">
          <div className="text-center">
            <h3 className="text-lg font-semibold">No companies found</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Submit an experience to get started.
            </p>
          </div>
        </div>
      )}
    </div>
  )
}
