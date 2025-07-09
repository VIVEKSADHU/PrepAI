"use client"

import { useEffect } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"

import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import { submitExperienceAction } from "./actions"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card"
import { Loader2, AlertTriangle } from "lucide-react"
import { experienceSchema } from "./schema"
import { useAuth } from "@/contexts/auth-context"
import { isDemoMode } from "@/lib/firebase.client"
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert"

export function ExperienceForm() {
  const { toast } = useToast()
  const { user } = useAuth()

  const form = useForm<z.infer<typeof experienceSchema>>({
    resolver: zodResolver(experienceSchema),
    defaultValues: {
      name: "",
      college: "",
      cgpa: undefined,
      branch: "",
      company: "",
      role: "",
      year: new Date().getFullYear(),
      round1: "",
      round2: "",
      round3: "",
    },
  })

  // Pre-fill name from auth context if available
  useEffect(() => {
    if (user?.displayName) {
      form.setValue("name", user.displayName)
    }
  }, [user, form])

  async function onSubmit(values: z.infer<typeof experienceSchema>) {
    if (isDemoMode) {
      toast({
        title: "Demo Mode",
        description:
          "Experience submission is disabled. Please configure Firebase to enable this feature.",
      })
      return
    }

    if (!user) {
      toast({
        variant: "destructive",
        title: "Not Authenticated",
        description: "You must be logged in to submit an experience.",
      })
      return
    }

    const result = await submitExperienceAction(
      values,
      user.uid,
      user.email || ""
    )
    if (result.success) {
      toast({
        title: "Success!",
        description: result.message,
      })
      form.reset()
    } else {
      toast({
        variant: "destructive",
        title: "Error",
        description: result.message,
      })
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Interview Details</CardTitle>
        <CardDescription>All fields with * are required.</CardDescription>
      </CardHeader>
      <CardContent>
        {isDemoMode && (
          <Alert className="mb-6">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Demo Mode</AlertTitle>
            <AlertDescription>
              The form is disabled because Firebase is not configured.
            </AlertDescription>
          </Alert>
        )}
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <fieldset
              disabled={form.formState.isSubmitting || isDemoMode}
              className="space-y-8 group"
            >
              <div className="grid md:grid-cols-2 gap-8">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Name *</FormLabel>
                      <FormControl>
                        <Input placeholder="Your full name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="college"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>College *</FormLabel>
                      <FormControl>
                        <Input placeholder="Your college name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="branch"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Branch *</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="e.g. Computer Science"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="cgpa"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>CGPA *</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          step="0.1"
                          placeholder="e.g. 8.5"
                          {...field}
                          value={field.value ?? ""}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="company"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Company *</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g. Google" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="role"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Role *</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="e.g. Software Engineer Intern"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="year"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Placement Year *</FormLabel>
                      <FormControl>
                        <Input type="number" placeholder="e.g. 2024" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                control={form.control}
                name="round1"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Online Assessment / Round 1</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Describe the first round. What kind of questions were asked?"
                        className="resize-y"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="round2"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Technical Round(s) / Round 2</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Describe the technical interviews. Topics covered, difficulty level, etc."
                        className="resize-y"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="round3"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>HR / Managerial Round / Round 3</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Describe the final round. What kind of behavioral questions were asked?"
                        className="resize-y"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button
                type="submit"
                disabled={form.formState.isSubmitting || isDemoMode}
              >
                {form.formState.isSubmitting && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                Submit Experience
              </Button>
            </fieldset>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}