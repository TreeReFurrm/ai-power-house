
import type { ReactNode } from 'react';
import { SidebarProvider, Sidebar, SidebarInset, SidebarHeader, SidebarContent, SidebarMenu, SidebarMenuItem, SidebarMenuButton, SidebarFooter, SidebarMenuSub, SidebarMenuSubItem, SidebarMenuSubButton } from '@/components/ui/sidebar';
import { User, Wrench, Barcode, Gavel, HelpCircle, LayoutDashboard, ShoppingBag, Briefcase, LifeBuoy, Star, Scan, ShieldHeart, GitFork, HeartHandshake, FileQuestion } from 'lucide-react';
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
            {/* Main Hub */}
             <SidebarMenuItem>
              <SidebarMenuButton asChild tooltip="Dashboard">
                <Link href="/">
                  <LayoutDashboard />
                  <span>Main Hub</span>
                </Link>
              </SidebarMenuButton>
              <SidebarMenuSub>
                 <SidebarMenuSubItem>
                  <SidebarMenuSubButton asChild>
                    <Link href="/">Dashboard</Link>
                  </SidebarMenuSubButton>
                </SidebarMenuSubItem>
                <SidebarMenuSubItem>
                  <SidebarMenuSubButton asChild>
                    <Link href="/marketplace">Marketplace</Link>
                  </SidebarMenuSubButton>
                </SidebarMenuSubItem>
                 <SidebarMenuSubItem>
                  <SidebarMenuSubButton asChild>
                    <Link href="/services">Services</Link>
                  </SidebarMenuSubButton>
                </SidebarMenuSubItem>
              </SidebarMenuSub>
            </SidebarMenuItem>

            {/* Pro Tools */}
            <SidebarMenuItem>
              <SidebarMenuButton tooltip="Pro Tools">
                <Wrench />
                <span>Pro Tools</span>
              </SidebarMenuButton>
              <SidebarMenuSub>
                <SidebarMenuSubItem>
                  <SidebarMenuSubButton asChild>
                    <Link href="/verify">SmartScan Pro</Link>
                  </SidebarMenuSubButton>
                </SidebarMenuSubItem>
                <SidebarMenuSubItem>
                  <SidebarMenuSubButton asChild>
                    <Link href="/upc-checker">UPC Checker</Link>
                  </SidebarMenuSubButton>
                </SidebarMenuSubItem>
                 <SidebarMenuSubItem>
                  <SidebarMenuSubButton asChild>
                    <Link href="/appraise-lot">Bidding Tool</Link>
                  </SidebarMenuSubButton>
                </SidebarMenuSubItem>
              </SidebarMenuSub>
            </SidebarMenuItem>

             {/* Service Hub */}
            <SidebarMenuItem>
              <SidebarMenuButton tooltip="Service Hub">
                <GitFork />
                <span>Service Hub</span>
              </SidebarMenuButton>
              <SidebarMenuSub>
                 <SidebarMenuSubItem>
                  <SidebarMenuSubButton asChild>
                    <Link href="/ambassadors/how-it-works">Ambassador</Link>
                  </SidebarMenuSubButton>
                </SidebarMenuSubItem>
                <SidebarMenuSubItem>
                  <SidebarMenuSubButton asChild>
                    <Link href="/facilities">Facilities</Link>
                  </SidebarMenuSubButton>
                </SidebarMenuSubItem>
                 <SidebarMenuSubItem>
                  <SidebarMenuSubButton asChild>
                    <Link href="/mission">Our Mission</Link>
                  </SidebarMenuSubButton>
                </SidebarMenuSubItem>
              </SidebarMenuSub>
            </SidebarMenuItem>

            {/* Support & Mission */}
            <SidebarMenuItem>
              <SidebarMenuButton tooltip="Support">
                <LifeBuoy />
                <span>Support & Mission</span>
              </SidebarMenuButton>
              <SidebarMenuSub>
                <SidebarMenuSubItem>
                  <SidebarMenuSubButton asChild>
                    <Link href="/donate/faq">L.E.A.N. FAQs</Link>
                  </SidebarMenuSubButton>
                </SidebarMenuSubItem>
                 <SidebarMenuSubItem>
                  <SidebarMenuSubButton asChild>
                    <Link href="/faq">General FAQs</Link>
                  </SidebarMenuSubButton>
                </SidebarMenuSubItem>
                <SidebarMenuSubItem>
                  <SidebarMenuSubButton asChild>
                    <Link href="/donate/faq">Donation FAQ</Link>
                  </SidebarMenuSubButton>
                </SidebarMenuSubItem>
                <SidebarMenuSubItem>
                  <SidebarMenuSubButton asChild>
                    <Link href="/help">Help</Link>
                  </SidebarMenuSubButton>
                </SidebarMenuSubItem>
              </SidebarMenuSub>
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
