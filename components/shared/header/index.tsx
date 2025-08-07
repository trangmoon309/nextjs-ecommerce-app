import Image from 'next/image';
import Link from 'next/link';
import { APP_NAME } from '@/lib/constants';
import Menu from './menu';
import MainNav from '@/app/user/main-nav';
import CategoryDrawer from './category-draw';

const Header = () => {
  return (
    <header className="w-full border-b">
      <div className="max-w-7xl lg:mx-auto p-5 md:px-10 w-full flex justify-between items-center">
        <div className="flex justify-start items-center">
          <CategoryDrawer />
          <Link href="/" className="flex justify-start items-center ml-4">
            <Image
              src="/images/logo.svg"
              alt={`${APP_NAME} logo`}
              height={48}
              width={48}
              priority
            />
            {/* <span className="font-bold text-2xl ml-3">{APP_NAME}</span> */}
          </Link>
          <MainNav className="mx-6" />
        </div>
        <div className="space-x-2">
          <Menu />
        </div>
      </div>
    </header>
  );
};

export default Header;
