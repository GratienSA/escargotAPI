"use client";

import { notFound } from 'next/navigation';
import { getProductById, getCategories } from "@/helpers/getData";
import { PageHeader } from '@/components/admin/Header';
import { ProductForm } from '@/components/admin/ProductForm';
import { CategoryType, ProductType } from '@/utils/types'; 

export default async function EditProductPage({
  params: { id },
}: {
  params: { id: string }
}) {
  let product: ProductType | null;
  let categories: CategoryType[];

  try {
    product = await getProductById(Number(id));
    categories = await getCategories();
    
    if (!product) {
      notFound();
    }
  } catch (error) {
    console.error("Erreur lors de la récupération du produit ou des catégories :", error);
    notFound();
  }

  return (
    <>
      <PageHeader>Modifier le produit</PageHeader>
      <ProductForm type="Update" product={product} categories={categories} />
    </>
  );
}
