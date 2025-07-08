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
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Bot, BrainCircuit, HelpCircle, Loader2, Sparkles } from "lucide-react"
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
                    30-Day Preparation Roadmap
                  </AccordionTrigger>
                  <AccordionContent className="prose prose-sm max-w-none text-muted-foreground whitespace-pre-wrap">
                    {state.data.roadmap}
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-2">
                  <AccordionTrigger className="text-lg font-semibold">
                    <HelpCircle className="inline-block mr-2" />
                    Frequently Asked Questions
                  </AccordionTrigger>
                  <AccordionContent className="prose prose-sm max-w-none text-muted-foreground whitespace-pre-wrap">
                    {state.data.frequentlyAskedQuestions}
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-3">
                  <AccordionTrigger className="text-lg font-semibold">
                    <BrainCircuit className="inline-block mr-2" />
                    Core Concepts to Study
                  </AccordionTrigger>
                  <AccordionContent className="prose prose-sm max-w-none text-muted-foreground whitespace-pre-wrap">
                    {state.data.coreConcepts}
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
