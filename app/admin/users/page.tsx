import DeleteDialog from '@/components/shared/delete-dialog';
import Pagination from '@/components/shared/pagination';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { deleteUser, getAllUsers } from '@/lib/actions/user.action';
import { shortenUUID } from '@/lib/utils';
import { Metadata } from 'next';
import Link from 'next/link';

const metadata: Metadata = {
  title: 'Admin Users',
  description: 'Manage users in the admin panel.',
};

const AdminUsersPage = async (props: {
  searchParams: Promise<{ page: string; query: string }>;
}) => {
  const { page = '1', query: searchText } = await props.searchParams;
  const users = await getAllUsers({
    limit: 10,
    page: Number(page),
    query: searchText,
  });

  console.log('users :>> ', users);

  if (!users) {
    return <div>No users found.</div>;
  }

  return (
    <div className="space-y-2">
      <div className="flex-between">
        <div className="flex items-center gap-3">
          <h1 className="font-bold text-2xl lg:text-3xl">Users</h1>
          <br></br>
          {searchText && (
            <div>
              Filtered by <i>&quot;{searchText}&quot;</i>
              {'   '}
              <Link href={`/admin/users`}>
                <Button
                  variant="outline"
                  size="sm"
                  className="bg-white text-black hover:bg-gray-300"
                >
                  Remove Filter
                </Button>
              </Link>
            </div>
          )}
        </div>
      </div>
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>NAME</TableHead>
              <TableHead>EMAIL</TableHead>
              <TableHead>ROLE</TableHead>
              <TableHead>ACTIONS</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users?.data?.map((user) => (
              <TableRow key={user.id}>
                <TableCell>
                  <Link href={`/user/${user.id}`}>{shortenUUID(user.id)}</Link>
                </TableCell>
                <TableCell>{user.name}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>
                  {user.role === 'user' ? (
                    <Badge className="mt-2 bg-yellow-600 text-white">User</Badge>
                  ) : (
                    <Badge className="mt-2 bg-green-600 text-white">Admin</Badge>
                  )}
                </TableCell>
                <TableCell>
                  <Button variant="outline" className="bg-neutral-800 text-white">
                    <Link href={`/admin/users/${user.id}`}>Details</Link>
                  </Button>
                  <DeleteDialog id={user.id} action={deleteUser} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        {users?.totalPages > 1 && (
          <Pagination page={Number(page) || 1} totalPages={users?.totalPages} />
        )}
      </div>
    </div>
  );
};

export default AdminUsersPage;
