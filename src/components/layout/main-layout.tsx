
import type { ReactNode } from 'react';
import { SidebarProvider, Sidebar, SidebarInset, SidebarHeader, SidebarContent, SidebarMenu, SidebarMenuItem, SidebarMenuButton, SidebarFooter, SidebarMenuSub, SidebarMenuSubItem, SidebarMenuSubButton } from '@/components/ui/sidebar';
import { Home, ScanLine, ShoppingCart, User, Wrench, Barcode, Heart, Scan, LifeBuoy, Star, Briefcase, Boxes, Gavel, HelpCircle, Building, BookOpen, LayoutDashboard, ShoppingBag, MessageSquare, FileQuestion, ShieldCheck, HeartHandshake, Wand2 } from 'lucide-react';
import Link from 'next/link';
import { Header } from './header';

export function MainLayout({ children }: { children: ReactNode }) {
  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarHeader>
          <div className="flex items-center gap-2 p-2">
            <Scan className="size-8 text-primary" />
            <h1 className="text-xl font-semibold">SmartScan Hub</h1>
          </div>
        </SidebarHeader>
        <SidebarContent>
          <SidebarMenu>
            {/* Main Tools */}
            <SidebarMenuItem>
              <SidebarMenuButton asChild tooltip="Dashboard">
                <Link href="/">
                  <LayoutDashboard />
                  <span>Dashboard</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton asChild tooltip="Pricing Tool">
                <Link href="/verify">
                  <Scan />
                  <span>Pricing Tool</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
             <SidebarMenuItem>
              <SidebarMenuButton asChild tooltip="Bidding Tool">
                <Link href="/appraise-lot">
                  <Gavel />
                  <span>Bidding Tool</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton asChild tooltip="UPC Checker">
                <Link href="/upc-checker">
                  <Barcode />
                  <span>UPC Checker</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton asChild tooltip="Marketplace">
                <Link href="/marketplace">
                  <ShoppingBag />
                  <span>Marketplace</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>

            {/* ReFURRM Services */}
             <SidebarMenuItem>
              <SidebarMenuButton>
                  <Wrench />
                  <span>ReFURRM Services</span>
              </SidebarMenuButton>
              <SidebarMenuSub>
                <SidebarMenuSubItem>
                    <SidebarMenuSubButton asChild>
                        <Link href="/ambassadors/how-it-works">Ambassador Services</Link>
                    </SidebarMenuSubButton>
                </SidebarMenuSubItem>
                <SidebarMenuSubItem>
                    <SidebarMenuSubButton asChild>
                        <Link href="/agent-hub">Agent Hub</Link>
                    </SidebarMenuSubButton>
                </SidebarMenuSubItem>
                 <SidebarMenuSubItem>
                    <SidebarMenuSubButton asChild>
                        <Link href="/donate">Donate</Link>
                    </SidebarMenuSubButton>
                </SidebarMenuSubItem>
              </SidebarMenuSub>
            </SidebarMenuItem>

            {/* LEAN + Help */}
             <SidebarMenuItem>
              <SidebarMenuButton>
                  <LifeBuoy />
                  <span>LEAN + Help</span>
              </SidebarMenuButton>
              <SidebarMenuSub>
                 <SidebarMenuSubItem>
                    <SidebarMenuSubButton asChild>
                      <Link href="/donate">LEAN Foundation</Link>
                    </SidebarMenuSubButton>
                  </SidebarMenuSubItem>
                  <SidebarMenuSubItem>
                    <SidebarMenuSubButton asChild>
                      <Link href="/donate/faq">Donation FAQ</Link>
                    </SidebarMenuSubButton>
                  </SidebarMenuSubItem>
                  <SidebarMenuSubItem>
                    <SidebarMenuSubButton asChild>
                      <Link href="/faq">App FAQ</Link>
                    </SidebarMenuSubButton>
                  </SidebarMenuSubItem>
                  <SidebarMenuSubItem>
                    <SidebarMenuSubButton asChild>
                      <Link href="/help">Help</Link>
                    </SidebarMenuSubButton>
                  </SidebarMenuSubItem>
              </SidebarMenuSub>
            </SidebarMenuItem>

            <SidebarMenuItem>
              <SidebarMenuButton asChild tooltip="Prompt Studio">
                <Link href="/prompt-studio">
                  <Wand2 />
                  <span>Prompt Studio</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            
          </SidebarMenu>
        </SidebarContent>
        <SidebarFooter>
          <SidebarMenu>
             <SidebarMenuItem>
              <SidebarMenuButton asChild tooltip="Upgrade">
                <Link href="/subscription">
                  <Star />
                  <span>Upgrade</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton asChild tooltip="Account">
                <Link href="/account">
                  <User />
                  <span>Account</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarFooter>
      </Sidebar>
      <SidebarInset>
        <Header />
        <main className="p-4 lg:p-6">{children}</main>
      </SidebarInset>
    </SidebarProvider>
  );
}
