'use client'

import { Button } from '@/components/ui/button'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { resetPasswordScheme, ResetPasswordSchemeValidation } from '@/scheme/password.scheme'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter, useSearchParams } from 'next/navigation'
import React, { useState, Suspense } from 'react'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import Link from 'next/link'

const API = process.env.NEXT_PUBLIC_API || 'https://ecommerce.routemisr.com/api/v1/'

// ✅ Wrap the part that uses useSearchParams in a Suspense boundary
function ResetPasswordContent() {
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const searchParams = useSearchParams()

  const code = searchParams?.get('code') || ''
  const email = searchParams?.get('email') || ''

  const form = useForm<ResetPasswordSchemeValidation>({
    resolver: zodResolver(resetPasswordScheme),
    defaultValues: {
      newPassword: '',
      confirmPassword: '',
    },
  })

  const onSubmit = async (data: ResetPasswordSchemeValidation) => {
    if (!code || !email) {
      toast.error('Invalid reset link')
      return
    }

    setLoading(true)
    try {
      const response = await fetch(`${API}auth/resetPassword`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, newPassword: data.newPassword, code }),
      })

      const result = await response.json()

      if (!response.ok) {
        toast.error(result.message || 'Failed to reset password')
        return
      }

      toast.success('Password reset successful! Redirecting to login...')
      setTimeout(() => router.push('/login'), 1500)
    } catch (error) {
      console.error('Reset password error:', error)
      toast.error('An error occurred')
    } finally {
      setLoading(false)
    }
  }

  if (!code || !email) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8 text-center">
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">Invalid reset link</h2>
          <p className="mt-2 text-sm text-gray-600">
            This password reset link is invalid or has expired.
          </p>
          <Link href="/forgotpassword" className="inline-block">
            <Button type="button" className="w-full bg-main hover:bg-main/90">
              Request New Reset Link
            </Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">Create new password</h2>
        <p className="mt-2 text-center text-sm text-gray-600">Enter your new password below.</p>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="mt-8 space-y-6">
            <FormField
              control={form.control}
              name="newPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>New Password</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="••••••••" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Confirm Password</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="••••••••" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" className="w-full bg-main hover:bg-main/90" disabled={loading}>
              {loading ? 'Resetting...' : 'Reset Password'}
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

// ✅ Export with Suspense wrapper
export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ResetPasswordContent />
    </Suspense>
  )
}