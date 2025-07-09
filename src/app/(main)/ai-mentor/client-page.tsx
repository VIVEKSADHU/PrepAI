
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
import { Bot, Clock, Rocket, ShieldCheck, Sparkles, Target, Loader2, ListChecks } from "lucide-react"
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
              <div className="space-y-2">
                <Label htmlFor="role">Target Role</Label>
                <Input
                  id="role"
                  name="role"
                  placeholder="e.g., Software Engineer"
                  required
                />
                 {state.fieldErrors?.role && (
                  <p className="text-sm text-destructive">{state.fieldErrors.role}</p>
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
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center gap-3">
                   <div className="p-2 bg-primary/10 rounded-md">
                       <Bot className="h-6 w-6 text-primary" />
                   </div>
                  <div>
                  <CardTitle className="font-headline">Your Personalized Career Roadmap</CardTitle>
                  <CardDescription>
                    Powered by Gemini AI. Here's a realistic plan to help you achieve your goals.
                  </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                 <Alert>
                    <Sparkles className="h-4 w-4" />
                    <AlertTitle>AI Reasoning</AlertTitle>
                    <AlertDescription>
                     {state.data.reasoning}
                    </AlertDescription>
                  </Alert>

                <div className="grid gap-4 md:grid-cols-2">
                    <Card>
                      <CardHeader className="flex-row items-center gap-4 space-y-0 pb-2">
                        <Clock className="h-6 w-6 text-muted-foreground" />
                        <CardTitle className="text-lg">Estimated Timeline</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-2xl font-bold">{state.data.estimatedTimeline}</p>
                      </CardContent>
                    </Card>
                     <Card>
                      <CardHeader className="flex-row items-center gap-4 space-y-0 pb-2">
                        <ShieldCheck className="h-6 w-6 text-muted-foreground" />
                        <CardTitle className="text-lg">Success Probability</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-muted-foreground">{state.data.successProbability}</p>
                      </CardContent>
                    </Card>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-4 flex items-center"><Rocket className="mr-2 h-5 w-5 text-primary"/>Key Milestones</h3>
                  <div className="space-y-4">
                    {state.data.keyMilestones.map((milestone, index) => (
                      <div key={index} className="flex items-start gap-4">
                        <Target className="h-5 w-5 mt-1 shrink-0 text-primary/80" />
                        <div>
                          <p className="font-semibold">{milestone.milestone}</p>
                          <p className="text-sm text-muted-foreground">{milestone.targetDate}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                   <h3 className="text-lg font-semibold mb-2 flex items-center"><ListChecks className="mr-2 h-5 w-5 text-primary"/>Detailed Breakdown</h3>
                  <Accordion type="single" collapsible defaultValue="item-0" className="w-full">
                     {state.data.roadmapBreakdown.map((item, index) => (
                        <AccordionItem value={`item-${index}`} key={index}>
                           <AccordionTrigger className="text-base font-semibold">
                             <span className="text-primary mr-3">{item.period}:</span> {item.title}
                          </AccordionTrigger>
                          <AccordionContent>
                             <ul className="list-disc list-inside space-y-2 pl-2 text-muted-foreground">
                               {item.tasks.map((task, taskIndex) => (
                                <li key={taskIndex}>{task}</li>
                              ))}
                             </ul>
                          </AccordionContent>
                        </AccordionItem>
                      ))}
                  </Accordion>
                </div>
              </CardContent>
            </Card>
          </div>
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
