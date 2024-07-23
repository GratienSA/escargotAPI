"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { Heart, ShoppingBagIcon, Menu, X, Search } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { navigation } from "@/constant/data";
import { useStore } from "@/stores/store";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

type NavItemProps = {
  href: string;
  title: string;
  currentPath: string;
};

const NavItem = React.memo(({ href, title, currentPath }: NavItemProps) => (
  <Link href={href}>
    <li
      className={`hover:text-black cursor-pointer duration-200 relative overflow-hidden group px-3 py-2 ${
        href === currentPath ? "text-green-600" : "text-zinc-600"
      }`}
    >
      {title}
      <span
        className={`absolute h-[2px] w-full bg-green-600 left-0 bottom-0 -translate-x-[100%] group-hover:translate-x-0 transition-transform duration-500 ${
          href === currentPath && "translate-x-0 bg-green-600"
        }`}
      />
    </li>
  </Link>
));

NavItem.displayName = "NavItem";

const Navbar = () => {
  const pathname = usePathname();
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const { products, favorites } = useStore();

  useEffect(() => {
    const checkLoginStatus = () => {
      try {
        const token = localStorage.getItem("token");
        setIsLoggedIn(!!token);
      } catch (error) {
        console.error("Error accessing localStorage:", error);
      }
    };

    checkLoginStatus();
    window.addEventListener("storage", checkLoginStatus);
    return () => window.removeEventListener("storage", checkLoginStatus);
  }, []);

  const handleLogin = useCallback(() => router.push("/login"), [router]);

  const handleLogout = useCallback(() => {
    try {
      localStorage.removeItem("token");
      setIsLoggedIn(false);
      router.push("/");
    } catch (error) {
      console.error("Error removing token from localStorage:", error);
    }
  }, [router]);

  const toggleMenu = useCallback(() => setIsMenuOpen((prev) => !prev), []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${searchQuery}`);
    }
  };

  return (
    <nav className="w-full h-auto border-b-[1px] border-b-zinc-500 bg-white text-zinc-600 sticky top-0 z-50 bg-white/80 backdrop-blur-2xl">
      <div className="max-w-screen-xl mx-auto h-full flex flex-col md:flex-row items-center justify-between px-4 xl:px-0 py-4">
        <div className="flex items-center justify-between w-full md:w-auto mb-4 md:mb-0">
          <button
            className="md:hidden p-2"
            onClick={toggleMenu}
            aria-label="Toggle menu"
          >
            {isMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>

        <ul
          className={`${
            isMenuOpen ? "flex" : "hidden"
          } md:flex flex-col md:flex-row items-center gap-2 text-sm uppercase font-semibold`}
        >
          {navigation.map((item) => (
            <NavItem
              key={item._id}
              href={item.href}
              title={item.title}
              currentPath={pathname}
            />
          ))}
        </ul>

        <form onSubmit={handleSearch} className="relative flex items-center">
          <input
            type="text"
            className="border rounded-lg px-3 py-2"
            placeholder="Search..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button type="submit" className="absolute right-0 p-2">
            <Search className="w-5 h-5" />
          </button>
        </form>

        <div className="flex items-center gap-x-5 mt-4 md:mt-0">
          <Link
            href="/wishlist"
            className="hover:text-black cursor-pointer duration-200 relative group p-2"
            aria-label="Wishlist"
          >
            <Heart className="w-6 h-6" />
            <span className="absolute top-0 right-0 bg-green-600 text-white w-4 h-4 rounded-full text-xs flex items-center justify-center group-hover:bg-green-700 font-semibold">
              {favorites.length}
            </span>
          </Link>
          <Link
            href="/cart"
            className="hover:text-black cursor-pointer duration-200 relative group p-2"
            aria-label="Shopping Cart"
          >
            <ShoppingBagIcon className="w-6 h-6" />
            <span className="absolute top-0 right-0 bg-green-600 text-white w-4 h-4 rounded-full text-xs flex items-center justify-center group-hover:bg-green-700 font-semibold">
              {products.length}
            </span>
          </Link>
          <button
            onClick={isLoggedIn ? handleLogout : handleLogin}
            className="hover:text-black cursor-pointer duration-200 relative overflow-hidden group text-sm uppercase font-semibold px-3 py-2"
          >
            {isLoggedIn ? "Logout" : "Login"}
            <span className="absolute h-[2px] w-full bg-green-600 left-0 bottom-0 -translate-x-[100%] group-hover:translate-x-0 transition-transform duration-500" />
          </button>
          <Link href={isLoggedIn ? "/profile" : "/login"}>
            <Avatar className="cursor-pointer">
              <AvatarImage src={isLoggedIn ? "https://github.com/shadcn.png" : ""} />
              <AvatarFallback>{isLoggedIn ? "CN" : "?"}</AvatarFallback>
            </Avatar>
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default React.memo(Navbar);

