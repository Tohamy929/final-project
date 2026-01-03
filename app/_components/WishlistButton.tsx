'use client'

import { Button } from '@/components/ui/button'
import { ProductInterface } from '@/interfaces/products.interface'
import { useSession, signIn } from 'next-auth/react'
import { useState, useEffect } from 'react'
import toast from 'react-hot-toast'
import { Heart } from 'lucide-react'

const API = process.env.NEXT_PUBLIC_API || 'https://ecommerce.routemisr.com/api/v1/'

export default function WishlistButton({ product }: { product: ProductInterface }) {
  const { data: session, status } = useSession()
  const [loading, setLoading] = useState(false)
  const [isInWishlist, setIsInWishlist] = useState(false)
  const token = (session?.user as any)?.token

  useEffect(() => {
    if (status === 'authenticated') {
      checkWishlistStatus()
    }
  }, [status, product._id])

  const checkWishlistStatus = async () => {
    try {
      const headers: Record<string, string> = {}
      if (token) {
        headers['Authorization'] = `Bearer ${token}`
        headers['x-access-token'] = token
        headers['token'] = token
      }

      const res = await fetch(`${API}wishlist`, {
        headers,
      })

      if (res.ok) {
        const data = await res.json()
        const wishlistItems = data.data || data.wishlist || []
        const isWishlisted = wishlistItems.some(
          (item: any) => item._id === product._id || item.id === product._id
        )
        setIsInWishlist(isWishlisted)
      }
    } catch (error) {
      console.error('Error checking wishlist status:', error)
    }
  }

  const handleWishlistToggle = async () => {
    if (status !== 'authenticated') {
      signIn()
      return
    }

    setLoading(true)
    try {
      const headers: Record<string, string> = { 'Content-Type': 'application/json' }
      if (token) {
        headers['Authorization'] = `Bearer ${token}`
        headers['x-access-token'] = token
        headers['token'] = token
      }

      if (isInWishlist) {
        // Remove from wishlist
        const res = await fetch(`${API}wishlist/${product._id}`, {
          method: 'DELETE',
          headers,
        })

        if (res.ok) {
          setIsInWishlist(false)
          toast.success('Removed from wishlist')
          window.dispatchEvent(new Event('wishlist-updated'))
        } else {
          const data = await res.json().catch(() => ({}))
          toast.error(data.message || 'Failed to remove from wishlist')
        }
      } else {
        // Add to wishlist
        const res = await fetch(`${API}wishlist`, {
          method: 'POST',
          headers,
          body: JSON.stringify({ productId: product._id }),
        })

        if (res.ok) {
          setIsInWishlist(true)
          toast.success('Added to wishlist')
          window.dispatchEvent(new Event('wishlist-updated'))
        } else {
          const data = await res.json().catch(() => ({}))
          toast.error(data.message || 'Failed to add to wishlist')
        }
      }
    } catch (error) {
      console.error('Wishlist toggle error:', error)
      toast.error('An error occurred')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Button
      onClick={handleWishlistToggle}
      disabled={loading || status !== 'authenticated'}
      className={`flex items-center gap-2 ${
        isInWishlist ? 'bg-red-500 hover:bg-red-600' : 'bg-gray-300 hover:bg-gray-400'
      }`}
    >
      <Heart
        size={20}
        fill={isInWishlist ? 'currentColor' : 'none'}
        className={isInWishlist ? 'text-white' : 'text-gray-600'}
      />
      {isInWishlist ? 'In Wishlist' : 'Add to Wishlist'}
    </Button>
  )
}
