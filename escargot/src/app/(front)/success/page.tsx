"use client";

import Container from "@/components/Container";
import { useStore } from "@/stores/store";
import Link from "next/link";
import { useEffect } from "react";
import { OrderType } from "@/utils/types";

const SuccessPage = () => {
  const clearCart = useStore((state) => state.clearCart);
  const addOrder = useStore((state) => state.addOrder);
  const user = useStore((state) => state.user);

  useEffect(() => {
    clearCart();

    if (user) {
      const newOrder: OrderType = {
        id: Date.now(),
        userId: user.id,
        products: [],
        total: 0,
        totalAmount: 0, 
        status: 'completed',
        createdAt: new Date(),
        updatedAt: new Date()
      };
      addOrder(newOrder);
    }
  }, [clearCart, addOrder, user]);

  return (
    <Container className="flex items-center justify-center py-20">
      <div className="min-h-[400px] flex flex-col items-center justify-center gap-y-5">
        <h2 className="text-4xl font-bold text-green-800">
          Your payment has been accepted by Les Escargots du Clos
        </h2>
        <p className="text-center text-gray-600">
          You can now view your orders or continue shopping on our site
        </p>
        <div className="flex items-center gap-x-5">
          <Link href={"/orders"}>
            <button className="bg-green-700 text-white w-44 h-12 rounded-full text-base font-semibold hover:bg-green-600 transition duration-300">
              View my orders
            </button>
          </Link>
          <Link href={"/"}>
            <button className="bg-gray-800 text-white w-44 h-12 rounded-full text-base font-semibold hover:bg-gray-700 transition duration-300">
              Continue shopping
            </button>
          </Link>
        </div>
      </div>
    </Container>
  );
};

export default SuccessPage;