"use client";
import Container from "@/components/Container";
import Title from "@/components/Title";
import React from "react";
import Wishlist from "@/components/Wishlist";

const WishlistPage = () => {
  return (
    <Container>
      <Title title="Your Wishlist" />
      <Wishlist />
    </Container>
  );
};

export default WishlistPage;
