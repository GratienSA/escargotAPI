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

const ProductList: React.FC<ProductListProps> = ({ categoryId, products: initialProducts }) => {
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
      let data: GetAllProductsResponse; 
      
      if (categoryId) {
        data = await getProductsByCategory(categoryId);
        console.log("Données récupérées par catégorie:", data);
      } else {
        data = await getAllProducts({ skip: page * PAGE_SIZE, limit: PAGE_SIZE });
        console.log("Données récupérées pour toutes les catégories:", data);
      }
  
      if (data && Array.isArray(data)) {
        console.log("Produits récupérés:", data);
        setProducts(prevProducts => {
          const newProducts = [...prevProducts, ...data];
          return Array.from(new Set(newProducts.map(product => product.id))) // Assurez-vous que les IDs sont uniques
            .map(id => newProducts.find(product => product.id === id)!);
        });
        setHasMore(data.length === PAGE_SIZE);
      } else {
        console.warn("Aucun produit trouvé ou data n'est pas un tableau:", data);
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
    setProducts(initialProducts || []);
    setPage(0);
    setHasMore(true);
    fetchProducts();
  }, [categoryId, fetchProducts, initialProducts]);

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
                : "Découvrez notre sélection d'escargots gourmets et de produits associés."}
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
                    className={styles.button}
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

export default ProductList;
