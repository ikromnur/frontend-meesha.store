"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import CardTransaction from "@/features/transaction/components/card-transaction";
import { useUpdateSearchParams } from "@/hooks/use-search-params";
import { Order } from "@/types/order";
import UnauthorizePage from "../unauthorize";
import { useSession } from "next-auth/react";

const orders: Order[] = [
  {
    id: 1,
    productName: "Bouquet-01",
    date: "01-02-2025",
    price: 100000,
    paymentMethod: "QRIS",
    quantity: 1,
    statusPembayaran: "Lunas",
    statusPesanan: "Selesai",
  },
  {
    id: 2,
    productName: "Bouquet-02",
    date: "03-02-2025",
    price: 150000,
    paymentMethod: "Transfer",
    quantity: 2,
    statusPembayaran: "Belum Bayar",
    statusPesanan: "Pending",
  },
  {
    id: 3,
    productName: "Bouquet-03",
    date: "05-02-2025",
    price: 120000,
    paymentMethod: "QRIS",
    quantity: 1,
    statusPembayaran: "Lunas",
    statusPesanan: "Selesai",
  },
  {
    id: 4,
    productName: "Bouquet-04",
    date: "07-02-2025",
    price: 130000,
    paymentMethod: "COD",
    quantity: 1,
    statusPembayaran: "Belum Bayar",
    statusPesanan: "Pending",
  },
  {
    id: 5,
    productName: "Bouquet-05",
    date: "09-02-2025",
    price: 200000,
    paymentMethod: "QRIS",
    quantity: 3,
    statusPembayaran: "Lunas",
    statusPesanan: "Selesai",
  },
  {
    id: 6,
    productName: "Bouquet-06",
    date: "11-02-2025",
    price: 180000,
    paymentMethod: "Transfer",
    quantity: 1,
    statusPembayaran: "Gagal",
    statusPesanan: "Dibatalkan",
  },
  {
    id: 7,
    productName: "Bouquet-07",
    date: "13-02-2025",
    price: 110000,
    paymentMethod: "QRIS",
    quantity: 2,
    statusPembayaran: "Lunas",
    statusPesanan: "Selesai",
  },
  {
    id: 8,
    productName: "Bouquet-08",
    date: "15-02-2025",
    price: 170000,
    paymentMethod: "COD",
    quantity: 1,
    statusPembayaran: "Belum Bayar",
    statusPesanan: "Pending",
  },
  {
    id: 9,
    productName: "Bouquet-09",
    date: "17-02-2025",
    price: 160000,
    paymentMethod: "QRIS",
    quantity: 2,
    statusPembayaran: "Lunas",
    statusPesanan: "Selesai",
  },
  {
    id: 10,
    productName: "Bouquet-10",
    date: "19-02-2025",
    price: 190000,
    paymentMethod: "Transfer",
    quantity: 1,
    statusPembayaran: "Gagal",
    statusPesanan: "Dibatalkan",
  },
];

const tabs = [
  { label: "Semua", value: "all", filter: () => true },
  {
    label: "Pending",
    value: "pending",
    filter: (o: Order) => o.statusPesanan === "Pending",
  },
  {
    label: "Selesai",
    value: "success",
    filter: (o: Order) => o.statusPesanan === "Selesai",
  },
  {
    label: "Dibatalkan",
    value: "cancel",
    filter: (o: Order) => o.statusPesanan === "Dibatalkan",
  },
];

const HistoryPage = () => {
  const { data: session } = useSession();
  const { params, updateParams } = useUpdateSearchParams();

  const currentTab = params.filter ?? "all";

  const handleTabChange = (value: string) => {
    updateParams({ filter: value });
  };

  if (!session) {
    return <UnauthorizePage />;
  }

  return (
    <div className="relative w-full max-w-screen-xl mx-auto px-4 pt-6">
      <h1 className="font-medium text-2xl mb-8">Order History</h1>
      <Tabs value={currentTab} onValueChange={handleTabChange}>
        <TabsList className="mb-5">
          {tabs.map((tab) => (
            <TabsTrigger key={tab.value} value={tab.value}>
              {tab.label}
            </TabsTrigger>
          ))}
        </TabsList>

        {tabs.map((tab) => (
          <TabsContent
            key={tab.value}
            value={tab.value}
            className="flex flex-col gap-5"
          >
            {orders.filter(tab.filter).map((order) => (
              <CardTransaction key={order.id} order={order} />
            ))}
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
};

export default HistoryPage;
