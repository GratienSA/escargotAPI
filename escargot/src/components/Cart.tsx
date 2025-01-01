import React, { useEffect, useState, useMemo } from "react";
import { Minus, Plus, X } from "lucide-react";
import toast, { Toaster } from "react-hot-toast";
import Image from "next/image";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useStore } from "@/stores/store";
import { loadStripe } from "@stripe/stripe-js";
import { createOrder } from "@/helpers/getData";
import { jwtDecode } from "jwt-decode";
import FormattedPrice from "./FormatedPrice";
import { CreateOrderDto } from "@/utils/types";
import { Trash2 } from "lucide-react";
// Définition de l'énumération pour les méthodes de paiement
enum PaymentMethod {
  CASH = "CASH",
  stripe = "stripe",
}

const Cart = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { products, removeFromCart, updateQuantity, clearCart } = useStore();
  const router = useRouter();

  const stripePromise = useMemo(
    () => loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!),
    []
  );

  const [shippingStreet, setShippingStreet] = useState<string | null>(null);
  const [shippingCity, setShippingCity] = useState<string | null>(null);
  const [shippingZip, setShippingZip] = useState<string | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>(
    PaymentMethod.stripe
  );

  const handleShippingStreetChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setShippingStreet(e.target.value);
  };

  const handleShippingCityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setShippingCity(e.target.value);
  };

  const handleShippingZipChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setShippingZip(e.target.value);
  };

  const handlePaymentMethodChange = (
    e: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setPaymentMethod(e.target.value as PaymentMethod);
  };

  const obtenirUrlImage = (imagePath: string) => {
    if (!imagePath) return "/placeholder.jpg";
    return imagePath.startsWith("http")
      ? imagePath
      : `https://res.cloudinary.com/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload/${imagePath}`;
  };

  const totalAmt = useMemo(() => {
    return products.reduce(
      (acc, item) => acc + Number(item.product.price) * item.quantity,
      0
    );
  }, [products]);

  const handleReset = () => {
    const confirmReset = window.confirm(
      "Êtes-vous sûr de vouloir vider votre panier ?"
    );
    if (confirmReset) {
      clearCart();
      toast.success("Panier vidé avec succès");
      router.push("/");
    }
  };

  const handleCheckout = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("Vous devez être connecté pour procéder au paiement.");
      return;
    }

    setIsLoading(true);
    try {
      // Validation des champs requis
      if (
        !shippingStreet ||
        !shippingCity ||
        !shippingZip ||
        !products.length
      ) {
        throw new Error("Veuillez remplir tous les champs requis");
      }

      // Calcul des prix
      const itemsPrice = products.reduce(
        (sum, item) => sum + item.product.price * item.quantity,
        0
      );
      const taxPrice = itemsPrice * 0.2;
      const shippingPrice = 5;
      const totalAmount = itemsPrice + taxPrice + shippingPrice;

      // Préparation des données de commande
      const orderData: CreateOrderDto = {
        userId: getUserIdFromToken(token),
        shippingStreet,
        shippingCity,
        shippingZip,
        paymentMethod,
        orderItems: products.map((item) => ({
          productId: item.product.id,
          quantity: item.quantity,
          price: item.product.price,
          name: item.product.name,
        })),
        itemsPrice,
        shippingPrice,
        taxPrice,
        totalAmount,
        successUrl: `${window.location.origin}/success`,
        cancelUrl: `${window.location.origin}/cart`,
      };

      // Création de la commande
      const orderResponse = await createOrder(orderData);
      console.log("Réponse de la commande:", orderResponse); // Ajouter ce log pour vérifier la réponse

      if (!orderResponse?.sessionId) {
        throw new Error(
          "Erreur lors de la création de la session de paiement."
        );
      }

      const { sessionId } = orderResponse;

      // Redirection vers Stripe Checkout
      const stripe = await stripePromise;
      if (!stripe) {
        throw new Error("Erreur d'initialisation de Stripe");
      }

      const { error } = await stripe.redirectToCheckout({ sessionId });
      if (error) {
        console.error(
          "Erreur lors de la redirection vers Stripe Checkout :",
          error
        );
        toast.error("Erreur lors de la redirection vers Stripe. Réessayez.");
      }
    } catch (error: unknown) {
      console.error("Erreur lors du paiement :", error);
      toast.error(error instanceof Error ? error.message : "Erreur inconnue");
    } finally {
      setIsLoading(false);
    }
  };

  // Fonction pour décoder le token et récupérer l'ID utilisateur
  function getUserIdFromToken(token: string): number | null {
    try {
      console.log("Token reçu :", token); // Affichez le token brut pour vérifier sa validité

      if (!token || token.split(".").length !== 3) {
        console.error("Token mal formé");
        return null;
      }

      const decoded: any = jwtDecode(token);
      console.log("Payload décodé :", decoded); // Affichez le contenu décodé du token

      const userId = decoded?.sub ? parseInt(decoded.sub, 10) : null;
      console.log("ID utilisateur extrait :", userId); // Affichez l'ID utilisateur extrait

      // Vérifiez si userId est un nombre valide
      if (userId !== null && isNaN(userId)) {
        console.error("Le champ `sub` du token n'est pas un nombre valide.");
        return null;
      }

      return userId;
    } catch (error) {
      console.error("Erreur lors du décodage du token:", error);
      return null;
    }
  }

  const handleQuantityChange = (id: number, newQuantity: number) => {
    if (newQuantity < 1) {
      toast.error("Impossible de descendre en dessous de 1");
      return;
    }

    const success = updateQuantity(id, newQuantity);
    success
      ? toast.success(`Quantité mise à jour avec succès !`)
      : toast.error("Échec de la mise à jour de la quantité");
  };

  if (!products) {
    return <div>Chargement...</div>;
  }

  return (
    <div
      className="container mx-auto px-4 py-8"
      style={{ backgroundColor: "var(--color-tertiary)" }}
    >
      <h1
        className="text-3xl font-bold mb-8"
        style={{ color: "var(--color-primary)" }}
      >
        Votre Panier
      </h1>

      {products.length > 0 ? (
        <div className="flex flex-col lg:flex-row gap-8">
          <div className="lg:w-2/3">
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left pb-4">Produit</th>
                    <th className="text-center pb-4">Prix</th>
                    <th className="text-center pb-4">Quantité</th>
                    <th className="text-right pb-4">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((item) => (
                    <tr key={item.product.id} className="border-b">
                      <td className="py-4">
                        <div className="flex items-center space-x-4">
                          <Image
                            src={obtenirUrlImage(item.product.imagePath)}
                            alt={item.product.name}
                            width={64}
                            height={64}
                            className="rounded-md"
                          />
                          <div>
                            <h3 className="font-semibold">
                              {item.product.name}
                            </h3>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 text-center">
                        <FormattedPrice price={item.product.price} />
                      </td>
                      <td className="py-4">
                      <div className="flex items-center justify-center">
  <button
    onClick={() => handleQuantityChange(item.product.id, item.quantity - 1)}
    className="bg-gray-200 text-gray-600 hover:bg-gray-300 p-1 rounded-full focus:outline-none focus:ring-2 focus:ring-gray-400"
  >
    <Minus size={16} />
  </button>
  <span className="text-gray-700 mx-2 font-medium">
    {item.quantity}
  </span>
  <button
    onClick={() => handleQuantityChange(item.product.id, item.quantity + 1)}
    className="bg-gray-200 text-gray-600 hover:bg-gray-300 p-1 rounded-full focus:outline-none focus:ring-2 focus:ring-gray-400"
  >
    <Plus size={16} />
  </button>
</div>

                      </td>
                      <td className="py-4 text-right">
  <div className="flex items-center justify-end">
    <FormattedPrice price={item.product.price * item.quantity} />
    <button
      onClick={() => removeFromCart(item.product.id)}
      className="ml-2 text-red-500 hover:text-red-700 focus:outline-none"
    >
      <Trash2 size={18} />
    </button>
  </div>
</td>

                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Résumé de la commande */}
          <div className="lg:w-1/3">
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
              <h2
                className="text-lg font-semibold mb-4"
                style={{ color: "var(--color-primary)" }}
              >
                Résumé de la commande
              </h2>
              <div className="flex justify-between mb-2">
                <span>Sous-total</span>
                <FormattedPrice price={totalAmt} />
              </div>
              <div className="flex justify-between mb-2">
                <span>Frais de livraison</span>
                <span>Gratuit</span>
              </div>
              <hr className="my-2" />
              <div className="flex justify-between mb-2">
                <span className="font-semibold">Total</span>
                <FormattedPrice price={totalAmt} className="font-semibold" />
              </div>

              {/* Boutons d'action */}
              <button
                onClick={handleCheckout}
                disabled={isLoading}
                style={{ backgroundColor: "var(--color-secondary)" }} // Utilisation de la variable CSS
                className={`w-full mt-4 py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 ${
                  isLoading ? "opacity-50 cursor-not-allowed" : ""
                }`}
              >
                {isLoading ? "Chargement..." : "Passer à la caisse"}
              </button>

              {/* Bouton pour vider le panier */}
              <button
                onClick={handleReset}
                className="w-full mt-2 py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Vider le panier
              </button>
            </div>

            {/* Informations de livraison */}
            <div className="bg-white rounded-lg shadow-md p-6 mt-6">
              <h2
                className="text-lg font-semibold mb-4"
                style={{ color: "var(--color-primary)" }}
              >
                Informations de livraison
              </h2>
              <div className="space-y-4">
                {/* Rue */}
                <div>
                  <label
                    htmlFor="shippingStreet"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Rue
                  </label>
                  <input
                    type="text"
                    id="shippingStreet"
                    value={shippingStreet || ""}
                    onChange={handleShippingStreetChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
                  />
                </div>

                {/* Ville */}
                <div>
                  <label
                    htmlFor="shippingCity"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Ville
                  </label>
                  <input
                    type="text"
                    id="shippingCity"
                    value={shippingCity || ""}
                    onChange={handleShippingCityChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
                  />
                </div>

                {/* Code Postal */}
                <div>
                  <label
                    htmlFor="shippingZip"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Code Postal
                  </label>
                  <input
                    type="text"
                    id="shippingZip"
                    value={shippingZip || ""}
                    onChange={handleShippingZipChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
                  />
                </div>

                {/* Mode de paiement */}
                <div>
                  <label
                    htmlFor="paymentMethod"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Mode de paiement
                  </label>
                  <select
                    id="paymentMethod"
                    value={paymentMethod}
                    onChange={handlePaymentMethodChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
                  >
                    {/* Options de paiement */}
                    {Object.values(PaymentMethod).map((method) => (
                      <option key={method} value={method}>
                        {method}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        // Message si le panier est vide
        <div className="text-center py-12">
          <h2 className="text-xl font-semibold mb=4">Votre panier est vide</h2>
          <p>Ajoutez des articles à votre panier pour commencer vos achats.</p>
        </div>
      )}
    </div>
  );
};

export default Cart;
