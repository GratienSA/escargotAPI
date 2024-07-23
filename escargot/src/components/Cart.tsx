import React, { useEffect, useState, useMemo } from "react";
import { Minus, Plus, X } from "lucide-react";
import toast, { Toaster } from "react-hot-toast";
import Image from "next/image";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useStore } from "@/stores/store";
import FormattedPrice from "./FormatedPrice";
import { loadStripe } from "@stripe/stripe-js";

const Cart = () => {
  const [totalAmt, setTotalAmt] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const { products, removeFromCart, updateQuantity, clearCart } = useStore();
  const router = useRouter();

  const stripePromise = useMemo(() => loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!), []);

  const handleReset = () => {
    const confirmReset = window.confirm("Are you sure you want to reset your cart?");
    if (confirmReset) {
      clearCart();
      toast.success("Cart successfully reset");
      router.push("/");
    }
  };

  useEffect(() => {
    if (products) {
      const amt = products.reduce((acc, item) => acc + item.product.price * item.quantity, 0);
      setTotalAmt(amt);
    }
  }, [products]);

  if (!products) {
    return <div>Loading...</div>;
  }


  const handleCheckout = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({
          items: products.map(item => ({
            name: item.product.name,
            image: item.product.imagePath,
            price: item.product.price,
            quantity: item.quantity,
          })),
          userId: localStorage.getItem('userId'),
          success_url: `${process.env.NEXT_PUBLIC_SERVER_URL}/success`,
          cancel_url: `${process.env.NEXT_PUBLIC_SERVER_URL}/cart`,
        }),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const { sessionId } = await response.json();

     
      const stripe = await stripePromise;
      const { error } = await stripe.redirectToCheckout({ sessionId });

      if (error) {
        throw error;
      }
    } catch (error) {
      console.error('Checkout error:', error);

    } finally {
      setIsLoading(false);
    }
  };
  return (
    <>
      {products.length > 0 ? (
        <div className="mt-5 flex flex-col">
          <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-white uppercase bg-green-800">
                <tr>
                  <th scope="col" className="px-6 py-3">Product Information</th>
                  <th scope="col" className="px-6 py-3">Unit Price</th>
                  <th scope="col" className="px-6 py-3">Quantity</th>
                  <th scope="col" className="px-6 py-3">Subtotal</th>
                </tr>
              </thead>
              {products.map((item) => (
                <tbody key={item.product.id}>
                  <tr className="bg-white border-b-[1px] border-b-green-200">
                    <th scope="row" className="px-6 py-4 flex items-center gap-3">
                      <X
                        onClick={() => {
                          removeFromCart(item.product.id);
                          toast.success(`${item.product.name} has been removed from the cart!`);
                        }}
                        className="w-4 h-4 hover:text-red-600 cursor-pointer duration-200"
                      />
                      <Image
                        src={`${process.env.NEXT_PUBLIC_NEST_API_URL}/${item.product.imagePath}`}
                        alt="product image"
                        width={500}
                        height={500}
                        className="w-24 object-contain"
                      />
                      <p className="text-base font-medium text-black">
                        {item.product.name}
                      </p>
                    </th>
                    <td className="px-6 py-4">
                      <FormattedPrice amount={item.product.price} />
                    </td>
                    <td className="px-6 py-4 flex items-center gap-4">
                      <span className="border border-green-300 p-1 rounded-md hover:border-green-800 cursor-pointer duration-200 inline-flex items-center justify-center">
                        <Minus
                          onClick={() => {
                            if (item.quantity > 1) {
                              const success = updateQuantity(item.product.id, item.quantity - 1);
                              success ? toast.success("Quantity successfully decreased!") : toast.error("Failed to update quantity");
                            } else {
                              toast.error("Cannot decrease below 1");
                            }
                          }}
                          className="w-4 h-4"
                        />
                      </span>
                      <span className="font-semibold">{item.quantity}</span>
                      <span className="border border-green-300 p-1 rounded-md hover:border-green-800 cursor-pointer duration-200 inline-flex items-center justify-center">
                        <Plus
                          onClick={() => {
                            const success = updateQuantity(item.product.id, item.quantity + 1);
                            success ? toast.success(`Quantity of ${item.product.name} increased`) : toast.error("Failed to update quantity");
                          }}
                          className="w-4 h-4"
                        />
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <FormattedPrice amount={item.product.price * item.quantity} />
                    </td>
                  </tr>
                </tbody>
              ))}
            </table>
          </div>
          <button
            onClick={handleReset}
            className="bg-green-800 text-white w-36 py-3 mt-5 rounded-md uppercase text-xs font-semibold hover:bg-red-700 hover:text-white duration-200"
          >
            Clear Cart
          </button>
          <div className="mt-4 bg-white max-w-xl p-4 flex flex-col gap-1">
            <p className="border-b-[1px] border-b-green-800 py-1">Cart Summary</p>
            <p className="flex items-center justify-between">Total items <span>{products.length}</span></p>
            <p className="flex items-center justify-between">Total price <span><FormattedPrice amount={totalAmt} /></span></p>
            <button 
              onClick={handleCheckout} 
              disabled={isLoading}
              className={`bg-green-800 text-white w-full my-2 py-2 uppercase text-center rounded-md font-semibold hover:bg-green-900 hover:text-white duration-200 ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {isLoading ? "Processing..." : "Proceed to Checkout"}
            </button>
          </div>
        </div>
      ) : (
        <div className="py-10 flex flex-col gap-1 items-center justify-center">
          <p className="text-lg font-bold">Your cart is empty</p>
          <Link href={"/"} className="text-sm uppercase font-semibold underline underline-offset-2 hover:text-green-800 duration-200 cursor-pointer">
            Return to shop
          </Link>
        </div>
      )}
      <Toaster position="bottom-right" toastOptions={{ style: { background: "#166534", color: "#fff" } }} />
    </>
  );
};

export default Cart;

