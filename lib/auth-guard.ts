import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import { getUserById } from './actions/user.action';

export async function requireAdmin() {
  const session = await auth();
  const user = await getUserById(session?.user?.id ?? '');

  if (!session || user?.role !== 'admin') {
    redirect('/unauthorized');
  }
}
