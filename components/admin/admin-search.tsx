'use client';

import { usePathname, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Input } from '../ui/input';

const AdminSearch = () => {
  // get the path of current url
  const pathName = usePathname();
  const formActionUrl = pathName.includes('/admin/orders')
    ? '/admin/orders'
    : pathName.includes('/admin/users')
      ? '/admin/users'
      : '/admin/products';

  // get the param int current url
  const searchParam = useSearchParams();
  const [queryValue, setQueryValue] = useState(searchParam.get('query') || '');

  useEffect(() => {
    setQueryValue(searchParam.get('query') || '');
  }, [searchParam]);

  return (
    <>
      <form action={formActionUrl} method="GET" className="flex items-center space-x-2">
        <Input
          type="search"
          placeholder="Search..."
          name="query"
          value={queryValue}
          onChange={(e) => setQueryValue(e.target.value)}
          className="md:w-[100px] lg:w-[300px]"
        />
        <button className="sr-only" type="submit">
          Search
        </button>
      </form>
    </>
  );
};

export default AdminSearch;
