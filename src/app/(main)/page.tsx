import { CompanyCard } from "@/components/company-card"

const companies = [
  {
    name: "Google",
    logoUrl: "https://placehold.co/96x96.png",
    aiHint: "tech company",
    experienceCount: 42,
    avgCgpa: 9.1,
  },
  {
    name: "TCS",
    logoUrl: "https://placehold.co/96x96.png",
    aiHint: "IT services",
    experienceCount: 128,
    avgCgpa: 7.8,
  },
  {
    name: "JP Morgan Chase",
    logoUrl: "https://placehold.co/96x96.png",
    aiHint: "investment banking",
    experienceCount: 67,
    avgCgpa: 8.5,
  },
  {
    name: "Microsoft",
    logoUrl: "https://placehold.co/96x96.png",
    aiHint: "software corporation",
    experienceCount: 55,
    avgCgpa: 9.0,
  },
  {
    name: "Infosys",
    logoUrl: "https://placehold.co/96x96.png",
    aiHint: "consulting outsourcing",
    experienceCount: 210,
    avgCgpa: 7.5,
  },
  {
    name: "Amazon",
    logoUrl: "https://placehold.co/96x96.png",
    aiHint: "ecommerce cloud",
    experienceCount: 88,
    avgCgpa: 8.8,
  },
]

export default function DashboardPage() {
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
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {companies.map((company) => (
          <CompanyCard key={company.name} {...company} />
        ))}
      </div>
    </div>
  )
}
