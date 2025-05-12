"use client";

import React from "react";
import Image from "next/image";
import logomeeshatext from "../../../public/logomeeshatext.svg";
import { useRouter, usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Flower,
  BookOpenCheck,
  BadgePercent,
  MessageCircleMore,
  Settings,
  LogOut,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronRight, type LucideIcon } from "lucide-react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubItem,
  SidebarMenuSubButton,
} from "@/components/ui/sidebar";
import { useSession, signOut } from "next-auth/react";

const menuAtas = [
  { title: "Dashboard", url: "/dashboard", icon: LayoutDashboard },
];

const menuTengah = [
  {
    title: "Produk",
    url: "#",
    icon: Flower,
    items: [
      {
        title: "Daftar Kategori",
        url: "/dashboard/products/category",
      },
      {
        title: "Daftar Produk",
        url: "/dashboard/products",
      },
    ],
  },
  { title: "Pesanan", url: "/dashboard/orders", icon: BookOpenCheck },
  { title: "Diskon", url: "/dashboard/discount", icon: BadgePercent },
  { title: "Pesan", url: "/dashboard/message", icon: MessageCircleMore },
];

export function NavMain({
  items,
}: {
  items: {
    title: string;
    url: string;
    icon: LucideIcon;
    isActive?: boolean;
    items?: { title: string; url: string }[];
  }[];
}) {
  const router = useRouter();
  const pathname = usePathname();

  return (
    <SidebarMenu>
      {items.map((item) => {
        const isActive = pathname === item.url;

        return (
          <Collapsible
            key={item.title}
            asChild
            defaultOpen={item.isActive}
            className="group/collapsible"
          >
            <SidebarMenuItem>
              <CollapsibleTrigger asChild>
                <SidebarMenuButton
                  tooltip={item.title}
                  onClick={() => router.push(item.url)}
                  className={`${
                    isActive
                      ? "bg-pink-200 text-pink-600 font-semibold"
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  {item.icon && <item.icon />}
                  <span>{item.title}</span>
                  {item.items && (
                    <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                  )}
                </SidebarMenuButton>
              </CollapsibleTrigger>

              {item.items && (
                <CollapsibleContent>
                  <SidebarMenuSub>
                    {item.items.map((subItem) => (
                      <SidebarMenuSubItem key={subItem.title}>
                        <SidebarMenuSubButton asChild>
                          <button onClick={() => router.push(subItem.url)}>
                            <span>{subItem.title}</span>
                          </button>
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                    ))}
                  </SidebarMenuSub>
                </CollapsibleContent>
              )}
            </SidebarMenuItem>
          </Collapsible>
        );
      })}
    </SidebarMenu>
  );
}

export function SidebarAdmin({
  ...props
}: React.ComponentProps<typeof Sidebar>) {
  const { data: session } = useSession();
  const router = useRouter();

  return (
    <Sidebar
      className="bg-white text-gray-800 shadow-md"
      collapsible="icon"
      {...props}
    >
      {/* Logo */}
      <SidebarHeader className="items-center justify-center p-6 bg-white">
        <Image
          src={logomeeshatext || "/placeholder.svg"}
          className="w-32 h-auto"
          width={200}
          height={100}
          alt="logomeeshatext"
        />
      </SidebarHeader>

      {/* Menu utama */}
      <SidebarContent className="w-full space-y-2 px-2 bg-white">
        <NavMain items={menuAtas} />
      </SidebarContent>

      {/* Menu tengah */}
      <SidebarContent className="w-full mt-3 px-2 space-y-2 border-t pt-2 bg-white">
        <NavMain items={menuTengah} />
      </SidebarContent>

      {/* Footer Sidebar */}
      <SidebarFooter className="w-full bg-white border-t mt-auto">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <div className="flex items-center gap-3 p-2 rounded-md hover:bg-gray-100 hover:cursor-pointer">
              <Button variant="ghost" size={"icon"}>
                <Avatar>
                  <AvatarImage
                    src={session?.user?.image || "/default-profile.png"}
                    alt={session?.user?.name || "User"}
                  />
                  <AvatarFallback>
                    {session?.user?.name?.charAt(0).toUpperCase() || "U"}
                  </AvatarFallback>
                </Avatar>
              </Button>
              <div className="group-data-[collapsible=icon]:hidden">
                <p className="text-sm font-medium line-clamp-1">
                  {session?.user.name}
                </p>
                <p className="text-xs text-muted-foreground">
                  {session?.user.email}
                </p>
              </div>
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56" align="start" forceMount>
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none">
                  {session?.user.name}
                </p>
                <p className="text-xs leading-none text-muted-foreground">
                  {session?.user.email}
                </p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem
                onClick={() => router.push("/dashboard/pengaturan")}
              >
                <Settings className="mr-2 h-4 w-4" />
                Pengaturan
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => signOut({ callbackUrl: "/login" })}
            >
              <LogOut className="mr-2 h-4 w-4" />
              Keluar
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}

export default SidebarAdmin;
