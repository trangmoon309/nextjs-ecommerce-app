import { Metadata } from 'next';
import { auth } from '@/auth';
import { SessionProvider } from 'next-auth/react';
import ProfileForm from './profile-form';

export const metadata: Metadata = {
  title: 'Profile',
  description: 'User profile page',
};

const ProfilePage = async () => {
  const session = await auth();

  return (
    <SessionProvider session={session}>
      <div className="max-w-md mx-auto space-y-4">
        <h1 className="font-bold text-2xl lg:text-3xl;">Profile</h1>
        <p>{session?.user?.name}</p>
        <ProfileForm />
      </div>
    </SessionProvider>
  );
};

export default ProfilePage;
