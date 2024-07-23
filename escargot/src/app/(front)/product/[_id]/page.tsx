"use client";

import { useEffect, useState, useCallback } from "react";
import Container from "@/components/Container";
import FormattedPrice from "@/components/FormatedPrice";
import { getProductById } from "@/helpers/getData";
import { ProductType } from "@/utils/types";
import Image from "next/image";
import { useStore } from "@/stores/store";
import { toast } from "react-hot-toast";

const ProductPage = ({params}: {params:any}) => {
  console.log(params)
 const id = params._id;
  const [product, setProduct] = useState<ProductType | null>(null);
  const [loading, setLoading] = useState(true);
  const { addToCart, toggleFavorite, favorites } = useStore();
  const fetchProduct = async () => {
    console.log({id})

    if (id && !Array.isArray(id)) {
      try {
        setLoading(true);
        console.log('Fetching product with ID:', id);
        const data = await getProductById(Number(id));
        console.log('Product fetched:', data);
        setProduct(data);
      } catch (error) {
        console.error("Failed to fetch product:", error);
        toast.error("Failed to load product. Please try again.");
      } finally {
        setLoading(false);
      }
    }
  };


  useEffect(() => {
   
    fetchProduct();
  }, []);

  const handleAddToCart = useCallback(() => {
    if (product) {
      addToCart(product);
      toast.success(`${product.name} added to cart!`);
    }
  }, [product, addToCart]);

  const handleToggleFavorite = useCallback(() => {
    if (product) {
      toggleFavorite(product);
      if (favorites.some(fav => fav.id === product.id)) {
        toast.success(`${product.name} added to favorites!`);
      } else {
        toast.success(`${product.name} removed from favorites!`);
      }
    }
  }, [product, toggleFavorite, favorites]);

  if (loading) {
    return <Container className="flex items-center justify-center h-screen">Loading...</Container>;
  }

  if (!product) {
    return (
      <Container className="flex items-center justify-center h-screen">
        <p>Product not found.</p>
      </Container>
    );
  }

  return (
    <Container className="flex items-center flex-col md:flex-row px-4 xl:px-0 py-10">
      <div className="w-full md:w-1/2 overflow-hidden bg-zinc-50 flex items-center justify-center p-10">
        <Image
          src={`${process.env.NEXT_PUBLIC_NEST_API_URL}/${product.imagePath}`}
          alt={product.name}
          width={500}
          height={500}
          className="transform transition-transform hover:scale-110 duration-500"
        />
      </div>
      <div className="w-full md:w-1/2 flex flex-col gap-4 mt-6 md:mt-0 md:pl-10">
        <h2 className="text-3xl font-semibold">{product.name}</h2>
        <p className="flex items-center gap-10">
          <FormattedPrice amount={product.price} className="text-2xl font-semibold text-green-600" />
        </p>
        <button 
          onClick={handleAddToCart}
          className="bg-green-600 text-white px-6 py-3 font-medium rounded-md hover:bg-green-700 cursor-pointer duration-200 hover:shadow-lg w-full md:w-48"
        >
          Add to Cart
        </button>
        <button 
          onClick={handleToggleFavorite}
          className="bg-gray-200 text-gray-800 px-6 py-3 font-medium rounded-md hover:bg-gray-300 cursor-pointer duration-200 hover:shadow-lg w-full md:w-48"
        >
          {favorites.some(fav => fav.id === product.id) ? 'Remove from Favorites' : 'Add to Favorites'}
        </button>
        <p>
          Category: <span className="font-semibold">{product.category.name}</span>
        </p>
        <p className="text-gray-600">{product.description}</p>
      </div>
    </Container>
  );
};

export default ProductPage;
