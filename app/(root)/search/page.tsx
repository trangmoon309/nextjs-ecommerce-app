import ProductCard from '@/components/shared/product/product-card';
import { getAllProducts } from '@/lib/actions/product.action';

const SearchPage = async (props: {
  searchParams: {
    query?: string;
    category?: string;
    price?: string;
    rating?: string;
    sort?: string;
    page?: string;
  };
}) => {
  const {
    query = 'all',
    category = 'all',
    price = 'all',
    rating = 'all',
    sort = 'newest',
    page = '1',
  } = await props.searchParams;

  const products = await getAllProducts({
    query: query,
    category: category,
    price: price,
    rating: rating,
    sort: sort,
    page: Number(page),
  });
  return (
    <div className="grid md:grid-cols-5 md:gap-5">
      <div className="filter-links">{/* Add filter links here */}</div>
      <div className="md:col-span-4 space-y-4">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {products.data.length > 0 ? (
            products.data.map((product) => <ProductCard key={product.id} product={product} />)
          ) : (
            <div className="col-span-3">No products found</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SearchPage;
