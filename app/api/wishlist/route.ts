import { NextRequest, NextResponse } from 'next/server'

const API = process.env.NEXT_PUBLIC_API || 'https://ecommerce.routemisr.com/api/v1/'

export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get('Authorization')
    const token = request.headers.get('x-access-token') || authHeader?.replace('Bearer ', '')

    if (!token) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
    }

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

    if (!response.ok) {
      return NextResponse.json(data, { status: response.status })
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error('Wishlist GET error:', error)
    return NextResponse.json(
      { message: 'Failed to fetch wishlist' },
      { status: 500 }
    )
  }
}

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

    const response = await fetch(`${API}wishlist`, {
      method: 'POST',
      headers,
      body: JSON.stringify(body),
    })

    const data = await response.json()

    if (!response.ok) {
      return NextResponse.json(data, { status: response.status })
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error('Wishlist POST error:', error)
    return NextResponse.json(
      { message: 'Failed to add to wishlist' },
      { status: 500 }
    )
  }
}
