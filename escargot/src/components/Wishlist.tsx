"use client";
import React from "react";
import { X, ShoppingCart } from "lucide-react";
import toast, { Toaster } from "react-hot-toast";
import Image from "next/image";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useStore } from "@/stores/store";
import FormattedPrice from "./FormatedPrice";
import { ProductType } from "@/utils/types";

const Wishlist = () => {
  const { favorites, toggleFavorite, clearFavorites, addToCart } = useStore();
  const router = useRouter();

  const handleReset = () => {
    const confirmReset = window.confirm(
      "Are you sure you want to reset your wishlist?"
    );
    if (confirmReset) {
      clearFavorites();
      toast.success("Wishlist successfully reset");
      router.push("/");
    }
  };

  const handleAddToCart = (item: ProductType) => {
    addToCart(item);
    toast.success(`${item.name} has been added to your cart!`);
  };

  if (!favorites) {
    return <div>Loading...</div>;
  }

  return (
    <>
      {favorites.length > 0 ? (
        <div className="mt-5 flex flex-col">
          <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-white uppercase bg-green-600">
                <tr>
                  <th scope="col" className="px-6 py-3">
                    Product Information
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Unit Price
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Actions
                  </th>
                </tr>
              </thead>
              {favorites.map((item: ProductType) => (
                <tbody key={item.id}>
                  <tr className="bg-white border-b-[1px] border-b-green-200">
                    <th
                      scope="row"
                      className="px-6 py-4 flex items-center gap-3"
                    >
                      <X
                        onClick={() => {
                          toggleFavorite(item);
                          toast.success(
                            `${item.name} has been removed from the wishlist!`
                          );
                        }}
                        className="w-4 h-4 hover:text-red-600 cursor-pointer duration-200"
                      />
                      <Image
                        src={`${process.env.NEXT_PUBLIC_NEST_API_URL}/${item.imagePath}`}
                        alt="product image"
                        width={500}
                        height={500}
                        className="w-24 object-contain"
                      />
                      <p className="text-base font-medium text-black">
                        {item.name}
                      </p>
                    </th>
                    <td className="px-6 py-4">
                      <FormattedPrice price={item.price} amount={0} />
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleAddToCart(item)}
                          className="bg-green-600 text-white py-1 px-3 rounded-md hover:bg-green-700 duration-200 flex items-center gap-1"
                        >
                          <ShoppingCart size={16} />
                          Add to Cart
                        </button>
                        <button
                          onClick={() => {
                            toggleFavorite(item);
                            toast.success(
                              `${item.name} has been removed from the wishlist!`
                            );
                          }}
                          className="bg-red-500 text-white py-1 px-3 rounded-md hover:bg-red-700 duration-200"
                        >
                          Remove
                        </button>
                      </div>
                    </td>
                  </tr>
                </tbody>
              ))}
            </table>
          </div>
          <button
            onClick={handleReset}
            className="bg-green-600 text-white w-36 py-3 mt-5 rounded-md uppercase text-xs font-semibold hover:bg-red-700 hover:text-white duration-200"
          >
            Clear Wishlist
          </button>
          <Toaster
            position="bottom-right"
            toastOptions={{
              style: {
                background: "#16A34A",
                color: "#fff",
              },
            }}
          />
        </div>
      ) : (
        <div className="py-10 flex flex-col gap-1 items-center justify-center">
          <p className="text-lg font-bold">Your wishlist is empty</p>
          <Link
            href={"/"}
            className="text-sm uppercase font-semibold underline underline-offset-2 hover:text-green-600 duration-200 cursor-pointer"
          >
            Return to shop
          </Link>
        </div>
      )}
    </>
  );
};

export default Wishlist;