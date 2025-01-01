"use client";

import Cart from "@/components/Cart";
import Container from "@/components/Container";
import React from "react";

const Page = () => {
  return (
    <Container>
      <div
        className="container mx-auto px-4 py-8"
        style={{ backgroundColor: "var(--color-tertiary)" }}
      >
        <Cart />
      </div>
    </Container>
  );
};

export default Page;

