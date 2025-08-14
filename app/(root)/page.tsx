import DealCountdown from '@/components/deal-countdown';
import IconBoxes from '@/components/icon-boxes';
import ProductCarousel from '@/components/shared/product/product-carousel';
import ProductList from '@/components/shared/product/product-list';
import ViewAppProductsButton from '@/components/view-all-products-button';
import { getFeaturedProducts, getLatestProducts } from '@/lib/actions/product.action';

const Homepage = async () => {
  const latestProducts = await getLatestProducts();
  const featuredProducts = await getFeaturedProducts();

  const normalized = latestProducts.map((product) => ({
    ...product,
    price: product.price.toString(),
    rating: Number(product.rating),
  }));

  return (
    <>
      {featuredProducts.length > 0 && <ProductCarousel data={featuredProducts} />}
      <ProductList
        // data={sampleData.products}
        data={normalized}
        title="Newest Arrivals"
        limit={4}
      ></ProductList>
      <ViewAppProductsButton />
      <DealCountdown />
      <IconBoxes />
    </>
  );
};

export default Homepage;
