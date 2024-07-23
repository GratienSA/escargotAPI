import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { cn } from '../lib/utils';

interface Props {
  className?: string;
}

const Logo = ({ className }: Props) => {
  return (
    <Link
      href="/"
      className={cn(
        "flex items-center space-x-2 text-zinc-950 text-xl group",
        className
      )}
    >
      <Image
        src="/public/escargot/public/Logo principale vert (3).png"
        alt="Les Escargots du Clos Logo"
        width={40}
        height={40}
        className="rounded-full"
      />
      <span className="font-semibold underline underline-offset-4 decoration-[1px] group-hover:text-green-600 transition-colors duration-200">
        Les Escargots du Clos
      </span>
    </Link>
  );
};

export default Logo;