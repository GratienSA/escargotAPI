"use client"

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { getUserProfile } from '@/helpers/auth'
import ModeToggle from './mode-toggle'
import { useRouter } from 'next/navigation'
import { UserType } from '@/utils/types'


export default function UserButton() {
  const [user, setUser] = useState<UserType | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const userData = await getUserProfile()
        setUser(userData)
      } catch (error) {
        console.error('Failed to fetch user profile:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchUser()
  }, [])

  const handleSignOut = () => {
    localStorage.removeItem('token')
    setUser(null)
    router.push('/')
  }

  if (loading) {
    return <div>Loading...</div>
  }

  if (!user) {
    return (
      <Link href="/signin">
        <Button>Sign In</Button>
      </Link>
    )
  }

  return (
    <div className="flex gap-2 items-center">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <div className="flex items-center">
            <Button
              variant="ghost"
              className="relative w-8 h-8 rounded-full ml-2"
            >
              {user.firstName}
            </Button>
          </div>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56" align="end" forceMount>
          <DropdownMenuLabel className="font-normal">
            <div className="flex flex-col space-y-1">
              <p className="text-sm font-medium leading-none">
                {`${user.firstName} ${user.lastName}`}
              </p>
              <p className="text-xs leading-none text-muted-foreground">
                {user.email}
              </p>
            </div>
          </DropdownMenuLabel>

          <DropdownMenuItem>
            <Link className="w-full" href="/user/profile">
              Profile
            </Link>
          </DropdownMenuItem>

          <DropdownMenuItem>
            <Link className="w-full" href="/user/orders">
              Order History
            </Link>
          </DropdownMenuItem>

          {user.role === 'admin' && (
            <DropdownMenuItem>
              <Link className="w-full" href="/admin/overview">
                Admin
              </Link>
            </DropdownMenuItem>
          )}

          <DropdownMenuItem className="p-0 mb-1">
            <Button
              className="w-full py-4 px-2 h-4 justify-start"
              variant="ghost"
              onClick={handleSignOut}
            >
              Sign Out
            </Button>
          </DropdownMenuItem>
          <ModeToggle />
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}