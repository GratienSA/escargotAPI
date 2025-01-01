"use client"
import { PageHeader } from "@/components/admin/Header"
import { ProductForm } from "@/components/admin/ProductForm"


export default function NewProductPage() {
  return (
    <div className=" p-4">
      <PageHeader>Ajouter</PageHeader>
      <ProductForm type={"Create"}/>
    </div>
  )
} 