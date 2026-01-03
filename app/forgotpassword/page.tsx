'use client'

import { Button } from '@/components/ui/button'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { forgotPasswordScheme, ForgotPasswordSchemeValidation } from '@/scheme/password.scheme'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'
import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import Link from 'next/link'

const API = process.env.NEXT_PUBLIC_API || 'https://ecommerce.routemisr.com/api/v1/'

export default function ForgotPasswordPage() {
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)
  const router = useRouter()

  const form = useForm<ForgotPasswordSchemeValidation>({
    resolver: zodResolver(forgotPasswordScheme),
    defaultValues: {
      email: '',
    },
  })

  const onSubmit = async (data: ForgotPasswordSchemeValidation) => {
    setLoading(true)
    try {
      const response = await fetch(`${API}auth/forgotPasswords`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: data.email }),
      })

      const result = await response.json()

      if (!response.ok) {
        toast.error(result.message || 'Failed to send reset email')
        return
      }

      setSent(true)
      toast.success('Reset code sent to your email')
    } catch (error) {
      console.error('Forgot password error:', error)
      toast.error('An error occurred')
    } finally {
      setLoading(false)
    }
  }

  if (sent) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8 text-center">
          <div>
            <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
              Check your email
            </h2>
            <p className="mt-2 text-center text-sm text-gray-600">
              We've sent a password reset code to your email address.
            </p>
            <p className="mt-4 text-center text-sm text-gray-600">
              Click the link in the email to reset your password.
            </p>
          </div>

          <Link href="/login" className="inline-block">
            <Button type="button" className="w-full bg-main hover:bg-main/90">
              Back to Login
            </Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Reset your password
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Enter your email address and we'll send you a code to reset your password.
          </p>
        </div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="mt-8 space-y-6">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input type="email" placeholder="your@email.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" className="w-full bg-main hover:bg-main/90" disabled={loading}>
              {loading ? 'Sending...' : 'Send Reset Code'}
            </Button>
          </form>
        </Form>

        <p className="mt-2 text-center text-sm text-gray-600">
          Remember your password?{' '}
          <Link href="/login" className="font-medium text-blue-600 hover:text-blue-500">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  )
}
