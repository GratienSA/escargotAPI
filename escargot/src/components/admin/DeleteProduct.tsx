"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuTrigger,
  DropdownMenuItem,
  DropdownMenuSeparator
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import toast from 'react-hot-toast' 
import { deleteProduct } from "@/helpers/PostUpadateDeleteProducts"
import { ProductType } from "@/utils/types" 

interface DeleteDropdownItemProps {
  id: number;
  name: string;
  disabled: boolean;
  onDeleteSuccess?: () => void;
}

function DeleteDropdownItem({ id, name, disabled, onDeleteSuccess }: DeleteDropdownItemProps) {
  const [isPending, setIsPending] = useState(false)
  const router = useRouter()

  const handleDelete = async () => {
    if (disabled || isPending) return;

    setIsPending(true)
    try {
      await deleteProduct(id);
      toast.success(`${name} deleted successfully`); 
      router.refresh();
      onDeleteSuccess?.();
    } catch (error) {
      console.error('Error deleting product:', error);
      toast.error(`Failed to delete ${name}`);
    } finally {
      setIsPending(false)
    }
  }

  return (
    <DropdownMenuItem
      className="text-red-600 focus:bg-red-50 cursor-pointer"
      disabled={disabled || isPending}
      onClick={handleDelete}
    >
      {isPending ? "Deleting..." : "Delete"}
    </DropdownMenuItem>
  )
}

interface DeleteProductProps {
  product: ProductType;
}

export function DeleteProduct({ product }: DeleteProductProps) {
  const router = useRouter()

  const handleViewDetails = () => {
    router.push(`/admin/products/${product.id}`)
  }

  const handleEdit = () => {
    router.push(`/admin/products/edit/${product.id}`)
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0">
          <span className="sr-only">Open menu</span>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
            <path d="M10 3a1.5 1.5 0 110 3 1.5 1.5 0 010-3zM10 8.5a1.5 1.5 0 110 3 1.5 1.5 0 010-3zM11.5 15.5a1.5 1.5 0 10-3 0 1.5 1.5 0 003 0z" />
          </svg>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={handleViewDetails}>
          View Details
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleEdit}>
          Edit
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DeleteDropdownItem 
          id={product.id}
          name={product.name}
          disabled={false} 
          onDeleteSuccess={() => router.refresh()}
        />
      </DropdownMenuContent>
    </DropdownMenu>
  )
}