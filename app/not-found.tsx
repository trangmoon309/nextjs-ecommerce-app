'use client';
import { APP_NAME } from '@/lib/constants';
import Image from 'next/image';
import { Button } from '@/components/ui/button';

const NotFound = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <Image
        src="/images/logo.svg"
        width={48}
        height={48}
        alt={`${APP_NAME}`}
        priority={true}
      ></Image>
      <div className="p-6 rounded-lg shadow-md text-center">
        <h1 className="text-3xl font-bold md-4">Not Found</h1>
        <p className="text-destructive text-orange-700">Could not find requested page</p>
        <Button
          variant="outline"
          className="mt-4 ml-2"
          onClick={() => {
            window.location.href = '/';
          }}
        >
          Back To Home
        </Button>
      </div>
    </div>
  );
};

export default NotFound;
