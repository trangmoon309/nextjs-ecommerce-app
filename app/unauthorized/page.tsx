import { Button } from '@/components/ui/button';
import { Metadata } from 'next';
import Link from 'next/link';

const metadata: Metadata = {
  title: 'Unauthorized',
};

const UnauthorizedPage = () => {
  return (
    <div className="container mx-auto flex flex-col items-center justify-center space-y-4 h-screen">
      <h1 className="text-4xl font-bold mb-4">Unauthorized Access</h1>
      <p className="text-lg mb-6">You do not have permission to access this page.</p>
      <Button variant="outline" className="bg-black text-white hover:bg-gray-800">
        <Link href="/">Go to Home</Link>
      </Button>
    </div>
  );
};

export default UnauthorizedPage;
