'use client'

import { cn } from '@/lib/utils'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import React from 'react'

const liens = [
  {
    titre: 'Aperçu Général',
    href: '/admin/overview',
  },
  {
    titre: 'Produits',
    href: '/admin/products',
  },
  {
    titre: 'Commandes',
    href: '/admin/orders',
  },
  {
    titre: 'Utilisateurs',
    href: '/admin/users',
  },
  {
    titre: 'Categories',
    href: '/admin/categories',
  },
]

export default function NavigationPrincipale({
  className,
  ...props
}: React.HTMLAttributes<HTMLElement>) {
  const cheminActuel = usePathname()
  return (
    <nav
      className={cn('flex items-center space-x-4 lg:space-x-6', className)}
      {...props}
    >
      {liens.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className={cn(
            'text-sm font-medium transition-colors hover:text-primary',
            cheminActuel.includes(item.href) ? '' : 'text-muted-foreground'
          )}
        >
          {item.titre}
        </Link>
      ))}
    </nav>
  )
}