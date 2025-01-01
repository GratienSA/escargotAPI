"use client";

import React from 'react';
import Head from 'next/head';
import Banner from "@/components/Banner";
import ProductListWrapper from "@/components/ProductListWrapper"; // Import du nouveau composant
import Footer from '@/components/Footer';

const All: React.FC = () => {
  console.log("Rendu du composant All");

  return (
    <>
      <Head>
        <title>Tous nos produits - Escargots Gourmets</title>
        <meta name="description" content="Découvrez notre gamme complète d'escargots frais, préparés et nos coffrets cadeaux gourmands. Qualité et saveur garanties." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="canonical" href="https://votresite.com/all" />
      </Head>
      <main className="min-h-screen">
        <h1 className="sr-only">Tous nos produits d'escargots</h1>
        <Banner />
        <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <ProductListWrapper /> 
        </section>
      </main>
      <Footer />
    </>
  );
};

export default All;