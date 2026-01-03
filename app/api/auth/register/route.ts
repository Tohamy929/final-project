import { NextRequest, NextResponse } from 'next/server';
import { registerscheme } from '@/scheme/register.scheme';
import { z } from 'zod';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    console.log('Register request body:', body);

    // Validate input
    const validatedData = registerscheme.parse(body);
    console.log('Validated data:', validatedData);
    
    const { name, email, password, phone } = validatedData;

    // Forward request to external API
    const response = await fetch('https://ecommerce.routemisr.com/api/v1/auth/signup', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name,
        email,
        password,
        phone,
      }),
    });

    const data = await response.json();
    console.log('External API response:', data);

    if (!response.ok) {
      return NextResponse.json(
        { success: false, error: data.message || 'Registration failed' },
        { status: response.status }
      );
    }

    return NextResponse.json(
      { success: true, message: 'User registered successfully', user: data.user },
      { status: 201 }
    );
  } catch (error) {
    console.error('Registration error:', error);

    if (error instanceof z.ZodError) {
      console.log('Zod validation error:', error.issues);
      return NextResponse.json(
        { success: false, error: error.issues[0].message },
        { status: 400 }
      );
    }

    if (error instanceof Error) {
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}