"use client";

import Container from "@/components/Container";
import { useStore } from "@/stores/store";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { OrderType } from "@/utils/types";
import styles from '@/components/Product.module.css';

const SuccessPage = () => {
  const clearCart = useStore((state) => state.clearCart);
  const addOrder = useStore((state) => state.addOrder);
  const user = useStore((state) => state.user);
  const productsInCart = useStore((state) => state.products);
  const [orderProcessed, setOrderProcessed] = useState(false);

  const totalAmount = useMemo(() => {
    return productsInCart.reduce((total, item) => total + item.product.price * item.quantity, 0);
  }, [productsInCart]);

  useEffect(() => {
    if (!orderProcessed && user && productsInCart.length > 0) {
      const newOrder: OrderType = {
        id: Date.now(),
        userId: user.id,
        shippingStreet: "", // Ces champs doivent être remplis avec les vraies données
        shippingCity: "",
        shippingZip: "",
        paymentMethod: "Stripe",
        itemsPrice: totalAmount,
        taxPrice: totalAmount * 0.2,
        shippingPrice: 0,
        totalAmount: totalAmount,
        status: "completed",
        isPaid: true,
        paidAt: new Date(),
        isDelivered: false,
        deliveredAt: null,
        createdAt: new Date(),
        updatedAt: new Date(),
        orderItems: productsInCart.map((item) => ({
          productId: item.product.id,
          quantity: item.quantity,
          price: item.product.price,
          name: item.product.name,
        })),
        payment: {}, // Ajoutez les détails du paiement si disponibles
        sessionId: "", // Ajoutez l'ID de session Stripe si disponible
        paymentResult: {}, // Ajoutez les résultats du paiement si disponibles
      };

      addOrder(newOrder);
      clearCart();
      setOrderProcessed(true);
    }
  }, [user, productsInCart, totalAmount, addOrder, clearCart, orderProcessed]);

  return (
    <Container className="flex items-center justify-center py-20">
    <div className="min-h-[400px] flex flex-col items-center justify-center gap-y-5">
      <h2 className={`text-4xl font-bold ${styles['text-custom-color']} text-center`}>
        Votre paiement a été accepté par Les Escargots du Clos
      </h2>
      <p className="text-center text-gray-600">
        Vous pouvez maintenant consulter vos commandes ou continuer vos achats sur notre site.
      </p>
      
      <div className="flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-4">
      <Link href="/">
          <button className={`${styles.button} w-56 h-12 rounded-full text-base font-semibold`}>
          Continuer mes achats
          </button>
        </Link>
         <Link href="/orders">
          <button className={`${styles.favoriteButton} w-56 h-12 rounded-full text-base font-semibold`}>
            Voir mes commandes
          </button>
        </Link>
      </div>
    </div>
  </Container>
);
};

export default SuccessPage;





