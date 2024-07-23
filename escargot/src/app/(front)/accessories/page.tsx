"use client";

import React from 'react';
import ProductList from '@/components/ProductList';
import { navigation } from '@/constant/data';

const AccessoriesPage = () => {
  const categoryId = 4; 
  const category = navigation.find(item => item.categoryId === categoryId);

  return (
    <div>
      <h1 className="text-4xl font-bold text-center my-8">{category?.title}</h1>
      <ProductList categoryId={categoryId} />
    </div>
  );
};

export default AccessoriesPage;