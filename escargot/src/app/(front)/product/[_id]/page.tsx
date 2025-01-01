"use client";

import { useEffect, useState, useCallback } from "react";
import Container from "@/components/Container";
import FormattedPrice from "@/components/FormatedPrice";
import { getProductById } from "@/helpers/getData";
import { ProductType } from "@/utils/types";
import Image from "next/image";
import { useStore } from "@/stores/store";
import { toast } from "react-hot-toast";
import styles from '@/components/Product.module.css';

const ProductPage = ({ params }: { params: { _id: string } }) => {
  const id = params._id;
  const [product, setProduct] = useState<ProductType | null>(null);
  const [loading, setLoading] = useState(true);
  const { addToCart, toggleFavorite, favorites } = useStore();

  const fetchProduct = async () => {
    if (id && !Array.isArray(id)) {
      try {
        setLoading(true);
        const data = await getProductById(Number(id));
        setProduct(data);
      } catch (error) {
        console.error("Échec du chargement du produit:", error);
        toast.error("Échec du chargement du produit. Veuillez réessayer.");
      } finally {
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    fetchProduct();
  }, [id]);

  const handleAddToCart = useCallback(() => {
    if (product) {
      addToCart(product);
      toast.success(`${product.name} ajouté au panier !`);
    }
  }, [product, addToCart]);

  const handleToggleFavorite = useCallback(() => {
    if (product) {
      toggleFavorite(product);
      if (favorites.some(fav => fav.id === product.id)) {
        toast.success(`${product.name} retiré des favoris !`);
      } else {
        toast.success(`${product.name} ajouté aux favoris !`);
      }
    }
  }, [product, toggleFavorite, favorites]);

  if (loading) {
    return <Container className="flex items-center justify-center h-screen">Chargement...</Container>;
  }

  if (!product) {
    return (
      <Container className="flex items-center justify-center h-screen">
        <p>Produit non trouvé.</p>
      </Container>
    );
  }

  const obtenirUrlImage = (imagePath: string) => {
    if (!imagePath) return "/placeholder.jpg"; 
    return imagePath.startsWith("http")
      ? imagePath
      : `https://res.cloudinary.com/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload/${imagePath}`; 
  };

  const imageUrl = obtenirUrlImage(product.imagePath);

  return (
    <Container className="flex items-center flex-col md:flex-row px-4 xl:px-0 py-10">
      <div className="w-full md:w-1/2 overflow-hidden bg-zinc-50 flex items-center justify-center p-10">
        <Image
          src={imageUrl}
          alt={product.name}
          width={500}
          height={500}
          className="transform transition-transform hover:scale-110 duration-500"
        />
      </div>
      <div className="w-full md:w-1/2 flex flex-col gap-4 mt-6 md:mt-0 md:pl-10">
        <h2 className="text-3xl font-semibold" style={{ color: 'var(--color-primary)' }}>{product.name}</h2>
        <p className="flex items-center gap-10">
          <FormattedPrice amount={product.price} className={`text-2xl font-semibold ${styles.textCustomColor}`} />
        </p>
        <button 
          onClick={handleAddToCart}
          className={`${styles.button} w-full md:w-auto`}
        >
          Ajouter au panier
        </button>
        <button 
          onClick={handleToggleFavorite}
          className={`${styles.favoriteButton} w-full md:w-auto`}
        >
          {favorites.some(fav => fav.id === product.id) ? 'Retirer des favoris' : 'Ajouter aux favoris'}
        </button>
        <p>
          Catégorie : <span className="font-semibold">{product.category.name}</span>
        </p>
        {/* Description divisée en paragraphes */}
        <div className={`${styles.description}`}>
          {product.description.split("\n").map((paragraph, index) => (
            <p key={index} className="mb-4">{paragraph}</p>
          ))}
        </div>
      </div>
    </Container>
  );
};

export default ProductPage;
