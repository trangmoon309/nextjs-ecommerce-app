'use client';

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import { getFeaturedProducts } from '@/lib/actions/product.action';
import { Product } from '@/types';
import Autoplay from 'embla-carousel-autoplay';
import Link from 'next/link';
import Image from 'next/image';

const ProductCarousel = async ({ data }: { data: Product[] }) => {
  return (
    <>
      <Carousel
        className="w-full mb-12"
        opts={{ loop: true }}
        plugins={[
          Autoplay({
            delay: 2000,
            stopOnInteraction: true,
            stopOnMouseEnter: true,
          }),
        ]}
      >
        <CarouselContent>
          {data.map((product: Product) => (
            <CarouselItem key={product.id}>
              <Link href={`/products/${product.slug}`}>
                <div className="relative mx-auto">
                  <Image
                    src={product.banner!}
                    alt={product.name}
                    width={0}
                    height={0}
                    sizes="100vw"
                    className="w-full h-auto object-cover"
                  />
                </div>
              </Link>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious></CarouselPrevious>
        <CarouselNext></CarouselNext>
      </Carousel>
    </>
  );
};

export default ProductCarousel;
