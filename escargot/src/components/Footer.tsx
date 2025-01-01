import Link from "next/link";
import Image from "next/image";
import { Facebook, Twitter, Youtube, Instagram } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="w-full py-8 bg-white">
      <div className="container mx-auto px-4 space-y-8">
        {/* Logo */}
        <div className="flex justify-center">
          <Image 
            src="/Logo secondaire jaune.png"
            alt="Les Escargots du Clos"
            width={320}
            height={320}
            className="h-60 w-auto"
          />
        </div>

        {/* Join Us Section */}
        <div className="text-center">
          <div className="flex items-center justify-center my-4">
            <div className="flex-grow border-t border-amber-500 h-1"></div>
            <h2 className="mx-4 text-2xl font-semibold text-amber-500">REJOIGNEZ-NOUS</h2>
            <div className="flex-grow border-t border-amber-500 h-1"></div>
          </div>
        </div>

        {/* Social Icons */}
        <div className="flex justify-center gap-4">
          <Link href="#" className="p-2 hover:text-amber-500 transition-colors">
            <Facebook className="h-6 w-6" />
          </Link>
          <Link href="#" className="p-2 hover:text-amber-500 transition-colors">
            <Twitter className="h-6 w-6" />
          </Link>
          <Link href="#" className="p-2 hover:text-amber-500 transition-colors">
            <Youtube className="h-6 w-6" />
          </Link>
          <Link href="#" className="p-2 hover:text-amber-500 transition-colors">
            <Instagram className="h-6 w-6" />
          </Link>
        </div>

        {/* Navigation */}
        <nav className="flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm">
          {["Accueil", "Modes de livraison", "Actualités", "galeries", "A Propos", "Contactez-nous", , "Mentions Légales", "CGV"].map((item) => (
            <Link key={item} href="#" className="hover:text-amber-500 transition-colors">{item}</Link>
          ))}
        </nav>

        {/* Copyright */}
        <div className="text-center text-sm text-gray-500">
          <p>Copyright © 2024 - 2024 CTS Les Escargots du Clos. Tous droits réservés.</p>
        </div>
      </div>
    </footer>
  );
}