import { AiMentorClientPage } from "./client-page"

export default function AiMentorPage() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight font-headline">
          AI Mentor
        </h1>
        <p className="text-muted-foreground">
          Get a personalized roadmap for your placement preparation.
        </p>
      </div>
      <AiMentorClientPage />
    </div>
  )
}
