import ProductList from '@/components/shared/product/product-list';
import { getLatestProducts } from '@/lib/actions/product.action';

const Homepage = async () => {
  const latestProducts = await getLatestProducts();

  const normalized = latestProducts.map((product) => ({
    ...product,
    price: product.price.toString(),
    rating: Number(product.rating),
  }));

  return (
    <>
      <ProductList
        // data={sampleData.products}
        data={normalized}
        title="Newest Arrivals"
        limit={4}
      ></ProductList>
    </>
  );
};

export default Homepage;
