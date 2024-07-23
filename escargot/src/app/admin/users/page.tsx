"use client"

import { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { PageHeader } from "@/components/admin/Header";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreVertical } from "lucide-react";
import { UserType } from "@/utils/types";
import Image from "next/image";
import toast from "react-hot-toast";
import { getAllUsers } from "@/helpers/auth";
import { DeleteDropDownItem } from "@/components/admin/DeleteUser";

export default function UsersPage() {
  const [users, setUsers] = useState<UserType[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchUsers() {
      setIsLoading(true);
      try {
        const data = await getAllUsers();
        setUsers(data);
      } catch (error) {
        console.error("Failed to fetch users:", error);
        toast.error("Failed to load users. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    }

    fetchUsers();
  }, []);

  return (
    <>
      <PageHeader>Customers</PageHeader>
      {isLoading ? (
        <p>Loading users...</p>
      ) : (
        <UsersTable users={users} />
      )}
    </>
  );
}

function UsersTable({ users }: { users: UserType[] }) {
  if (users.length === 0) return <p>No customers found</p>;


  const formatDate = (date: Date | string | null): string => {
    if (!date) return 'Never';
    if (typeof date === 'string') return date;
    return new Date(date).toLocaleString();
  };

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Picture</TableHead>
          <TableHead>Name</TableHead>
          <TableHead>Email</TableHead>
          <TableHead>Phone</TableHead>
          <TableHead>City</TableHead>
          <TableHead>Last Login</TableHead>
          <TableHead>Status</TableHead>
          <TableHead className="w-0">
            <span className="sr-only">Actions</span>
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {users.map((user) => (
          <TableRow key={user.id}>
            <TableCell>
              {user.picture && (
                <Image 
                  src={user.picture} 
                  alt={`${user.firstName} ${user.lastName}`} 
                  width={40} 
                  height={40} 
                  className="rounded-full"
                />
              )}
            </TableCell>
            <TableCell>{`${user.firstName} ${user.lastName}`}</TableCell>
            <TableCell>{user.email}</TableCell>
            <TableCell>{user.phone}</TableCell>
            <TableCell>{user.city}</TableCell>
            <TableCell>{formatDate(user.lastLoginAt)}</TableCell>
            <TableCell>{user.isActive ? 'Active' : 'Inactive'}</TableCell>
            <TableCell className="text-center">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="h-8 w-8 p-0">
                    <MoreVertical className="h-4 w-4" />
                    <span className="sr-only">Actions</span>
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DeleteDropDownItem id={user.id} />
                </DropdownMenuContent>
              </DropdownMenu>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}