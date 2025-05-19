import { Card, CardContent, CardHeader } from "@/components/ui/card";
import Image from "next/image";
import Link from "next/link";
import ProductPrice from "./product-price";
import { Product } from "@/types";

const ProductCard = ({product}: {product: Product}) => {
    return ( <Card className="w-full max-w-sm border-gray-100 shadow-none">
        <CardHeader className="p-0 items-center">
            <Link href={`/products/${product.slug}`}></Link>
            <Image src={product.images[0]} alt={product.name} height={300} width={300} priority={true}></Image>
        </CardHeader>
        <CardContent className="p-4 grid gap-4">
            <div className="text-xs">{product.brand}</div>
            <Link href={`/products/${product.slug}`}>
                <h2 className="text-sm font-medium">{product.name}</h2>
            </Link>
            <div className="flex justify-between items-center gap-4">
                <p>{product.rating} Stars</p>
                {product.stock > 0 ? (
                    <ProductPrice value={Number(product.price)} className="text-red-500"></ProductPrice>
                ) : (
                    <p className="text-destructive text-red-500">Out Of Stock</p>
                )}
            </div>
        </CardContent>
    </Card> );
}
 
export default ProductCard;