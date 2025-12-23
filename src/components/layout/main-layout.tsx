
'use client';

import type { ReactNode } from 'react';
import { SidebarProvider, Sidebar, SidebarInset, SidebarHeader, SidebarContent, SidebarMenu, SidebarMenuItem, SidebarMenuButton, SidebarFooter, SidebarMenuSub, SidebarMenuSubItem, SidebarMenuSubButton } from '@/components/ui/sidebar';
import { User, Wrench, Barcode, Gavel, HelpCircle, LayoutDashboard, ShoppingBag, Briefcase, LifeBuoy, Star, Scan, ShieldHeart, GitFork, HeartHandshake, FileQuestion } from 'lucide-react';
import Link from 'next/link';
import { Header } from './header';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

export function MainLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  
  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarHeader>
          <div className="flex items-center gap-2 p-2">
            <Scan className="size-8 text-primary" />
            <h1 className="text-xl font-semibold">SmartScan</h1>
          </div>
        </SidebarHeader>
        <SidebarContent>
          <SidebarMenu>
            {/* Main Hub */}
             <SidebarMenuItem>
              <SidebarMenuButton tooltip="Main Hub" className="sidebar-section-title">
                <LayoutDashboard />
                <span>Main Hub</span>
              </SidebarMenuButton>
              <SidebarMenuSub>
                 <SidebarMenuSubItem>
                  <SidebarMenuSubButton asChild className={cn('sidebar-link', pathname === '/' && 'sidebar-link-active')}>
                    <Link href="/">Dashboard</Link>
                  </SidebarMenuSubButton>
                </SidebarMenuSubItem>
                <SidebarMenuSubItem>
                  <SidebarMenuSubButton asChild className={cn('sidebar-link', pathname === '/marketplace' && 'sidebar-link-active')}>
                    <Link href="/marketplace">Marketplace</Link>
                  </SidebarMenuSubButton>
                </SidebarMenuSubItem>
                 <SidebarMenuSubItem>
                  <SidebarMenuSubButton asChild className={cn('sidebar-link', pathname === '/services' && 'sidebar-link-active')}>
                    <Link href="/services">Services</Link>
                  </SidebarMenuSubButton>
                </SidebarMenuSubItem>
              </SidebarMenuSub>
            </SidebarMenuItem>

            {/* Pro Tools */}
            <SidebarMenuItem>
              <SidebarMenuButton tooltip="Pro Tools" className="sidebar-section-title">
                <Wrench />
                <span>Pro Tools</span>
              </SidebarMenuButton>
              <SidebarMenuSub>
                <SidebarMenuSubItem>
                  <SidebarMenuSubButton asChild className={cn('sidebar-link', pathname === '/verify' && 'sidebar-link-active')}>
                    <Link href="/verify">Pricing Tool</Link>
                  </SidebarMenuSubButton>
                </SidebarMenuSubItem>
                <SidebarMenuSubItem>
                  <SidebarMenuSubButton asChild className={cn('sidebar-link', pathname === '/upc-checker' && 'sidebar-link-active')}>
                    <Link href="/upc-checker">Barcode Scanner</Link>
                  </SidebarMenuSubButton>
                </SidebarMenuSubItem>
                 <SidebarMenuSubItem>
                  <SidebarMenuSubButton asChild className={cn('sidebar-link', pathname === '/appraise-lot' && 'sidebar-link-active')}>
                    <Link href="/appraise-lot">Bidding Tool</Link>
                  </SidebarMenuSubButton>
                </SidebarMenuSubItem>
              </SidebarMenuSub>
            </SidebarMenuItem>

             {/* Service Hub */}
            <SidebarMenuItem>
              <SidebarMenuButton tooltip="Service Hub" className="sidebar-section-title">
                <GitFork />
                <span>Service Hub</span>
              </SidebarMenuButton>
              <SidebarMenuSub>
                 <SidebarMenuSubItem>
                  <SidebarMenuSubButton asChild className={cn('sidebar-link', pathname.startsWith('/ambassadors') && 'sidebar-link-active')}>
                    <Link href="/ambassadors/how-it-works">Ambassadors</Link>
                  </SidebarMenuSubButton>
                </SidebarMenuSubItem>
                <SidebarMenuSubItem>
                  <SidebarMenuSubButton asChild className={cn('sidebar-link', pathname === '/facilities' && 'sidebar-link-active')}>
                    <Link href="/facilities">Facilities</Link>
                  </SidebarMenuSubButton>
                </SidebarMenuSubItem>
              </SidebarMenuSub>
            </SidebarMenuItem>

            {/* Support & Mission */}
            <SidebarMenuItem>
              <SidebarMenuButton tooltip="Support" className="sidebar-section-title">
                <LifeBuoy />
                <span>Support & Mission</span>
              </SidebarMenuButton>
              <SidebarMenuSub>
                 <SidebarMenuSubItem>
                    <SidebarMenuSubButton asChild className={cn('sidebar-link', pathname.startsWith('/donate') && 'sidebar-link-active')}>
                        <Link href="/donate">Donate</Link>
                    </SidebarMenuSubButton>
                 </SidebarMenuSubItem>
                 <SidebarMenuSubItem>
                    <SidebarMenuSubButton asChild className={cn('sidebar-link', pathname === '/mission' && 'sidebar-link-active')}>
                        <Link href="/mission">Our Mission</Link>
                    </SidebarMenuSubButton>
                 </SidebarMenuSubItem>
                 <SidebarMenuSubItem>
                  <SidebarMenuSubButton asChild className={cn('sidebar-link', pathname === '/faq' && 'sidebar-link-active')}>
                    <Link href="/faq">General FAQs</Link>
                  </SidebarMenuSubButton>
                </SidebarMenuSubItem>
                <SidebarMenuSubItem>
                  <SidebarMenuSubButton asChild className={cn('sidebar-link', pathname === '/help' && 'sidebar-link-active')}>
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
              <SidebarMenuButton asChild tooltip="Upgrade" className={cn('sidebar-link', pathname === '/subscription' && 'sidebar-link-active')}>
                <Link href="/subscription">
                  <Star />
                  <span>Upgrade</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton asChild tooltip="Account" className={cn('sidebar-link', pathname === '/account' && 'sidebar-link-active')}>
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
