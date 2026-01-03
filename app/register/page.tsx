'use client'

import { Button } from '@/components/ui/button'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { registerscheme, registerSchemeValidation } from '@/scheme/register.scheme'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'
import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'

export default function RegisterPage() {
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const form = useForm<registerSchemeValidation>({
    resolver: zodResolver(registerscheme),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      rePassword: '',
      phone: '',
    },
  })

  const onSubmit = async (data: registerSchemeValidation) => {
    setLoading(true)
    try {
      // Send all required fields including rePassword
      const payload = {
        name: data.name,
        email: data.email,
        password: data.password,
        rePassword: data.rePassword,
      }

      console.log('Sending payload:', payload)

      const response = await fetch('https://ecommerce.routemisr.com/api/v1/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      })

      const result = await response.json()
      console.log('Full API Response:', JSON.stringify(result, null, 2))

      if (!response.ok) {
        // Log detailed error info
        console.error('API Error Details:', result.errors)
        const errorMessages = result.errors 
          ? Object.values(result.errors).flat().join(', ')
          : result.message || 'Registration failed'
        toast.error(errorMessages)
        return
      }

      toast.success('Registration successful! Redirecting to login...')
      setTimeout(() => {
        router.push('/login')
      }, 1500)
    } catch (error) {
      console.error('Registration error:', error)
      toast.error('An error occurred during registration')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Create your account
          </h2>
        </div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="mt-8 space-y-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="John Doe" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

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

            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Phone</FormLabel>
                  <FormControl>
                    <Input placeholder="+201001234567" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="••••••••" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="rePassword"
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

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? 'Creating account...' : 'Sign up'}
            </Button>
          </form>
        </Form>

        <p className="mt-2 text-center text-sm text-gray-600">
          Already have an account?{' '}
          <a href="/login" className="font-medium text-blue-600 hover:text-blue-500">
            Sign in
          </a>
        </p>
      </div>
    </div>
  )
}