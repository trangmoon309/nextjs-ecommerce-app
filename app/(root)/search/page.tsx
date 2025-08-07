import ProductCard from '@/components/shared/product/product-card';
import { Button } from '@/components/ui/button';
import { getAllProducts, getAllCategories } from '@/lib/actions/product.action';
import Link from 'next/link';

const prices = [
  { name: '$1 to $50', value: '1-50' },
  { name: '$51 to $100', value: '51-100' },
  { name: '$101 to $200', value: '101-200' },
  { name: '$201 to $500', value: '201-500' },
  { name: '$501 and above', value: '501-999999' },
];

const ratings = [
  { name: '4 stars & up', value: '4' },
  { name: '3 stars & up', value: '3' },
  { name: '2 stars & up', value: '2' },
  { name: '1 star & up', value: '1' },
];

const sortOptions = [
  { name: 'Newest', value: 'newest' },
  { name: 'Lowest', value: 'lowest' },
  { name: 'Highest', value: 'heighest' },
  { name: 'Top Rated', value: 'rating' },
];

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

  // Construct filter URL
  const getFilterUrl = ({
    c,
    s,
    p,
    r,
    pg,
  }: {
    c?: string | undefined;
    s?: string | undefined;
    p?: string | undefined;
    r?: string | undefined;
    pg: string | undefined;
  }) => {
    const params = { query, category, price, rating, sort, page };

    if (c) params.category = c;
    if (s) params.sort = s;
    if (p) params.price = p;
    if (r) params.rating = r;
    if (pg) params.page = pg;

    return `/search?${new URLSearchParams(params)}`;
  };

  const products = await getAllProducts({
    query: query,
    category: category,
    price: price,
    rating: rating,
    sort: sort,
    page: Number(page),
  });

  var categories = await getAllCategories();

  return (
    <div className="grid md:grid-cols-5 md:gap-5">
      <div className="filter-links">
        {/*Category Filter*/}
        <div className="text-xl mb-2 mt-3">Department</div>
        <div>
          <ul className="space-y-1">
            <li>
              <Link
                className={`${(category === 'all' || category === '') && 'font-bold'}`}
                href={getFilterUrl({ c: 'all' })}
              >
                Any
              </Link>
            </li>
            {categories.map((c) => (
              <li key={c.category}>
                <Link
                  className={`${category === c.category && 'font-bold'}`}
                  href={getFilterUrl({ c: c.category })}
                >
                  {c.category}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        {/*Price Filter*/}
        <div className="text-xl mb-2 mt-3">Price</div>
        <div>
          <ul className="space-y-1">
            <li>
              <Link
                className={`${(price === 'all' || price === '') && 'font-bold'}`}
                href={getFilterUrl({ p: 'all' })}
              >
                Any
              </Link>
            </li>
            {prices.map((p) => (
              <li key={p.value}>
                <Link
                  className={`${price === p.value && 'font-bold'}`}
                  href={getFilterUrl({ p: p.value })}
                >
                  {p.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        {/*Rating Filter*/}
        <div className="text-xl mb-2 mt-3">Customer Ratings</div>
        <div>
          <ul className="space-y-1">
            <li>
              <Link
                className={`${(rating === 'all' || rating === '') && 'font-bold'}`}
                href={getFilterUrl({ r: 'all' })}
              >
                Any
              </Link>
            </li>
            {ratings.map((r) => (
              <li key={r.value}>
                <Link
                  className={`${rating === r.value && 'font-bold'}`}
                  href={getFilterUrl({ r: r.value })}
                >
                  {r.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="md:col-span-4 space-y-4">
        <div className="flex-between flex-col md:flex-row my-4">
          <div className="flex items-center">
            {query !== 'all' && query !== '' && 'Query: ' + query}
            {category !== 'all' && category !== '' && ' Category: ' + category}
            {price !== 'all' && price !== '' && ' Price: ' + price}
            {rating !== 'all' && rating !== '' && ' Rating: ' + rating}
            &nbsp;
            {(query !== 'all' && query !== '') ||
            (category !== 'all' && category !== '') ||
            (price !== 'all' && price !== '') ||
            (rating !== 'all' && rating !== '') ? (
              <Button variant="link" asChild>
                <Link href="/search">Clear Filters</Link>
              </Button>
            ) : null}
          </div>
          <div className="flex flex-row">
            Sort by:{' '}
            <ul className="space-y-1 flex flex-row">
              {sortOptions.map((option) => (
                <li key={option.value}>
                  <Link
                    className={`mx-2 ${sort === option.value ? 'font-bold' : ''}`}
                    href={getFilterUrl({ s: option.value })}
                  >
                    {option.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
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
