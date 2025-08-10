import React from "react"

interface N8nLogoProps {
  className?: string
  size?: number
}

export function N8nLogo({ className, size = 32 }: N8nLogoProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <g clipPath="url(#clip0)">
        <path
          d="M16 0C7.164 0 0 7.164 0 16s7.164 16 16 16 16-7.164 16-16S24.836 0 16 0z"
          fill="#FF6D5A"
        />
        <path
          d="M8.5 11.5h15v2h-15v-2zm0 3h15v2h-15v-2zm0 3h15v2h-15v-2zm0 3h10v2h-10v-2z"
          fill="white"
        />
        <circle cx="22" cy="21.5" r="1.5" fill="white" />
        <path
          d="M20.5 8.5c0-.276.224-.5.5-.5s.5.224.5.5v6c0 .276-.224.5-.5.5s-.5-.224-.5-.5v-6z"
          fill="white"
        />
        <path
          d="M19 10c-.276 0-.5-.224-.5-.5s.224-.5.5-.5h4c.276 0 .5.224.5.5s-.224.5-.5.5h-4z"
          fill="white"
        />
      </g>
      <defs>
        <clipPath id="clip0">
          <path fill="white" d="M0 0h32v32H0z" />
        </clipPath>
      </defs>
    </svg>
  )
}
