import { NextRequest, NextResponse } from 'next/server'

const API = process.env.NEXT_PUBLIC_API || 'https://ecommerce.routemisr.com/api/v1/'

// Handle cash on delivery payment
export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get('Authorization')
    const token = request.headers.get('x-access-token') || authHeader?.replace('Bearer ', '')

    if (!token) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    }
    if (token) {
      headers['Authorization'] = `Bearer ${token}`
      headers['x-access-token'] = token
      headers['token'] = token
    }

    // Call the external API for cash on delivery
    const response = await fetch(`${API}orders`, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        ...body,
        paymentMethodType: 'cash',
      }),
    })

    const data = await response.json()

    if (!response.ok) {
      return NextResponse.json(data, { status: response.status })
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error('Cash payment error:', error)
    return NextResponse.json(
      { message: 'Failed to process payment' },
      { status: 500 }
    )
  }
}
