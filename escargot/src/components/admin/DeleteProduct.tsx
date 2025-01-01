"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { 
  DropdownMenuItem 
} from "@/components/ui/dropdown-menu";
import toast from 'react-hot-toast'; 
import { deleteProduct } from "@/helpers/PostUpadateDeleteProducts";
import { jwtDecode } from 'jwt-decode'; 
import { ProductType } from "@/utils/types"; 

interface DeleteProductProps {
  product: ProductType;
}

export function DeleteProduct({ product }: DeleteProductProps) {
  const router = useRouter();
  const [isPending, setIsPending] = useState(false);

  const handleDelete = async () => {
    if (isPending) return;

    const token = localStorage.getItem('token');
    if (!token) {
      toast.error("You must be logged in to delete a product.");
      return;
    }

    let decodedToken;
    try {
      decodedToken = jwtDecode(token);
    } catch (error) {
      toast.error("Invalid token.");
      return;
    }

    if (!decodedToken.sub || !decodedToken.sub.includes('admin')) {
      toast.error("You do not have permission to delete this product.");
      return;
    }

    setIsPending(true);
    try {
      await deleteProduct(product.id);
      toast.success(`${product.name} deleted successfully`); 
      router.refresh();
    } catch (error) {
      console.error('Error deleting product:', error);
      toast.error(`Failed to delete ${product.name}`);
    } finally {
      setIsPending(false);
    }
  };

  return (
    <DropdownMenuItem
      onClick={handleDelete}
      disabled={isPending}
      className={`text-red-600 cursor-pointer hover:bg-red-50 ${isPending ? 'opacity-50' : ''}`}
    >
      {isPending ? "Deleting..." : "Delete"}
    </DropdownMenuItem>
  );
}
