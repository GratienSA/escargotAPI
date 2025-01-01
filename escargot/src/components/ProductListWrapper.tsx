"use client";

import React, { useState, useEffect, useCallback } from 'react';
import Container from "./Container";
import Product from "./Product";
import { ProductType, GetAllProductsResponse } from '@/utils/types'; 
import { getAllProducts, getProductsByCategory } from '@/helpers/getData';
import styles from './Product.module.css';

interface ProductListProps {
  categoryId?: number;
  products?: ProductType[];
}

const PAGE_SIZE = 12;

const ProductListWrapper: React.FC<ProductListProps> = ({ categoryId, products: initialProducts }) => {
  const [products, setProducts] = useState<ProductType[]>(initialProducts || []);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      console.log(`Récupération des produits pour ${categoryId ? `la catégorie ${categoryId}` : 'toutes les catégories'}, page ${page}`);
      let response: GetAllProductsResponse; 
      
      if (categoryId) {
        response = await getProductsByCategory(categoryId);
        console.log("Données récupérées par catégorie:", response);
      } else {
        response = await getAllProducts({ skip: page * PAGE_SIZE, limit: PAGE_SIZE });
        console.log("Données récupérées pour toutes les catégories:", response);
      }
  
      if (response && Array.isArray(response.data)) {
        console.log("Produits récupérés:", response.data);
        setProducts(prevProducts => {
          const newProducts = [...prevProducts, ...response.data];
          // Éviter les doublons
          const uniqueProducts = Array.from(new Set(newProducts.map(product => product.id)))
            .map(id => newProducts.find(product => product.id === id)!);
          return uniqueProducts;
        });
        setHasMore(response.data.length === PAGE_SIZE);
      } else {
        console.warn("Aucun produit trouvé ou data n'est pas un tableau:", response);
        setHasMore(false);
      }
    } catch (err) {
      console.error("Échec de la récupération des produits:", err);
      setError(`Échec du chargement des produits: ${err instanceof Error ? err.message : 'Erreur inconnue'}`);
    } finally {
      setLoading(false);
    }
  }, [categoryId, page]);

  useEffect(() => {
    setPage(0); 
    setProducts([]); // Réinitialiser les produits uniquement si la catégorie change
    fetchProducts();
  }, [categoryId, fetchProducts]);

  const loadMore = useCallback(() => {
    if (!categoryId && !loading && hasMore) {
      console.log('Chargement de plus de produits, incrémentation de la page');
      setPage(prevPage => prevPage + 1);
    }
  }, [categoryId, loading, hasMore]);

  console.log(`Rendu de ProductList. Produits: ${products.length}, Chargement: ${loading}, Plus de produits: ${hasMore}`);

  return (
    <div className="mt-10 mb-60">
      <Container>
        <div className="flex flex-col gap-2 items-center">
          <h2 className={`text-3xl font-semibold ${styles.price}`}>
            {categoryId ? "Produits dans cette catégorie" : "Nos produits tendance"}
          </h2>
          <p className="text-lg text-center text-gray-600">
            {categoryId 
              ? "Explorez notre sélection pour cette catégorie."
              : "Découvrez le choix de nos clients et donc nos produits tendances."}
          </p>
        </div>
        
        {error ? (
          <div className="text-center mt-10 text-red-500">{error}</div>
        ) : (
          <>
            {products.length > 0 ? (
              <Product products={products} />
            ) : (
              loading ? (
                <div className="text-center mt-10">Chargement...</div>
              ) : (
                <div className="text-center mt-10">Aucun produit trouvé.</div>
              )
            )}
            {!categoryId && hasMore && (
              <div className="text-center mt-10">
                <button 
                  onClick={loadMore}
                  className="bg-var(--color-olive-dark) text-white py-2 px-4 rounded-md hover:bg-var(--color-secondary-light) transition duration-200"
                  disabled={loading}
                >
                  {loading ? 'Chargement...' : 'Charger plus'}
                </button>
              </div>
            )}
          </>
        )}
      </Container>
    </div>
  );
};

export default ProductListWrapper;
