'use client'

import { useEffect, useState } from 'react'
import { useSession, signIn } from 'next-auth/react'
import { Heart, Trash2, ShoppingCart } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Image from 'next/image'
import toast from 'react-hot-toast'
import Link from 'next/link'

const API = process.env.NEXT_PUBLIC_API || 'https://ecommerce.routemisr.com/api/v1/'

interface WishlistItem {
  _id: string
  id: string
  name?: string
  title: string
  price: number
  priceAfterDiscount?: number
  imageCover: string
  image?: string
  description?: string
  ratingsAverage?: number
}

export default function WishlistPage() {
  const { data: session, status } = useSession()
  const [wishlist, setWishlist] = useState<WishlistItem[]>([])
  const [loading, setLoading] = useState(true)
  const token = (session?.user as any)?.token

  useEffect(() => {
    if (status === 'authenticated') {
      fetchWishlist()
      const handler = () => fetchWishlist()
      window.addEventListener('wishlist-updated', handler)
      return () => window.removeEventListener('wishlist-updated', handler)
    } else if (status === 'unauthenticated') {
      setLoading(false)
    }
  }, [status])

  const fetchWishlist = async () => {
    try {
      const headers: Record<string, string> = {}
      if (token) {
        headers['Authorization'] = `Bearer ${token}`
        headers['x-access-token'] = token
        headers['token'] = token
      }

      const response = await fetch(`${API}wishlist`, {
        headers,
      })

      const data = await response.json()

      if (response.ok) {
        const items = Array.isArray(data.data) ? data.data : Array.isArray(data.wishlist) ? data.wishlist : []
        setWishlist(items)
      } else {
        console.error('Failed to fetch wishlist:', data)
        setWishlist([])
      }
    } catch (error) {
      console.error('Failed to fetch wishlist:', error)
      toast.error('Failed to load wishlist')
      setWishlist([])
    } finally {
      setLoading(false)
    }
  }

  const removeFromWishlist = async (id: string) => {
    try {
      const headers: Record<string, string> = {}
      if (token) {
        headers['Authorization'] = `Bearer ${token}`
        headers['x-access-token'] = token
        headers['token'] = token
      }

      const response = await fetch(`${API}wishlist/${id}`, {
        method: 'DELETE',
        headers,
      })

      if (response.ok) {
        setWishlist(wishlist.filter((item) => item._id !== id && item.id !== id))
        toast.success('Removed from wishlist')
        window.dispatchEvent(new Event('wishlist-updated'))
      } else {
        const data = await response.json()
        toast.error(data.message || 'Failed to remove item')
      }
    } catch (error) {
      console.error('Failed to remove item:', error)
      toast.error('An error occurred')
    }
  }

  const addToCart = async (product: WishlistItem) => {
    try {
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
      }
      if (token) {
        headers['Authorization'] = `Bearer ${token}`
        headers['x-access-token'] = token
        headers['token'] = token
      }

      const res = await fetch(`${API}cart`, {
        method: 'POST',
        headers,
        body: JSON.stringify({ productId: product._id, quantity: 1 }),
      })

      if (res.ok) {
        toast.success('Added to cart')
        window.dispatchEvent(new Event('cart-updated'))
      } else {
        const data = await res.json().catch(() => ({}))
        toast.error(data.message || 'Failed to add to cart')
      }
    } catch (error) {
      console.error('Add to cart error:', error)
      toast.error('An error occurred')
    }
  }

  if (status === 'unauthenticated') {
    return (
      <div className="min-h-screen p-8 bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-4">Sign in to view your wishlist</h1>
          <p className="text-gray-600 mb-8">Please log in to access your wishlist</p>
          <Button onClick={() => signIn()} className="bg-main hover:bg-main/90">
            Sign In
          </Button>
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="min-h-screen p-8 bg-gray-50 flex items-center justify-center">
        <div className="text-lg text-gray-600">Loading your wishlist...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen p-8 bg-gray-50">
      <h1 className="text-3xl font-bold mb-8">My Wishlist</h1>

      {wishlist.length === 0 ? (
        <div className="text-center py-12">
          <Heart size={48} className="mx-auto text-gray-300 mb-4" />
          <p className="text-gray-500 text-lg mb-8">Your wishlist is empty</p>
          <Link href="/">
            <Button className="bg-main hover:bg-main/90">Continue Shopping</Button>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {wishlist.map((item) => (
            <div key={item._id || item.id} className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
              <div className="relative h-48 w-full">
                <Image
                
                  src={item.imageCover || item.image || '/placeholder.png'}
                  alt={item.title || item.name || 'Product'}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="p-4">
                <h2 className="font-semibold text-lg line-clamp-2 mb-2">{item.title || item.name}</h2>
                {item.description && <p className="text-gray-600 text-sm line-clamp-2 mb-3">{item.description}</p>}
                <div className="flex items-baseline gap-2 mb-4">
                  {item.priceAfterDiscount ? (
                    <>
                      <p className="text-main font-bold text-lg">{item.priceAfterDiscount} EGP</p>
                      <p className="text-gray-500 line-through text-sm">{item.price} EGP</p>
                    </>
                  ) : (
                    <p className="text-main font-bold text-lg">{item.price} EGP</p>
                  )}
                </div>
                {item.ratingsAverage && (
                  <p className="text-sm text-gray-600 mb-4">
                    <i className="fa-solid fa-star text-yellow-400"></i> {item.ratingsAverage}
                  </p>
                )}
                <div className="flex gap-2">
                  <Button
                    onClick={() => addToCart(item)}
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white flex items-center justify-center gap-2"
                  >
                    <ShoppingCart size={18} />
                    Add to Cart
                  </Button>
                  <Button
                    onClick={() => removeFromWishlist(item._id || item.id)}
                    variant="outline"
                    className="flex-none px-3 text-red-500 border-red-500 hover:bg-red-50"
                  >
                    <Trash2 size={18} />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}