"use client";
import Container from "@/components/Container";
import Title from "@/components/Title";
import React from "react";
import Wishlist from "@/components/Wishlist";

const WishlistPage = () => {
  return (
    <Container className="px-4 sm:px-6 lg:px-8 py-10">
      <Title title="Votre Liste de Souhaits" className="text-3xl font-bold text-center mb-8" />
      <Wishlist />
    </Container>
  );
};

export default WishlistPage;