import { ProductForm } from "@/components/admin/ProductForm"
import { PageHeader } from "@/components/admin/Header"

export default function NewProductPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <PageHeader>Add Product</PageHeader>
      <ProductForm/>
    </div>
  )
}