"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { Heart, ShoppingBagIcon, Menu, X, Search } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { useStore } from "@/stores/store";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { generateNavigation } from "@/constant/data";
import styles from "./Product.module.css";

interface NavigationItem {
  _id: number;
  name: string;
  href: string;
}

type NavItemProps = {
  href: string;
  name: string;
  currentPath: string;
};

const NavItem = React.memo(({ href, name, currentPath }: NavItemProps) => (
  <Link href={href} className="flex">
    <li
      className={`hover:text-black cursor-pointer duration-200 relative overflow-hidden group px-3 py-2 flex items-center ${
        href === currentPath ? styles['text-custom-color'] : 'text-zinc-600'
      }`}
    >
      <span className="whitespace-nowrap">{name}</span>
      <span
        className={`absolute h-[0.2px] w-full ${styles.buttons} left-0 bottom-0 -translate-x-[100%] group-hover:translate-x-0 transition-transform duration-500 ${
          href === currentPath && `translate-x-0 ${styles.buttons}`
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
  const [navigation, setNavigation] = useState<NavigationItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchNavigation = async () => {
      setIsLoading(true);
      try {
        const nav = await generateNavigation();
        console.log("Navigation générée:", nav);
        setNavigation(nav);
      } catch (error) {
        console.error("Erreur lors de la génération de la navigation:", error);
        setNavigation([]);
      } finally {
        setIsLoading(false);
      }
    };
    fetchNavigation();
  }, []);

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

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${searchQuery}`);
    }
  };

  console.log("État actuel de navigation:", navigation);

  return (
    <nav className="w-full h-auto border-b-[1px] border-b-zinc-500 bg-white text-zinc-600 sticky top-0 z-50 bg-white/80 backdrop-blur-2xl">
    <div className="max-w-screen-xl mx-auto h-full flex items-center justify-between px-4 xl:px-0 py-4">
      {/* Conteneur du logo */}
      <div className="flex-shrink-0">
        <Image
          src="/Logo terciaire vert.png"
          alt="Logo"
          width={90}
          height={50}
          className="w-24 h-8 md:w-32 md:h-12"
        />
      </div>
  
      {/* Menu de navigation principal */}
      <div className="hidden md:flex items-center justify-center flex-grow">
        <ul className="flex items-center gap-4 text-sm uppercase font-semibold">
          {isLoading ? (
            <li>Chargement...</li>
          ) : (
            navigation.map((item) => (
              <NavItem
                key={item._id}
                href={item.href}
                name={item.name}
                currentPath={pathname}
              />
            ))
          )}
        </ul>
      </div>
  
      {/* Section des actions (recherche, favoris, etc.) */}
      <div className="flex items-center">
        {/* Bouton menu mobile */}
        <button
          className="md:hidden p-2 mr-2"
          onClick={toggleMenu}
          aria-label="Toggle menu"
        >
          {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
  
        {/* Barre de recherche */}
        <form
          onSubmit={handleSearch}
          className="relative hidden md:flex items-center mr-4"
        >
          <input
            type="text"
            className="border rounded-lg px-3 py-2"
            placeholder="Rechercher..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button type="submit" className="absolute right-0 p-2">
            <Search className="w-5 h-5" />
          </button>
        </form>
  
        {/* Favoris et Panier */}
        <Link
          href="/wishlist"
          className="hover:text-black cursor-pointer duration-200 relative group p-2"
          aria-label="Wishlist"
        >
          <Heart className="w-6 h-6" />
          <span
            className={`absolute top-0 right-0 ${styles.buttons} text-white w-4 h-4 rounded-full text-xs flex items-center justify-center group-hover:${styles.buttons} font-semibold`}
          >
            {favorites.length}
          </span>
        </Link>
        <Link
          href="/cart"
          className="hover:text-black cursor-pointer duration-200 relative group p-2"
          aria-label="Shopping Cart"
        >
          <ShoppingBagIcon className="w-6 h-6" />
          <span
            className={`absolute top-0 right-0 ${styles.buttons} text-white w-4 h-4 rounded-full text-xs flex items-center justify-center group-hover:${styles.buttons} font-semibold`}
          >
            {products.length}
          </span>
        </Link>
  
        {/* Connexion/Déconnexion */}
        <button
          onClick={isLoggedIn ? handleLogout : handleLogin}
          className="hover:text-black cursor-pointer duration-200 relative overflow-hidden group text-sm uppercase font-semibold px-3 py-2"
        >
          {isLoggedIn ? "Déconnexion" : "Connexion"}
          <span
            className={`absolute h-[1px] w-full ${styles.buttons} left-0 bottom-0 -translate-x-[100%] group-hover:translate-x-0 transition-transform duration-500`}
          />
        </button>
  
        {/* Avatar utilisateur */}
        <Link href={isLoggedIn ? "/profile" : "/login"}>
          <Avatar className="cursor-pointer">
            <AvatarImage
              src={isLoggedIn ? "https://github.com/shadcn.png" : ""}
            />
            <AvatarFallback>{isLoggedIn ? "CN" : "?"}</AvatarFallback>
          </Avatar>
        </Link>
      </div>
    </div>
  
    {/* Menu mobile */}
    {isMenuOpen && (
      <div className="md:hidden">
        <ul className="flex flex-col items-center gap-4 text-sm uppercase font-semibold py-4">
          {isLoading ? (
            <li>Chargement...</li>
          ) : (
            navigation.map((item) => (
              <NavItem
                key={item._id}
                href={item.href}
                name={item.name}
                currentPath={pathname}
              />
            ))
          )}
        </ul>
        <form
          onSubmit={handleSearch}
          className="relative flex items-center justify-center my-4"
        >
          <input
            type="text"
            className="border rounded-lg px-3 py-2 w-full max-w-xs"
            placeholder="Rechercher..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button type="submit" className="absolute right-0 p-2">
            <Search className="w-5 h-5" />
          </button>
        </form>
      </div>
    )}
  </nav>
  

  );
};

export default React.memo(Navbar);
