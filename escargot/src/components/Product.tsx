"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Heart } from "lucide-react";
import toast, { Toaster } from "react-hot-toast";
import { ProductType } from "@/utils/types";
import { useStore } from "@/stores/store";
import FormattedPrice from "./FormatedPrice";

interface Item {
  products: ProductType[];
}

const Product: React.FC<Item> = React.memo(({ products }: Item) => {
  const { addToCart, toggleFavorite, favorites } = useStore();

  if (!Array.isArray(products)) {
    console.error("Products is not an array:", products);
    return <div>No products available</div>;
  }

  const isFavorite = (productId: number): boolean => {
    return favorites.some((favoriteItem) => favoriteItem.id === productId);
  };

  const handleAddToCart = (product: ProductType) => {
    addToCart(product);
    toast.success(`${product.name} added to cart!`);
  };

  const handleToggleFavorite = (product: ProductType) => {
    toggleFavorite(product);
    if (isFavorite(product.id)) {
      toast.error(`${product.name} removed from favorites!`);
    } else {
      toast.success(`${product.name} added to favorites!`);
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
      <Toaster />
      {products.map((product) => {
        if (!product.imagePath) {
          console.error("Missing imagePath for product:", product);
        }

        return (
          <div
            key={product.id}
            className="bg-white rounded-lg shadow-md overflow-hidden flex flex-col"
          >
            <Link href={`/product/${product.id}`}>
              <Image
                src={`${process.env.NEXT_PUBLIC_NEST_API_URL}/${product.imagePath}`}
                alt={product.name}
                width={500}
                height={300}
                className="object-cover w-full h-48"
                loading="lazy"
                onError={(e) => {
                  e.currentTarget.src = "/placeholder-image.jpg";
                }}
              />
            </Link>
            <div className="p-4 flex-1 flex flex-col">
              <div className="flex-1">
                <Link href={`/product/${product.id}`}>
                  <h3 className="text-xl font-semibold text-gray-800">
                    {product.name}
                  </h3>
                </Link>
                <p className="text-gray-600">{product.description}</p>
              </div>
              <div className="mt-4">
                <FormattedPrice price={product.price} amount={0} />
              </div>
              <div className="flex justify-between items-center mt-4">
                <button
                  onClick={() => handleAddToCart(product)}
                  className="bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 transition duration-200"
                  aria-label={`Add ${product.name} to cart`}
                >
                  Add to Cart
                </button>
                <button
                  onClick={() => handleToggleFavorite(product)}
                  className="text-green-600 hover:text-green-700 transition duration-200"
                  aria-label={`${isFavorite(product.id) ? 'Remove from' : 'Add to'} favorites`}
                >
                  <Heart className={isFavorite(product.id) ? 'fill-current' : ''} />
                </button>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
});

Product.displayName = "Product";

export default Product;
