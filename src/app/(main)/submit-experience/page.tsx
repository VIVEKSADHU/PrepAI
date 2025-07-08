import { ExperienceForm } from "./client-page";

export default function SubmitExperiencePage() {
    return (
        <div className="flex flex-col gap-6 max-w-3xl mx-auto">
          <div>
            <h1 className="text-3xl font-bold tracking-tight font-headline">
              Share Your Experience
            </h1>
            <p className="text-muted-foreground">
              Help the community by sharing your interview experience. Your submission will be anonymous.
            </p>
          </div>
          <ExperienceForm />
        </div>
      )
}
