"use client";

import React from "react";
import DeleteDialog from "@/components/shared/delete-dialog";
import Pagination from "@/components/shared/pagination";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { getAllProducts } from "@/helpers/getData";
import { deleteProduct } from "@/helpers/PostUpadateDeleteProducts";
import Link from "next/link";
import { formatCurrency, ProductType } from "@/utils/types";

export default async function AdminProductsPage({
  searchParams,
}: {
  searchParams: {
    page: string;
    query: string;
    category: string;
  };
}) {
  const page = Number(searchParams.page) || 1;
  const searchText = searchParams.query || "";
  const category = searchParams.category || "";

  let products;

  try {
    products = await getAllProducts({
      query: searchText,
      category,
      skip: (page - 1) * 24,
      limit: 24,
    });
  } catch (error) {
    console.error("Erreur lors de la récupération des produits:", error);
    products = { data: [], totalPages: 0 };
  }

  return (
    <div className="space-y-2">
      <div className="flex-between">
        <h1 className="h2-bold">Produits</h1>
        <Button asChild variant="default">
          <Link href="/admin/products/create">Créer un produit</Link>
        </Button>
      </div>
      <div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>NOM</TableHead>
              <TableHead className="text-right">PRIX</TableHead>
              <TableHead>CATEGORIE</TableHead>
              <TableHead>STOCK</TableHead>
              <TableHead>NOTE</TableHead>
              <TableHead className="w-[100px]">ACTIONS</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {products?.data.map((product: ProductType) => (
              <TableRow key={product.id}>
                <TableCell>{String(product.id)}</TableCell>
                <TableCell>{String(product.name)}</TableCell>
                <TableCell className="text-right">
                  {formatCurrency(product.price)}
                </TableCell>
                {/* Vérifiez si product.category est une chaîne ou un objet */}
                <TableCell>{typeof product.category === 'string' ? product.category : 'N/A'}</TableCell> 
                {/* Vérifiez si inventory est défini et accédez à quantity */}
                <TableCell>{typeof product.inventory === 'number' ? product.inventory : '0'}</TableCell> 
                {/* Affichage de la note */}
                <TableCell>{product.averageRating?.toFixed(1) || "N/A"}</TableCell>
                <TableCell className="flex gap-1">
                  <Button asChild variant="outline" size="sm">
                    <Link href={`/admin/products/edit/${product.id}`}>
                      Modifier
                    </Link>
                  </Button>
                  <DeleteDialog id={product.id} action={deleteProduct} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        {products && products.totalPages > 1 && (
          <Pagination page={page} totalPages={products.totalPages} />
        )}
      </div>
    </div>
  );
}
