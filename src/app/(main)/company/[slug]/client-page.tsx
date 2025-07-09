"use client"

import Image from "next/image"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Briefcase,
  Calendar,
  GraduationCap,
  School,
  Trophy,
} from "lucide-react"

export type Experience = {
  id: string
  name: string
  college: string
  branch: string
  cgpa: number
  role: string
  year: number
  round1?: string
  round2?: string
  round3?: string
  createdAt: string
}

type CompanyData = {
  name: string
  logoURL: string
  aiSummary: string
  aiHint?: string
}

type CompanyClientPageProps = {
  company: CompanyData
  experiences: Experience[]
}

export function CompanyClientPage({
  company,
  experiences,
}: CompanyClientPageProps) {
  return (
    <div className="flex flex-col gap-8">
      <Card>
        <CardHeader className="flex flex-col items-start gap-6 md:flex-row">
          <Image
            src={company.logoURL}
            alt={`${company.name} logo`}
            width={80}
            height={80}
            className="rounded-lg border object-contain p-1"
            data-ai-hint={company.aiHint}
          />
          <div className="flex-1">
            <CardTitle className="text-3xl font-headline">
              {company.name}
            </CardTitle>
            <CardDescription className="mt-2 text-base">
              {company.aiSummary}
            </CardDescription>
          </div>
        </CardHeader>
      </Card>

      <div>
        <h2 className="mb-4 text-2xl font-bold font-headline tracking-tight">
          Student Experiences ({experiences.length})
        </h2>
        {experiences.length > 0 ? (
          <Accordion type="single" collapsible className="w-full space-y-4">
            {experiences.map((exp, index) => (
              <AccordionItem
                value={`item-${index}`}
                key={exp.id}
                className="overflow-hidden rounded-lg border bg-card"
              >
                <AccordionTrigger className="px-6 py-4 text-lg font-semibold hover:no-underline">
                  <div className="flex w-full items-center justify-between">
                    <div className="flex items-center gap-4">
                       <Avatar className="h-10 w-10">
                          <AvatarImage src={`https://avatar.vercel.sh/${encodeURIComponent(exp.name)}.png`} alt={exp.name} />
                          <AvatarFallback>{exp.name.charAt(0).toUpperCase()}</AvatarFallback>
                        </Avatar>
                      <div>
                        <p className="text-left text-base font-medium">
                          {exp.name}
                        </p>
                        <p className="text-left text-sm font-normal text-muted-foreground">
                          {exp.role}
                        </p>
                      </div>
                    </div>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="px-6 pb-6">
                  <div className="mb-6 grid grid-cols-2 gap-x-6 gap-y-4 border-b pb-4 pt-2 text-sm md:grid-cols-3">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <School className="h-4 w-4 shrink-0" />
                      <span className="truncate">{exp.college}</span>
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <GraduationCap className="h-4 w-4 shrink-0" />
                      <span className="truncate">{exp.branch}</span>
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Trophy className="h-4 w-4 shrink-0" />
                      <span>CGPA: {exp.cgpa.toFixed(1)}</span>
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Briefcase className="h-4 w-4 shrink-0" />
                      <span className="truncate">Role: {exp.role}</span>
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Calendar className="h-4 w-4 shrink-0" />
                      <span>Year: {exp.year}</span>
                    </div>
                  </div>
                  <div className="space-y-6">
                    {exp.round1 && (
                      <div>
                        <h4 className="mb-2 font-semibold">
                          Online Assessment / Round 1
                        </h4>
                        <p className="whitespace-pre-wrap text-muted-foreground">
                          {exp.round1}
                        </p>
                      </div>
                    )}
                    {exp.round2 && (
                      <div>
                        <h4 className="mb-2 font-semibold">
                          Technical Round(s) / Round 2
                        </h4>
                        <p className="whitespace-pre-wrap text-muted-foreground">
                          {exp.round2}
                        </p>
                      </div>
                    )}
                    {exp.round3 && (
                      <div>
                        <h4 className="mb-2 font-semibold">
                          HR / Managerial Round / Round 3
                        </h4>
                        <p className="whitespace-pre-wrap text-muted-foreground">
                          {exp.round3}
                        </p>
                      </div>
                    )}
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        ) : (
          <Card className="flex h-40 items-center justify-center border-dashed">
            <p className="text-muted-foreground">
              No experiences have been shared for this company yet.
            </p>
          </Card>
        )}
      </div>
    </div>
  )
}
