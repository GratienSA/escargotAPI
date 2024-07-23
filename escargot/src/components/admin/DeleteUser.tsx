"use client"

import { useState } from "react";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { useRouter } from "next/navigation";
import toast from 'react-hot-toast';
import { deleteUser } from "@/helpers/auth";

export function DeleteDropDownItem({ id }: { id: number }) {
  const [isPending, setIsPending] = useState(false);
  const router = useRouter();

  const handleDelete = async () => {
    if (isPending) return;

    setIsPending(true);
    try {
      await deleteUser(id);
      toast.success('User deleted successfully');
      router.refresh();
    } catch (error) {
      console.error('Error deleting user:', error);
      toast.error('Failed to delete user');
    } finally {
      setIsPending(false);
    }
  };

  return (
    <DropdownMenuItem
      className="text-red-600 focus:bg-red-50 cursor-pointer"
      disabled={isPending}
      onClick={handleDelete}
    >
      {isPending ? "Deleting..." : "Delete"}
    </DropdownMenuItem>
  );
}