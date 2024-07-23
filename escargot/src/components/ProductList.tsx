"use client";

import React, { useState, useEffect } from 'react';
import Container from "./Container";
import Product from "./Product";
import { ProductType } from '@/utils/types';
import { getAllProducts, getProductsByCategory } from '@/helpers/getData';

interface ProductListProps {
  categoryId?: number;
}

const ProductList: React.FC<ProductListProps> = ({ categoryId }) => {
  const [products, setProducts] = useState<ProductType[]>([]);
  console.log("data",{products})
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      let data: any;
      if (categoryId) {
        data = await getProductsByCategory(categoryId);
        setProducts(data);
        setHasMore(false);
      } else {
        data = await getAllProducts(page * 12);
        if (data.length < 12) {
          setHasMore(false);
        }
        setProducts((prevProducts) => [...prevProducts, ...data]);
      }
    } catch (err) {
      console.error("Failed to fetch products:", err);
      setError("Failed to load products. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [categoryId, page]);

  const loadMore = () => {
    if (!categoryId) {
      setPage(prevPage => prevPage + 1);
    }
  };

  return (
    <div className="mt-10 mb-60">
      <Container>
        <div className="flex flex-col gap-2 items-center">
          <h2 className="text-3xl font-semibold text-green-800">
            {categoryId ? "Products in this category" : "Our trending products"}
          </h2>
          <p className="text-lg text-center text-gray-600">
            {categoryId 
              ? "Explore our selection for this category."
              : "Discover our selection of gourmet snails and related products."}
          </p>
        </div>
        
        {error ? (
          <div className="text-center mt-10 text-red-500">{error}</div>
        ) : (
          <>
            {products.length > 0 ? (
              <Product products={products} />
            ) : (
              <div>Loading...</div>
            )}
            {!categoryId && hasMore && (
              <div className="text-center mt-10">
                <button 
                  onClick={loadMore}
                  className="bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 transition duration-200"
                  disabled={loading}
                >
                  {loading ? 'Loading...' : 'Load more'}
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
