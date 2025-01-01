'use client'
import Image from 'next/image'

export default function ProductImage({ image, name }: { image: string, name: string }) {
  return (
    <div className="space-y-4">
      <Image
        src={image}
        alt={`Image de ${name}`}
        width={1000}
        height={1000}
        className="min-h-[300px] object-cover object-center"
      />
    </div>
  )
}