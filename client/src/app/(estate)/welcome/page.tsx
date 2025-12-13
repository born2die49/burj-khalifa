import React from 'react'
import type { Metadata } from 'next'
import PostCard from '@/components/cards/PostCard'

export const metadata: Metadata = {
  title: "Burj Khalifa | Welcome",
  description: "Welcome to the Burj Khalifa Website. This webapp allows users who are tenants to signup, create their profiles, report any issues with their apartments, report any tenants, post anything of relevance for other tenants to see and or respond."
}

export default function WelcomePage() {
  return (
    <div>
      <>
        <PostCard/>
      </>
    </div>
  )
}
