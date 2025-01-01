"use client";

import React, { useState, useEffect } from 'react';
import ProductList from '@/components/ProductList';
import { generateNavigation } from '@/constant/data';
import Footer from '@/components/Footer';

const PreparedSnailsPage = () => {
  const [category, setCategory] = useState<{ _id: number; name: string; href: string } | undefined>(undefined);
  const [loading, setLoading] = useState(true);
  const categoryId = 2

  useEffect(() => {
    const fetchNavigation = async () => {
      setLoading(true);
      try {
        const nav = await generateNavigation();
        const foundCategory = nav.find((item) => item._id === categoryId);
        console.log("Catégorie trouvée:", foundCategory); // Log de la catégorie trouvée
        setCategory(foundCategory);
      } catch (error) {
        console.error("Erreur lors de la récupération de la navigation:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchNavigation();
  }, []);

  if (loading) {
    return <div className="flex justify-center items-center h-screen">Chargement...</div>;
  }

  if (!category) {
    return <div className="text-center my-6">Catégorie introuvable.</div>;
  }

  return (
    <>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-center my-4 sm:my-6 md:my-8">
          {category.name}
        </h1>
        <ProductList categoryId={category._id} />
      </div>
      <Footer />
    </>
  );
};

export default PreparedSnailsPage;