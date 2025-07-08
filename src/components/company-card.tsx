import Image from "next/image"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"

type CompanyCardProps = {
  name: string;
  logoUrl: string;
  experienceCount: number;
  avgCgpa: number;
  aiHint?: string;
};

export function CompanyCard({
  name,
  logoUrl,
  experienceCount,
  avgCgpa,
  aiHint,
}: CompanyCardProps) {
  return (
    <Card className="flex flex-col transition-all hover:shadow-lg hover:-translate-y-1">
      <CardHeader className="flex flex-row items-start gap-4">
        <Image
          src={logoUrl}
          alt={`${name} logo`}
          width={48}
          height={48}
          className="rounded-lg object-contain"
          data-ai-hint={aiHint}
        />
        <div>
          <CardTitle className="font-headline text-xl">{name}</CardTitle>
          <CardDescription>Placement Experiences</CardDescription>
        </div>
      </CardHeader>
      <CardContent className="flex-grow">
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="flex flex-col space-y-1">
            <span className="text-muted-foreground">Experiences</span>
            <span className="font-semibold">{experienceCount}</span>
          </div>
          <div className="flex flex-col space-y-1">
            <span className="text-muted-foreground">Avg. CGPA</span>
            <span className="font-semibold">{avgCgpa.toFixed(1)}</span>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button variant="outline" className="w-full">
          View Submissions <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </CardFooter>
    </Card>
  )
}
