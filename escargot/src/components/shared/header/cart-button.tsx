"use client"

import { ShoppingCart } from 'lucide-react'
import Link from 'next/link'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { useStore } from '@/stores/store'

export default function CartButton() {
  const products = useStore((state) => state.products)

  const cartItemsCount = products.reduce((sum, item) => sum + item.quantity, 0)

  return (
    <Button asChild variant="ghost">
      <Link href="/cart">
        <ShoppingCart className="mr-1" />
        Cart
        {cartItemsCount > 0 && (
          <Badge className="ml-1">
            {cartItemsCount}
          </Badge>
        )}
      </Link>
    </Button>
  )
}