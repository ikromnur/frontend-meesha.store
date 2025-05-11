"use client";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

import ProgressStepper from "@/components/ui/progress-stepper";
import { CartItem } from "@/features/cart/components/card-cart";
import React from "react";
import { UseGetCart } from "@/features/cart/api/use-get-cart";
import { useToast } from "@/hooks/use-toast";
import { Cart } from "@/types/cart";
import { formatRupiah } from "@/helper/format-rupiah";
import { UseUpdateCart } from "@/features/cart/api/use-update-cart";
import { UseDeleteCart } from "@/features/cart/api/use-delete-cart";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import UnauthorizePage from "../unauthorize";

export default function CartPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const { toast } = useToast();

  const { data: cartData, refetch: refetchCart } = UseGetCart({
    onError(e) {
      console.log(e);
      toast({
        title: "Error",
        description: e.message,
        variant: "destructive",
      });
    },
  });

  const { mutate: updateCart } = UseUpdateCart({
    onSuccess: () => {
      refetchCart();
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update cart",
        variant: "destructive",
      });
    },
  });

  const { mutate: deleteCart } = UseDeleteCart({
    onSuccess: () => {
      refetchCart();
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to delete cart",
        variant: "destructive",
      });
    },
  });

  const handleDeleteCart = (id: number) => {
    deleteCart(id);
  };

  const handleChangeQuantity = (id: number, quantity: number) => {
    updateCart({ cartId: id, quantity });
  };

  const totalAmount = cartData?.reduce(
    (total: number, item: Cart) => total + item.price * item.quantity,
    0
  );

  if (!session) {
    return <UnauthorizePage />;
  }

  return (
    <div className="relative w-full max-w-screen-xl mx-auto px-4 py-6">
      <ProgressStepper currentStep={1} className="mb-8" />
      <div className="flex flex-col md:flex-row gap-12 md:gap-14 lg:gap-16">
        <div className="flex flex-col gap-4 w-full border rounded-md p-4">
          {cartData?.map((item: Cart) => (
            <React.Fragment key={item.id}>
              <CartItem
                id={item.id}
                quantity={item.quantity}
                size={item.size}
                image={item.image}
                title={item.name}
                price={item.price}
                deleteCart={handleDeleteCart}
                handleChangeQuantity={handleChangeQuantity}
              />
              {item.id !== cartData?.length && <Separator />}
            </React.Fragment>
          ))}
        </div>
        {/* Price */}
        <div className="w-full md:max-w-80 lg:max-w-96 space-y-4">
          <h4 className="font-semibold">Price Detail</h4>
          <div className="bg-gray-100 rounded-md p-4 text-sm">
            <h6 className="font-medium">{cartData?.length} item</h6>
            <div className="space-y-2 py-2">
              {cartData?.map((item: Cart) => (
                <div
                  key={item.id}
                  className="flex justify-between items-center"
                >
                  <span>
                    {" "}
                    <span>{item.quantity} x</span> {item.name}
                  </span>
                  <span>{formatRupiah(item.price)}</span>
                </div>
              ))}
            </div>
            <Separator className="my-2" />
            {/* Total */}
            <div className="flex justify-between items-center font-medium">
              <h6 className="pt-3">Total amount</h6>
              <span>{formatRupiah(totalAmount)}</span>
            </div>
          </div>
          <Button
            onClick={() => router.push("/checkout")}
            size={"lg"}
            className="w-full"
          >
            Checkout
          </Button>
        </div>
      </div>
    </div>
  );
}
