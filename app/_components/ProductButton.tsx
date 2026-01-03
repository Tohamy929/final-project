'use client'

import { Button } from '@/components/ui/button'
import { ProductInterface } from '@/interfaces/products.interface'
import { useSession, signIn } from 'next-auth/react'
import { useState } from 'react'
import toast from 'react-hot-toast'

const API = process.env.NEXT_PUBLIC_API || 'https://ecommerce.routemisr.com/api/v1/'

export default function ProductButton({ product }: { product: ProductInterface }) {
  const { data: session, status } = useSession()
  const [loading, setLoading] = useState(false)

  const handleAdd = async () => {
    if (status !== 'authenticated') {
      signIn()
      return
    }

    setLoading(true)
    try {
      const token = (session?.user as any)?.token
      const headers: Record<string, string> = { 'Content-Type': 'application/json' }
      if (token) {
        headers['Authorization'] = `Bearer ${token}`
        headers['x-access-token'] = token
        headers['token'] = token
      }

      console.log('Add-> session:', session)
      console.log('Add-> headers:', headers)
      console.log('Add-> payload:', { productId: product._id, quantity: 1 })

      const res = await fetch(`${API}cart`, {
        method: 'POST',
        headers,
        body: JSON.stringify({ productId: product._id, quantity: 1 }),
      })

      const body = await res.text().catch(() => null)
      let json = null
      try { json = body ? JSON.parse(body) : null } catch (e) { /* non-json */ }

      console.log('Add-> status:', res.status, 'body:', json ?? body)

      if (res.ok) {
        toast.success('Added to cart')
         try { window.dispatchEvent(new Event('cart-updated')) } catch {}
      } else {
        toast.error(json?.message || json?.error || body || 'Failed to add to cart')
      }
    } catch (e) {
      console.error('Add-> exception', e)
      toast.error('Failed to add to cart')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Button onClick={handleAdd} className="cursor-pointer w-full" variant={'default'} disabled={loading}>
      {loading ? 'Adding...' : 'Add to cart'}
    </Button>
  )
}