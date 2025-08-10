import React from "react"

interface ATSIconProps {
  className?: string
  size?: number
}

export function ATSIcon({ className, size = 64 }: ATSIconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Document background */}
      <rect x="12" y="8" width="40" height="48" rx="4" fill="#f8fafc" stroke="#e2e8f0" strokeWidth="2"/>
      
      {/* Document header */}
      <rect x="16" y="12" width="32" height="6" rx="2" fill="#3b82f6"/>
      
      {/* Text lines */}
      <rect x="16" y="22" width="24" height="2" rx="1" fill="#64748b"/>
      <rect x="16" y="26" width="28" height="2" rx="1" fill="#64748b"/>
      <rect x="16" y="30" width="20" height="2" rx="1" fill="#64748b"/>
      
      {/* Skills section */}
      <rect x="16" y="36" width="16" height="2" rx="1" fill="#10b981"/>
      <rect x="16" y="40" width="12" height="2" rx="1" fill="#10b981"/>
      <rect x="16" y="44" width="18" height="2" rx="1" fill="#10b981"/>
      
      {/* ATS Scanner effect */}
      <g className="animate-pulse">
        <rect x="8" y="20" width="2" height="20" rx="1" fill="#ef4444"/>
        <circle cx="9" cy="18" r="2" fill="#ef4444"/>
      </g>
      
      {/* Scanning beam */}
      <defs>
        <linearGradient id="scanGradient" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="transparent"/>
          <stop offset="50%" stopColor="#ef4444" stopOpacity="0.3"/>
          <stop offset="100%" stopColor="transparent"/>
        </linearGradient>
      </defs>
      <rect x="12" y="8" width="40" height="48" rx="4" fill="url(#scanGradient)" className="animate-pulse"/>
      
      {/* Checkmarks for ATS compatibility */}
      <circle cx="45" cy="20" r="3" fill="#10b981"/>
      <path d="M43.5 20l1 1 2-2" stroke="white" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
      
      <circle cx="45" cy="28" r="3" fill="#10b981"/>
      <path d="M43.5 28l1 1 2-2" stroke="white" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
      
      <circle cx="45" cy="36" r="3" fill="#f59e0b"/>
      <path d="M44 36h2" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  )
}

export function ResumeAnalyticsIcon({ className, size = 48 }: ATSIconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Chart background */}
      <rect x="4" y="8" width="40" height="32" rx="4" fill="#f1f5f9" stroke="#e2e8f0" strokeWidth="2"/>
      
      {/* Chart bars */}
      <rect x="8" y="28" width="4" height="8" rx="2" fill="#3b82f6"/>
      <rect x="14" y="24" width="4" height="12" rx="2" fill="#10b981"/>
      <rect x="20" y="30" width="4" height="6" rx="2" fill="#f59e0b"/>
      <rect x="26" y="20" width="4" height="16" rx="2" fill="#ef4444"/>
      <rect x="32" y="26" width="4" height="10" rx="2" fill="#8b5cf6"/>
      <rect x="38" y="22" width="4" height="14" rx="2" fill="#06b6d4"/>
      
      {/* Percentage indicator */}
      <circle cx="36" cy="14" r="6" fill="#10b981"/>
      <text x="36" y="17" textAnchor="middle" fontSize="8" fill="white" fontWeight="bold">85%</text>
    </svg>
  )
}
