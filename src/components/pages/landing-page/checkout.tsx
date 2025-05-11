"use client";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import ProgressStepper from "@/components/ui/progress-stepper";
import { Separator } from "@/components/ui/separator";
import { UseGetCart } from "@/features/cart/api/use-get-cart";
import { CartItem } from "@/features/cart/components/card-cart";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { Cart } from "@/types/cart";
import { CalendarIcon, Clock } from "lucide-react";
import React, { useEffect, useState } from "react";
import { format } from "date-fns";
import clsx from "clsx";
import { FormLabel } from "@/components/ui/form";
import {
  Form,
  FormField,
  FormItem,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";

import { z } from "zod";
import { useForm } from "react-hook-form";
import { formatRupiah } from "@/helper/format-rupiah";
import { emailSchema, nameSchema, phoneSchema } from "@/schemas/auth";
import { Input } from "@/components/ui/input";
import { UseCreateTransaction } from "@/features/transaction/api/use-create-transaction";
import { useSession } from "next-auth/react";
import UnauthorizePage from "../unauthorize";

export const transactionSchema = z.object({
  date: z.date({ required_error: "Tanggal harus dipilih" }),
  time: z.string().regex(/^\d{2}:\d{2}$/, { message: "Format harus HH:mm" }),
  name: nameSchema,
  email: emailSchema,
  phone: phoneSchema,
});

export type TransactionSchema = z.infer<typeof transactionSchema>;

const CheckoutPage = () => {
  const { data: session } = useSession();
  const { toast } = useToast();
  const [hour, setHour] = useState<number | null>(null);
  const [minute, setMinute] = useState<number | null>(null);

  const form = useForm<TransactionSchema>({
    resolver: zodResolver(transactionSchema),
    defaultValues: {
      date: undefined,
      time: "",
      name: "",
      email: "",
      phone: "",
    },
  });

  const { data: cartData } = UseGetCart({
    onError(e) {
      console.log(e);
      toast({
        title: "Error",
        description: e.message,
        variant: "destructive",
      });
    },
  });

  const { mutate: createTransaction, isPending: transactionLoading } =
    UseCreateTransaction({
      onError(e) {
        console.log(e);
        toast({
          title: "Error",
          description: e.message,
          variant: "destructive",
        });
      },
      onSuccess() {
        form.reset();
        toast({
          title: "Berhasil",
          description: "Transaksi berhasil dibuat.",
        });
      },
    });

  const onSubmit = (data: TransactionSchema) => {
    if (!cartData || cartData.length === 0) {
      toast({
        title: "Keranjang kosong",
        description: "Silakan tambahkan produk sebelum checkout.",
        variant: "destructive",
      });
      return;
    }

    const payload = {
      ...data,
      cart: cartData.map((item: Cart) => ({
        product_id: item.id,
        quantity: item.quantity,
        size: item.size,
        price: item.price,
      })),
    };

    createTransaction(payload);
  };

  useEffect(() => {
    if (hour !== null && minute !== null) {
      const formatted = `${String(hour).padStart(2, "0")}:${String(
        minute
      ).padStart(2, "0")}`;
      form.setValue("time", formatted);
    }
  }, [hour, minute, form]);

  const totalPrice =
    cartData?.reduce(
      (acc: number, item: Cart) => acc + item.price * item.quantity,
      0
    ) ?? 0;

  if (!session) {
    return <UnauthorizePage />;
  }

  return (
    <div className="relative w-full max-w-screen-xl mx-auto px-4 py-6">
      <ProgressStepper currentStep={2} className="mb-8" />
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="grid grid-cols-1 md:grid-cols-2 gap-10"
        >
          <section className="space-y-6">
            <h4 className="font-medium text-xl">Order Summary</h4>
            <div className="flex flex-col gap-4 w-full border rounded-md p-4">
              {cartData?.map((item: Cart) => (
                <React.Fragment key={item.id}>
                  <CartItem
                    variant="checkout"
                    id={item.id}
                    quantity={item.quantity}
                    size={item.size}
                    image={item.image}
                    title={item.name}
                    price={item.price}
                  />
                  {item.id !== cartData?.length && <Separator />}
                </React.Fragment>
              ))}
            </div>
            <div className="grid grid-cols-2 gap-4 w-full">
              {/* Date */}
              <FormField
                control={form.control}
                name="date"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Collection Date</FormLabel>
                    <FormControl>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className={cn(
                              "w-full justify-start text-left font-normal",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {field.value ? (
                              format(field.value, "PPP")
                            ) : (
                              <span>Choose date</span>
                            )}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-2 flex flex-col gap-2">
                          <Button
                            variant="outline"
                            onClick={() => field.onChange(new Date())}
                          >
                            Today
                          </Button>
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Time */}
              <FormField
                control={form.control}
                name="time"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel>Collection Time</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={clsx(
                            "w-full justify-start text-left font-normal",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          <Clock className="mr-2 h-4 w-4" />
                          {field.value || <span>Choose time</span>}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="flex gap-4 p-4 w-fit">
                        {/* Hour Picker */}
                        <div className="flex flex-col max-h-[200px] overflow-y-auto pr-2 no-scrollbar">
                          {Array.from({ length: 24 }, (_, i) => (
                            <Button
                              key={i}
                              type="button"
                              variant={hour === i ? "default" : "ghost"}
                              onClick={() => setHour(i)}
                              className="justify-start"
                            >
                              {String(i).padStart(2, "0")}
                            </Button>
                          ))}
                        </div>

                        {/* Minute Picker */}
                        <div className="flex flex-col max-h-[200px] overflow-y-auto pr-2 no-scrollbar">
                          {Array.from({ length: 60 }, (_, i) => (
                            <Button
                              key={i}
                              type="button"
                              variant={minute === i ? "default" : "ghost"}
                              onClick={() => setMinute(i)}
                              className="justify-start"
                            >
                              {String(i).padStart(2, "0")}
                            </Button>
                          ))}
                        </div>
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between text-sm text-[#6C6C6C]">
                <h6 className="font-medium">Subtotal</h6>
                <span>{formatRupiah(totalPrice)}</span>
              </div>
              <Separator />
              <div className="flex items-center justify-between text-sm text-[#6C6C6C]">
                <h6 className="font-medium">Shipping fee</h6>
                <span className="text-[#67CB93] font-semibold">FREE</span>
              </div>
              <Separator />
              <div className="flex items-center justify-between text-sm text-[#6C6C6C]">
                <h6 className="font-medium">Total due</h6>
                <span>{formatRupiah(totalPrice)}</span>
              </div>
            </div>
          </section>
          <section className="flex flex-col space-y-6">
            <h4 className="font-medium text-xl">Contact Detail</h4>
            <div className="space-y-4 p-8 bg-[#FCFCFC] shadow-sm rounded-sm">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nama Lengkap</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="John Doe" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        {...field}
                        placeholder="FZq3P@example.com"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nomor HP</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="+628123456789" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <Button
              type="submit"
              disabled={transactionLoading}
              className="w-fit ml-auto"
              size={"lg"}
            >
              {transactionLoading ? "Loading..." : "Continue"}
            </Button>
          </section>
        </form>
      </Form>
    </div>
  );
};

export default CheckoutPage;
