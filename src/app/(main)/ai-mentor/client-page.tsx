"use client"

import { useFormStatus } from "react-dom"
import { getPrepRoadmap, type FormState } from "./actions"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { Bot, BrainCircuit, CalendarDays, CheckCircle2, HelpCircle, Loader2, Sparkles } from "lucide-react"
import { useEffect, useActionState } from "react"
import { useToast } from "@/hooks/use-toast"

const initialState: FormState = {
  message: "",
}

function SubmitButton() {
  const { pending } = useFormStatus()
  return (
    <Button type="submit" disabled={pending} className="w-full">
      {pending ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Generating...
        </>
      ) : (
        <>
          <Sparkles className="mr-2 h-4 w-4" />
          Generate Roadmap
        </>
      )}
    </Button>
  )
}

export function AiMentorClientPage() {
  const [state, formAction] = useActionState(getPrepRoadmap, initialState)
  const { toast } = useToast()

  useEffect(() => {
    if (state.message && state.message !== "success") {
      toast({
        variant: "destructive",
        title: "Error",
        description: state.message,
      })
    }
  }, [state, toast])

  return (
    <div className="grid gap-8 lg:grid-cols-3">
      <div className="lg:col-span-1">
        <form action={formAction}>
          <Card>
            <CardHeader>
              <CardTitle>Your Details</CardTitle>
              <CardDescription>
                Provide your details to get a personalized plan.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="cgpa">CGPA</Label>
                <Input
                  id="cgpa"
                  name="cgpa"
                  type="number"
                  step="0.1"
                  placeholder="e.g., 8.5"
                  required
                />
                {state.fieldErrors?.cgpa && (
                  <p className="text-sm text-destructive">{state.fieldErrors.cgpa}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="branch">Branch</Label>
                <Input
                  id="branch"
                  name="branch"
                  placeholder="e.g., Computer Science"
                  required
                />
                 {state.fieldErrors?.branch && (
                  <p className="text-sm text-destructive">{state.fieldErrors.branch}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="college">College</Label>
                <Input
                  id="college"
                  name="college"
                  placeholder="e.g., National Institute of Technology"
                  required
                />
                 {state.fieldErrors?.college && (
                  <p className="text-sm text-destructive">{state.fieldErrors.college}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="targetCompany">Target Company</Label>
                <Input
                  id="targetCompany"
                  name="targetCompany"
                  placeholder="e.g., Google"
                  required
                />
                 {state.fieldErrors?.targetCompany && (
                  <p className="text-sm text-destructive">{state.fieldErrors.targetCompany}</p>
                )}
              </div>
            </CardContent>
            <CardFooter>
              <SubmitButton />
            </CardFooter>
          </Card>
        </form>
      </div>
      <div className="lg:col-span-2">
        {state.data ? (
          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                 <div className="p-2 bg-primary/10 rounded-md">
                     <Bot className="h-6 w-6 text-primary" />
                 </div>
                <div>
                <CardTitle className="font-headline">Your Personalized Roadmap</CardTitle>
                <CardDescription>
                  Powered by Gemini AI. Follow this plan to crack your dream company.
                </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Accordion type="single" collapsible defaultValue="item-1" className="w-full">
                <AccordionItem value="item-1">
                  <AccordionTrigger className="text-lg font-semibold">
                    <CalendarDays className="inline-block mr-2" />
                    30-Day Preparation Roadmap
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="relative pl-6 pt-4">
                      <div className="absolute left-[7px] top-2 h-full w-0.5 bg-border" />
                      {state.data.roadmap.map((day, index) => (
                        <div key={index} className="relative mb-8 pl-8">
                          <div className="absolute -left-1.5 top-1 flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground font-bold">
                            {day.day}
                          </div>
                          <div className="pl-4">
                            <h4 className="font-semibold text-primary-foreground/90">{day.title}</h4>
                            <ul className="mt-2 list-disc list-inside space-y-1.5 text-muted-foreground">
                              {day.tasks.map((task, taskIndex) => (
                                <li key={taskIndex}>{task}</li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      ))}
                    </div>
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-2">
                  <AccordionTrigger className="text-lg font-semibold">
                    <HelpCircle className="inline-block mr-2" />
                    Frequently Asked Questions
                  </AccordionTrigger>
                  <AccordionContent>
                    <Accordion type="single" collapsible className="w-full space-y-2 pt-2">
                      {state.data.frequentlyAskedQuestions.map((faq, index) => (
                        <AccordionItem value={`faq-${index}`} key={index} className="rounded-md border bg-background/50 px-4 data-[state=open]:bg-accent/50">
                          <AccordionTrigger className="py-3 text-left hover:no-underline">
                            {faq.question}
                          </AccordionTrigger>
                          <AccordionContent className="pt-2 pb-4 text-muted-foreground">
                            {faq.answer}
                          </AccordionContent>
                        </AccordionItem>
                      ))}
                    </Accordion>
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-3">
                  <AccordionTrigger className="text-lg font-semibold">
                    <BrainCircuit className="inline-block mr-2" />
                    Core Concepts to Study
                  </AccordionTrigger>
                  <AccordionContent className="space-y-4 pt-4">
                    {state.data.coreConcepts.map((concept, index) => (
                      <div key={index} className="flex items-start gap-4">
                        <CheckCircle2 className="h-5 w-5 mt-0.5 shrink-0 text-primary" />
                        <div>
                          <h4 className="font-semibold">{concept.concept}</h4>
                          <p className="text-muted-foreground">{concept.description}</p>
                        </div>
                      </div>
                    ))}
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </CardContent>
          </Card>
        ) : (
          <div className="flex h-full items-center justify-center rounded-lg border border-dashed">
            <div className="text-center">
              <Bot className="mx-auto h-12 w-12 text-muted-foreground" />
              <h3 className="mt-4 text-lg font-semibold">
                Your roadmap will appear here
              </h3>
              <p className="mt-2 text-sm text-muted-foreground">
                Fill in your details and let our AI create a plan for you.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
