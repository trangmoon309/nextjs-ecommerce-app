import { auth } from '@/auth';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { getUserById } from '@/lib/actions/user.action';
import UserDropdown from './user-dropdown';

const UserButton = async () => {
  const session = await auth();

  if (!session) {
    return (
      <Button asChild variant="ghost">
        <Link href="/sign-in">Sign In</Link>
      </Button>
    );
  }

  const user = await getUserById(session.user?.id || '');
  const role = user?.role ?? 'user';
  const firstInitial = user?.name?.charAt(0).toLocaleUpperCase() ?? 'U';

  return <UserDropdown user={user} role={role} firstInitial={firstInitial} />;
};

export default UserButton;
