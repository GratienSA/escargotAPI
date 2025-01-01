import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import UpdateUserForm from './update-user-form'
import { APP_NAME } from '@/lib/constants/index'
import { getUserById } from '@/helpers/auth'
import { UserType } from '@/utils/types'

export const metadata: Metadata = {
  title: `Update user - ${APP_NAME}`,
}

export default async function UpdateUserPage({
  params,
}: {
  params: {
    id: string 
  }
}) {
  const userId = parseInt(params.id, 10); 
  const user: UserType | null = await getUserById(userId); 
  
  if (!user) {
    notFound(); 
    return null; 
  }

  const formData = {
    id: user.id,
    email: user.email,
    firstName: user.firstName, 
    lastName: user.lastName, 
    role: user.role, 
   
  };

  return (
    <div className="space-y-8 max-w-lg mx-auto">
      <h1 className="h2-bold">Mettre à jour l'utilisateur</h1>
      <UpdateUserForm user={formData} />
    </div>
  )
}