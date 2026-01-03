'use client'

import React, { Suspense } from 'react'
import { useSession } from 'next-auth/react'
import Loading from '@/Loading'
import dynamic from 'next/dynamic'

const FeaturedProducts = dynamic(() => import('@/app/_components/FeaturedProducts'), { ssr: false })

export default function page() {
  const { status } = useSession()

  if (status !== 'authenticated') {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <p className="text-xl">Please sign in to view products.</p>
      </div>
    )
  }

  return (
    <div className="flex flex-wrap">
      <Suspense fallback={<Loading />}>
        <FeaturedProducts />
      </Suspense>
    </div>
  )
}