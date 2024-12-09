"use client"

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ThemeToggle } from '@/components/ui/theme-toggle'
import { toast } from 'react-toastify'
import Link from 'next/link'
import { Login } from '@/services/authService'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const body: { email: string, password: string } = { email, password };
    const response = await Login(body)
    if (response) {
      localStorage.setItem('token', response.token)
      toast.success('Logged in successfully!')
      router.push('/todos')
    } else {
      toast.error(response)
    }

  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background">
      <Card className="w-[350px]">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Login</CardTitle>
          <ThemeToggle />
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <Button type="submit" className="w-full">
              Login
            </Button>
          </form>
          <div className="mt-4 text-center">
            <Link href="/register" className="text-sm text-primary hover:underline">
              Don`t have an account? Register
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

