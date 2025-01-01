"use client"

import { useEffect, useState } from 'react'
import { redirect } from 'next/navigation'
import { getUserProfile } from '@/helpers/auth'
import ProfileForm from './profile-form'

export default function ProfilePage() {
  const [user, setUser] = useState<any>(null) 
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const userData = await getUserProfile() 
        setUser(userData)
      } catch (error) {
        console.error('Échec de la récupération du profil utilisateur:', error)
        redirect('/signin') 
      } finally {
        setLoading(false)
      }
    }

    fetchUserProfile()
  }, [])

  if (loading) {
    return <div>Chargement...</div> 
  }

  if (!user) {
    redirect('/signin') 
    return null; 
  }

  return (
    <div className="max-w-md mx-auto space-y-4">
      <h2 className="h2-bold">Profil</h2>
      <ProfileForm user={user} /> 
    </div>
  )
}