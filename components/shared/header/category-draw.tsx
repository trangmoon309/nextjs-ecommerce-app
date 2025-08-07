import { Button } from '@/components/ui/button';
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '@/components/ui/drawer';
import { getAllCategories } from '@/lib/actions/product.action';
import { MenuIcon } from 'lucide-react';
import Link from 'next/link';

const CategoryDrawer = async () => {
  const categories = await getAllCategories();
  return (
    <Drawer direction="left">
      <DrawerTrigger asChild>
        <Button variant="outline">
          <MenuIcon />
        </Button>
      </DrawerTrigger>
      <DrawerContent className="h-full max-w-sm bg-white text-black">
        <DrawerHeader>
          <DrawerTitle className="mt-2">Select a category</DrawerTitle>
          <div className="space-y-1">
            {categories.map((category) => (
              <Button
                key={category.category}
                variant="ghost"
                className="w-full justify-start hover:bg-gray-100"
                asChild
              >
                <DrawerClose asChild>
                  <Link href={`/search?category=${category.category}`}>
                    {category.category} ({category._count})
                  </Link>
                </DrawerClose>
              </Button>
            ))}
          </div>
        </DrawerHeader>
      </DrawerContent>
    </Drawer>
  );
};

export default CategoryDrawer;
