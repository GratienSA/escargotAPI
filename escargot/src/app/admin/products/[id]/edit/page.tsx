import { notFound } from 'next/navigation';
import { getProductById, getCategories } from "@/helpers/getData";
import { PageHeader } from '@/components/admin/Header';
import { ProductForm } from '@/components/admin/ProductForm';


export default async function EditProductPage({
  params: { id },
}: {
  params: { id: string }
}) {
  const product = await getProductById(Number(id));
  const categories = await getCategories();

  if (!product) {
    notFound();
  }

  return (
    <>
      <PageHeader>Edit Product</PageHeader>
      <ProductForm product={product} categories={categories} />
    </>
  );
}