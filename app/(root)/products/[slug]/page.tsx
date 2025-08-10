import { getProductBySlug } from '@/lib/actions/product.action';
import { notFound } from 'next/navigation';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import ProductPrice from '@/components/shared/product/product-price';
import ProductImage from '@/components/shared/product/product-image';
import AddToCart from '@/components/shared/product/add-to-cart';
import { getMyCart } from '@/lib/actions/cart.action';
import { auth } from '@/auth';
import ReviewList from './review-list';
import Rating from '@/components/shared/product/rating';

type Params = Promise<{ slug: string }>;

const ProductDetailPage = async ({ params }: { params: Params }) => {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  const cart = await getMyCart();
  const session = await auth();
  const userId = session?.user.id;

  if (!product) {
    console.log('❌ Product not found, triggering 404.');
    notFound();
  }

  return (
    <>
      <section>
        <div className="grid grid-cols-1 md:grid-cols-5">
          {/* Images Column */}
          <div className="col-span-2">
            <ProductImage images={product.images}></ProductImage>
          </div>
          {/* Details Column */}
          <div className="col-span-2 p-5">
            <div className="flex flex-col gap-6">
              <p>
                {product.brand} {product.category}
              </p>
              <h1 className="h3-bold">{product.name}</h1>
              <Rating value={Number(product.rating)} />
              <p>{product.numReviews} reviews</p>
              <div className="flex flex-col sm:flex-row sm:items-center">
                <ProductPrice
                  value={Number(product.price)}
                  className="w-24 rounded-full bg-green-100 text-green-700 px-5 py-2"
                ></ProductPrice>
              </div>
            </div>
            <div className="mt-10">
              <p className="font-semibold">Description</p>
              <p>{product.description}</p>
            </div>
          </div>
          {/* Action Column */}
          <div>
            <Card>
              <CardContent>
                <div className="mb-2 flex justify-between">
                  <div>Price</div>
                  <div>
                    <ProductPrice value={Number(product.price)}></ProductPrice>
                  </div>
                </div>
                <div className="mb-2 flex justify-between">
                  <div>Status</div>
                  {product.stock > 0 ? (
                    <Badge variant="outline">In Stock</Badge>
                  ) : (
                    <Badge variant="outline">Out Of Stock</Badge>
                  )}
                </div>
                {product.stock > 0 && (
                  <div className="flex justify-center items-center">
                    <AddToCart
                      cart={cart}
                      item={{
                        productId: product.id,
                        name: product.name,
                        slug: product.slug,
                        price: product.price.toString(),
                        qty: 1,
                        image: product.images![0],
                      }}
                    ></AddToCart>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
      <section className="mt-10">
        <h2 className="font-bold text-2xl lg:text-3xl">Customer Reviews</h2>
        <ReviewList userId={userId || ''} productId={product.id} productSlug={product.slug} />
      </section>
    </>
  );
};

export default ProductDetailPage;
