'use client'

import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useToast } from '@/components/ui/use-toast'
import { updateUserProfile } from '@/helpers/auth'
import { USER_ROLES } from '@/lib/constants/index'
import { UpdateUserFormProps } from '@/utils/types'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'

// Utilisez le nouveau type ici
export default function UpdateUserForm({ user }: { user: UpdateUserFormProps }) {
  const router = useRouter()
  const { toast } = useToast()

  const form = useForm<UpdateUserFormProps>({
    defaultValues: user,
  })

  async function onSubmit(values: UpdateUserFormProps) {
    try {
      const res = await updateUserProfile({
        ...values,
        id: user.id, 
      })

      if (!res.success) {
        return toast({
          variant: 'destructive',
          description: res.message,
        })
      }

      toast({
        description: res.message,
      })

      form.reset()
      router.push(`/admin/users`)
    } catch (error: any) {
      toast({
        variant: 'destructive',
        description: error.message || 'Une erreur est survenue',
      })
    }
  }

  return (
    <Form {...form}>
      <form method="post" onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        {/* Champ email */}
        <div>
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input disabled placeholder="Entrez l'email de l'utilisateur" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Champ prénom */}
        <div>
          <FormField
            control={form.control}
            name="firstName"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>Prénom</FormLabel>
                <FormControl>
                  <Input placeholder="Entrez le prénom de l'utilisateur" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Champ rôle */}
        <div>
          <FormField
            control={form.control}
            name="role"
            render={({ field }) => (
              <FormItem className="items-center">
                <FormLabel>Rôle</FormLabel>
                <Select onValueChange={field.onChange} value={field.name || ''}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionnez un rôle" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {USER_ROLES.map((role) => (
                      <SelectItem key={role} value={role}>
                        {role}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Bouton de soumission */}
        <div className="flex-between">
          <Button type="submit" className="w-full" disabled={form.formState.isSubmitting}>
            {form.formState.isSubmitting ? 'Soumission...' : `Mettre à jour l'utilisateur`}
          </Button>
        </div>
      </form>
    </Form>
  )
}