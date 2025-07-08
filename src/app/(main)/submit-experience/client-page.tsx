"use client"

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
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Loader2 } from "lucide-react"
import { experienceSchema } from "./schema"

export function ExperienceForm() {
  const { toast } = useToast()
  
  const form = useForm<z.infer<typeof experienceSchema>>({
    resolver: zodResolver(experienceSchema),
    defaultValues: {
      name: "",
      college: "",
      cgpa: undefined,
      branch: "",
      targetCompany: "",
      onlineRound: "",
      techRound: "",
      hrRound: "",
    },
  })

  async function onSubmit(values: z.infer<typeof experienceSchema>) {
    const result = await submitExperienceAction(values);
    if(result.success) {
        toast({
            title: "Success!",
            description: result.message,
        })
        form.reset();
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
            <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
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
                        name="cgpa"
                        render={({ field }) => (
                            <FormItem>
                            <FormLabel>CGPA *</FormLabel>
                            <FormControl>
                                <Input type="number" step="0.1" placeholder="e.g. 8.5" {...field} />
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
                                <Input placeholder="e.g. Computer Science" {...field} />
                            </FormControl>
                            <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>
                <FormField
                        control={form.control}
                        name="targetCompany"
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
                    name="onlineRound"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Online Assessment</FormLabel>
                        <FormControl>
                            <Textarea
                            placeholder="Describe the online assessment round. What kind of questions were asked?"
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
                    name="techRound"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Technical Round(s)</FormLabel>
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
                    name="hrRound"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>HR / Managerial Round</FormLabel>
                        <FormControl>
                            <Textarea
                            placeholder="Describe the HR or managerial round. What kind of behavioral questions were asked?"
                            className="resize-y"
                            {...field}
                            />
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                />
                
                <Button type="submit" disabled={form.formState.isSubmitting}>
                    {form.formState.isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Submit Experience
                </Button>
            </form>
            </Form>
        </CardContent>
    </Card>
  )
}
