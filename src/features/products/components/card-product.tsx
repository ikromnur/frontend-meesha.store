import { Product } from "@/types/product";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";
import { formatRupiah } from "@/helper/format-rupiah";
import { IoMdAdd } from "react-icons/io";
import { MdOutlineImage } from "react-icons/md";
import { useSession } from "next-auth/react";
import { useToast } from "@/hooks/use-toast";
import { UseAddCart } from "@/features/cart/api/use-add-cart";

export const CardProduct = ({ product }: { product: Product }) => {
  const { data: session } = useSession();
  const { toast } = useToast();
  const { name, imageUrl, description, price } = product;

  const { mutate, isPending } = UseAddCart({
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Product added to cart",
      });
    },
    onError: (e) => {
      console.log(e);
      toast({
        title: "Failed",
        description: "Failed to add product to cart",
      });
    },
  });

  const handleAddToCart = () => {
    if (!session) {
      toast({
        title: "Please log in",
        description: "You need to log in to add items to the cart.",
        variant: "destructive",
      });
      return;
    }
    mutate({
      cartId: Number(product?.id),
      quantity: 1,
    });
  };

  return (
    <div className="relative hover:scale-105 duration-300 transition-transform">
      <Button
        disabled={isPending}
        className="absolute top-2 right-2 z-10"
        size={"icon"}
        type="button"
        onClick={handleAddToCart}
      >
        <IoMdAdd />
      </Button>
      <Link href={`/products/${product.id}`}>
        {imageUrl ? (
          <Image
            className="aspect-square mb-4 w-full object-cover"
            src={imageUrl}
            width={100}
            height={100}
            loading="lazy"
            alt="product"
          />
        ) : (
          <div className="aspect-square mb-4 w-full bg-muted flex items-center justify-center">
            <MdOutlineImage size={40} className="text-muted-foreground" />
          </div>
        )}
        <h4 className="font-semibold text-xl line-clamp-1">{name}</h4>
        <span className="text-[#676767] text-sm line-clamp-1">
          {description}
        </span>
        <span className="font-medium">{formatRupiah(price)}</span>
      </Link>
    </div>
  );
};
