import Link from 'next/link';
import { getAllProducts } from '@/lib/actions/product.action';
import { formatCurrency, shortenUUID } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import Pagination from '@/components/shared/pagination';
import DeleteDialog from '@/components/shared/delete-dialog';
import { deleteProduct } from '@/lib/actions/product.action';

const AdminProductPage = async (props: {
  searchParams: Promise<{
    page: string;
    query: string;
    category: string;
  }>;
}) => {
  const { page, query, category } = await props.searchParams;
  const pageNumber = Number(page) || 1;
  const searchText = query || '';
  const categoryFilter = category || '';

  const product = await getAllProducts({
    query: searchText,
    page: pageNumber,
    category: categoryFilter,
  });

  return (
    <div className="space-y-2">
      <div className="flex-between">
        <h1 className="font-bold text-2xl lg:text-3xl">Products</h1>
        <Button asChild variant="default" className="bg-black text-white hover:bg-gray-800">
          <Link href="/admin/products/create">Create Product</Link>
        </Button>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>ID</TableHead>
            <TableHead>NAME</TableHead>
            <TableHead className="text-right">PRICE</TableHead>
            <TableHead>CATEGORY</TableHead>
            <TableHead>STOCK</TableHead>
            <TableHead>RATING</TableHead>
            <TableHead className="w-[100px]">ACTIONS</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {product.data.map((item) => (
            <TableRow key={item.id}>
              <TableCell>
                <Link href={`/admin/products/${item.id}`}>{shortenUUID(item.id)}</Link>
              </TableCell>
              <TableCell>{item.name}</TableCell>
              <TableCell className="text-right">{formatCurrency(item.price.toString())}</TableCell>
              <TableCell>{item.category}</TableCell>
              <TableCell>{item.stock}</TableCell>
              <TableCell>{item.rating.toString()}</TableCell>
              <TableCell>
                <Button variant="outline" className="bg-neutral-800 text-white">
                  <Link href={`/admin/products/${item.id}`}>Edit</Link>
                </Button>
                <DeleteDialog id={item.id} action={deleteProduct} />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      {product?.totalPages > 1 && (
        <Pagination page={Number(page) || 1} totalPages={product?.totalPages} />
      )}
    </div>
  );
};

export default AdminProductPage;
