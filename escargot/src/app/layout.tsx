"use client";

import { Inter } from "next/font/google";
import "./globals.css"; // Assurez-vous que ce fichier contient vos styles globaux, y compris Tailwind CSS
import Navbar from "@/components/Navbar";
import { cn } from "@/lib/utils"; // Assurez-vous que cette fonction est correctement définie
import "slick-carousel/slick/slick.css"; // Importation des styles pour Slick Carousel
import Layout from "@/components/Layout";
import { Elements } from "@stripe/react-stripe-js";
import getStripe from "@/helpers/getStripe";

const inter = Inter({ subsets: ["latin"] });
const stripePromise = getStripe(); // Initialisation de Stripe

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Elements stripe={stripePromise}>
      <html lang="en">
        <body
          className={cn(
            "bg-background min-h-screen font-sans antialiased",
            inter.className
          )}
        >
          <Layout>
            <Navbar />
            {children}
          </Layout>
        </body>
      </html>
    </Elements>
  );
}
