"use client"

import { useState } from "react"
import { Loader2 } from "lucide-react"

export default function DsaTrackerPage() {
  const [isLoading, setIsLoading] = useState(true)

  const handleIframeLoad = () => {
    setIsLoading(false)
  }

  return (
    <div className="h-screen w-full relative">
      {/* Loading Spinner */}
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-slate-50 dark:bg-slate-900 z-10">
          <div className="flex flex-col items-center gap-4">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="text-muted-foreground text-sm">Loading DSA Tracker...</p>
          </div>
        </div>
      )}
      
      {/* Full Screen Iframe */}
      <iframe
        src="https://dsa-tracker-delta-ten.vercel.app/"
        className={`w-full h-full border-0 transition-opacity duration-300 ease-in-out ${
          isLoading ? "opacity-0" : "opacity-100"
        }`}
        onLoad={handleIframeLoad}
        title="DSA Tracker"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
      />
    </div>
  )
}
