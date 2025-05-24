import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import CredentialsSignInForm from './credentials-signin-form';
import { auth } from '@/auth';
import { redirect } from 'next/navigation';

export const metadata: Metadata = {
  title: 'Sign In',
};

const SignInPage = async () => {
  const session = await auth();

  if (session) {
    return redirect('/');
  }

  return (
    <div className="w-full max-w-md mx-auto">
      <Card>
        <CardHeader className="space-y-4">
          <Link href="/" className="flex justify-center items-center">
            <Image
              src="/images/logo.svg"
              width={100}
              height={100}
              alt="App logo"
              priority={true}
            ></Image>
          </Link>
          <CardTitle className="text-center">Sign In</CardTitle>
          <CardDescription className="text-center">Sign in to your account</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <CredentialsSignInForm></CredentialsSignInForm>
        </CardContent>
      </Card>
    </div>
  );
};

export default SignInPage;
