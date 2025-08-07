import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getUserById } from '@/lib/actions/user.action';
import UpdateUserForm from '@/components/admin/update-user-form';

export const metadata: Metadata = {
  title: 'Admin User Details',
  description: 'View and manage user details in the admin panel.',
};

const AdminUserUpdatePage = async (props: { params: Promise<{ id: string }> }) => {
  const { id } = await props.params;
  const user = await getUserById(id);

  if (!user) return notFound();

  return (
    <>
      <div className="space-y-8 max-w-5xl mx-auto">
        <h1 className="text-2xl font-bold">Update User</h1>
        <p className="text-gray-600">Update the details of the user below.</p>
        <UpdateUserForm user={user} userId={id} type="Update" />
      </div>
    </>
  );
};

export default AdminUserUpdatePage;
