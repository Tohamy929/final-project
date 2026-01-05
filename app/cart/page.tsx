
'use client'
export const dynamic = "force-dynamic";
import React, { useEffect, useState, useRef } from 'react'
import { useSession, signIn, signOut } from 'next-auth/react'
import toast from 'react-hot-toast'
import { Button } from '@/components/ui/button'
import { Trash2, Plus, Minus } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'

const API_BASE = 'https://ecommerce.routemisr.com/api/v1'

interface CartItem {
  _id: string
  count: number
  price: number
  product?: {
    _id?: string
    title?: string
    imageCover?: string
  }
  title?: string
  imageCover?: string
}

const CartPage: React.FC = () => {
  const { data: session, status } = useSession()
  const [cart, setCart] = useState<CartItem[]>([])
  const [loading, setLoading] = useState(true)
  const [mutating, setMutating] = useState(false)
  const [showPaymentModal, setShowPaymentModal] = useState(false)
  const [paymentMethod, setPaymentMethod] = useState<'cash' | 'card' | 'wallet' | null>(null)
  const [processingPayment, setProcessingPayment] = useState(false)
  const [shippingAddress, setShippingAddress] = useState('')
  const initialFetchDone = useRef(false)

 
 

  const getAuthHeader = () => {
    const token = (session?.user as any)?.token
    if (!token) {
      toast.error('Not authenticated. Please log in.')
      return null
    }
    return {
      'Content-Type': 'application/json',
      token: token,
    }
  }

 const refetchCart = async (): Promise<CartItem[]> => {
  try {
    const token = session?.user?.token;
    if (!token) {
      toast.error("You must be logged in to view your cart");
      return [];
    }

    const res = await fetch("https://ecommerce.routemisr.com/api/v1/cart", {
      method: "GET",
       headers: getAuthHeader() || {}, 
      cache: "no-store",
    });

    const data = await res.json();
    console.log("refetchCart response:", res.status, data);

    if (res.ok) {
      const items = data?.data?.products ?? data?.items ?? data?.products ?? [];
      setCart(items);
      setLoading(false);
      return items;
    }

    if (res.status === 401) {
     toast.error("Session expired. Please log in again.");
      setCart([]);
      setLoading(false);
      
      return [];
    }

    console.error("refetchCart failed:", data);
    setCart([]);
    setLoading(false);
    return [];
  } catch (error) {
    console.error("refetchCart error:", error);
    setCart([]);
    setLoading(false);
    return [];
  }
};

  // ✅ Only run refetchCart once the session is authenticated
  useEffect(() => {
    if (status === "authenticated" && session?.user &&
    !initialFetchDone.current
) {
  initialFetchDone.current = true;
      refetchCart();
    }
  }, [status, session?.user?.token]);



 const updateQuantity = async (productId: string, newCount: number) => {
  const token = (session?.user as any)?.token;
  if (!token) {
    toast.error("Not authenticated");
    return;
  }

  setMutating(true);
  try {
    const res = await fetch(`${API_BASE}/cart/${productId}`, {
      method: "PUT",
      headers: getAuthHeader() || {},
      body: JSON.stringify({ count: newCount }),
    });

    const data = await res.json();
    console.log("updateQuantity response:", res.status, data);

    if (res.ok && data.status === "success") {
      toast.success("Quantity updated");
      await refetchCart();
    } else {
      toast.error(data.message || "Failed to update quantity");
    }
  } catch (error) {
    console.error("updateQuantity error:", error);
    toast.error("Network error while updating quantity");
  } finally {
    setMutating(false);
  }
};

 const deleteItem = async (productId: string) => {
  const token = (session?.user as any)?.token;
  if (!token) {
    toast.error("Not authenticated");
    return;
  }

  setMutating(true);
  try {
    const res = await fetch(`${API_BASE}/cart/${productId}`, {
      method: "DELETE",
      headers: getAuthHeader() || {},
    });

    const data = await res.json();
    console.log("deleteItem response:", res.status, data);

    if (res.ok && data.status === "success") {
      toast.success("Item removed");
      await refetchCart(); // reload cart from server
    } else {
      toast.error(data.message || "Item was not removed from server");
    }
  } catch (error) {
    console.error("deleteItem error:", error);
    toast.error("Network error while removing item");
  } finally {
    setMutating(false);
  }
};

  const calculateTotal = () => {
    return cart.reduce((total, item) => {
      const price = Number(item.price ?? 0) || 0
      const qty = Number(item.count ?? 0) || 0
      return total + price * qty
    }, 0)
  }

  const calculateSubtotal = (item: CartItem) => {
    const price = Number(item.price) || 0
    const qty = Number(item.count ?? 0) || 0
    return price * qty
  }

  const handlePayment = async () => {
    if (!paymentMethod) {
      toast.error('Please select a payment method')
      return
    }

    if (!shippingAddress.trim()) {
      toast.error('Please enter a shipping address')
      return
    }

    setProcessingPayment(true)
    try {
      const token = (session?.user as any)?.token
      
      if (!token) {
        toast.error('Not authenticated')
        return
      }

      let endpoint = ''
      let body: any = {
        shippingAddress: {
          details: shippingAddress,
          phone: (session?.user as any)?.phone || '',
        },
      }

      if (paymentMethod === 'cash') {
        endpoint = '/api/payment/cash'
      } else if (paymentMethod === 'card') {
        endpoint = '/api/payment/card'
      } else if (paymentMethod === 'wallet') {
        endpoint = '/api/payment/wallet'
      }

      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      }

      const res = await fetch(endpoint, {
        method: 'POST',
        headers,
        body: JSON.stringify(body),
      })

      const data = await res.json()

      if (!res.ok) {
        toast.error(data.message || 'Payment failed')
        return
      }

      if (paymentMethod === 'card' && data.session?.url) {
        // Redirect to payment gateway
        window.location.href = data.session.url
      } else {
        toast.success('Order placed successfully!')
        setShowPaymentModal(false)
        setCart([])
        setShippingAddress('')
        setPaymentMethod(null)
        // Re-fetch to ensure state is synced
        await refetchCart()
      }
    } catch (error) {
      console.error('Payment error:', error)
      toast.error('An error occurred during payment')
    } finally {
      setProcessingPayment(false)
    }
  }

  if (status === 'unauthenticated') {
    return (
      <div className="min-h-screen p-8 bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-4">Sign in to view your cart</h1>
          <p className="text-gray-600 mb-8">Please log in to access your shopping cart</p>
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
        <div className="text-lg text-gray-600">Loading your cart...</div>
      </div>
    )
  }
  

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <h1 className="text-3xl font-bold mb-8">Shopping Cart</h1>

      {cart.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg mb-8">Your cart is empty</p>
          <Link href="/products">
            <Button className="bg-main hover:bg-main/90">Continue Shopping</Button>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-lg overflow-hidden">
              {cart.map((item) => (
                <div key={item._id} className="border-b p-6 flex gap-4 hover:bg-gray-50">
                  <div className="w-24 h-24 flex-shrink-0">
                    <Image
                      src={item.product?.imageCover || item.imageCover || '/placeholder.png'}
                      alt={item.product?.title || item.title || 'Product image'}
                      width={96}
                      height={96}
                      className="w-full h-full object-cover rounded"
                    />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg line-clamp-1">
                      {item.product?.title || item.title || 'Item'}
                    </h3>
                    <p className="text-main font-bold mb-2">{item.price} EGP</p>
                    <div className="flex items-center gap-2 mb-4">
                      <Button
                        onClick={() => updateQuantity(item.product?._id!, item.count - 1)}
                        variant="outline"
                        size="sm"
                        className="h-8 w-8 p-0"
                        disabled={mutating}
                      >
                        <Minus size={16} />
                      </Button>
                      <span className="w-8 text-center">{item.count}</span>
                      <Button
  onClick={() => updateQuantity(item.product?._id!, item.count + 1)} // <-- use product._id
  variant="outline"
  size="sm"
  className="h-8 w-8 p-0"
  disabled={mutating}
>
  <Plus size={16} />
</Button>
                    </div>
                    
                    <p className="text-sm text-gray-600">
                      Subtotal: {calculateSubtotal(item)} EGP
                    </p>
                  </div>
 <Button
  onClick={() => deleteItem(item.product?._id!)} // non-null assertion
  variant="outline"
  className="text-red-500 border-red-500 hover:bg-red-50 h-fit"
  disabled={mutating}
>
  <Trash2 size={18} />
</Button>
                </div>
              ))}
            </div>
          </div>

          {/* Summary & Checkout */}
          <div>
            <div className="bg-white rounded-lg shadow-lg p-6 sticky top-4">
              <h2 className="text-xl font-bold mb-4">Order Summary</h2>
              <div className="space-y-3 mb-6 pb-6 border-b">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>{calculateTotal()} EGP</span>
                </div>
                <div className="flex justify-between text-sm text-gray-600">
                  <span>Shipping</span>
                  <span>Free</span>
                </div>
                <div className="flex justify-between font-bold text-lg pt-2">
                  <span>Total</span>
                  <span className="text-main">{calculateTotal()} EGP</span>
                </div>
              </div>

              <Button
                onClick={() => setShowPaymentModal(true)}
                className="w-full bg-main hover:bg-main/90 text-white font-bold py-3"
                disabled={mutating}
              >
                Proceed to Checkout
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Payment Modal */}
      {showPaymentModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h2 className="text-2xl font-bold mb-6">Select Payment Method</h2>

            <div className="space-y-4 mb-6">
              {/* Shipping Address */}
              <div>
                <label className="block text-sm font-medium mb-2">Shipping Address</label>
                <textarea
                  value={shippingAddress}
                  onChange={(e) => setShippingAddress(e.target.value)}
                  placeholder="Enter your full shipping address"
                  className="w-full border rounded-lg p-2 text-sm"
                  rows={3}
                />
              </div>

              {/* Payment Methods */}
              <div className="space-y-3">
                <label className="flex items-center p-4 border rounded-lg cursor-pointer hover:bg-gray-50" onClick={() => setPaymentMethod('cash')}>
                  <input
                    type="radio"
                    name="payment"
                    value="cash"
                    checked={paymentMethod === 'cash'}
                    onChange={(e) => setPaymentMethod(e.target.value as 'cash')}
                    className="mr-3"
                  />
                  <div>
                    <p className="font-semibold">Cash on Delivery</p>
                    <p className="text-sm text-gray-600">Pay when you receive your order</p>
                  </div>
                </label>

                <label className="flex items-center p-4 border rounded-lg cursor-pointer hover:bg-gray-50" onClick={() => setPaymentMethod('card')}>
                  <input
                    type="radio"
                    name="payment"
                    value="card"
                    checked={paymentMethod === 'card'}
                    onChange={(e) => setPaymentMethod(e.target.value as 'card')}
                    className="mr-3"
                  />
                  <div>
                    <p className="font-semibold">Credit / Debit Card</p>
                    <p className="text-sm text-gray-600">Visa, Mastercard, American Express</p>
                  </div>
                </label>

                <label className="flex items-center p-4 border rounded-lg cursor-pointer hover:bg-gray-50" onClick={() => setPaymentMethod('wallet')}>
                  <input
                    type="radio"
                    name="payment"
                    value="wallet"
                    checked={paymentMethod === 'wallet'}
                    onChange={(e) => setPaymentMethod(e.target.value as 'wallet')}
                    className="mr-3"
                  />
                  <div>
                    <p className="font-semibold">Digital Wallet</p>
                    <p className="text-sm text-gray-600">Use your wallet balance</p>
                  </div>
                </label>
              </div>
            </div>

            <div className="flex gap-3">
              <Button
                onClick={() => setShowPaymentModal(false)}
                variant="outline"
                className="flex-1"
                disabled={processingPayment}
              >
                Cancel
              </Button>
              <Button
                onClick={handlePayment}
                className="flex-1 bg-main hover:bg-main/90"
                disabled={processingPayment || !paymentMethod}
              >
                {processingPayment ? 'Processing...' : 'Pay Now'}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default CartPage