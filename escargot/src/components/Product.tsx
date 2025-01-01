"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Heart } from "lucide-react";
import toast, { Toaster } from "react-hot-toast";
import { ProductType } from "@/utils/types";
import { useStore } from "@/stores/store";
import FormattedPrice from "./FormatedPrice";
import styles from './Product.module.css';

interface Item {
  products: ProductType[];
}

const Product: React.FC<Item> = React.memo(({ products }: Item) => {
  const { addToCart, toggleFavorite, favorites } = useStore();

  console.log("Rendu du composant Produit avec les produits:", products);

  if (!Array.isArray(products)) {
    console.error("Les produits ne sont pas un tableau:", products);
    return <div>Aucun produit disponible</div>;
  }

  const estFavori = (productId: number): boolean => {
    return favorites.some((favoriteItem) => favoriteItem.id === productId);
  };

  const gererAjoutPanier = (product: ProductType) => {
    addToCart(product);
    toast.success(`${product.name} ajouté au panier !`);
  };

  const gererBasculeFavori = (product: ProductType) => {
    toggleFavorite(product);
    if (estFavori(product.id)) {
      toast.error(`${product.name} retiré des favoris !`);
    } else {
      toast.success(`${product.name} ajouté aux favoris !`);
    }
  };

  const obtenirUrlImage = (imagePath: string) => {
    if (!imagePath) return "/placeholder.jpg"; 
    return imagePath.startsWith("http")
      ? imagePath
      : `https://res.cloudinary.com/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload/${imagePath}`; 
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
      <Toaster />
      {products.map((product) => {
        const imageUrl = obtenirUrlImage(product.imagePath);
  
        return (
          <div key={product.id} className={`${styles.card} bg-white rounded-lg shadow-md overflow-hidden flex flex-col`}>
            <Link href={`/product/${product.id}`}>
              <Image
                src={imageUrl}
                alt={product.name}
                width={500}
                height={300}
                className="object-cover w-full h-80"
                loading="lazy"
                unoptimized
                onError={(e) => {
                  e.currentTarget.src = "/placeholder.jpg"; 
                }}
              />
            </Link>
            <div className="p-4 flex-1 flex flex-col">
              <div className="flex-1">
                <Link href={`/product/${product.id}`}>
                  <h3 className="text-xl font-semibold text-gray-800 hover:text-var(--color-secondary)">
                    {product.name}
                  </h3>
                </Link>
                <p className="text-gray-600">
                  <span className={styles.price}>
                    <FormattedPrice price={product.price} amount={0} />
                  </span>
                </p>
              </div>
              <div className="flex justify-between items-center mt-4">
                <button
                  onClick={() => gererAjoutPanier(product)}
                  className={styles.button}
                  aria-label={`Ajouter ${product.name} au panier`}
                >
                  Ajouter au panier
                </button>
                <button
                  onClick={() => gererBasculeFavori(product)}
                  className="text-amber-500 hover:text-amber-700 transition duration-200"
                  aria-label={`${
                    estFavori(product.id) ? "Retirer des" : "Ajouter aux"
                  } favoris`}
                >
                  <Heart
                    className={estFavori(product.id) ? "fill-current" : ""}
                  />
                </button>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
  
});

Product.displayName = "Produit";

export default Product;
