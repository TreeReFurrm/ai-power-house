'use client';

import type { ReactNode } from 'react';
import { SidebarProvider, Sidebar, SidebarInset, SidebarHeader, SidebarContent, SidebarMenu, SidebarMenuItem, SidebarMenuButton, SidebarFooter, SidebarMenuSub, SidebarMenuSubItem, SidebarMenuSubButton } from '@/components/ui/sidebar';
import { User } from 'lucide-react';
import { Wrench } from 'lucide-react';
import { Barcode } from 'lucide-react';
import { Gavel } from 'lucide-react';
import { HelpCircle } from 'lucide-react';
import { LayoutDashboard } from 'lucide-react';
import { ShoppingBag } from 'lucide-react';
import { Briefcase } from 'lucide-react';
import { LifeBuoy } from 'lucide-react';
import { Star } from 'lucide-react';
import { Scan } from 'lucide-react';
import { ShieldHeart } from 'lucide-react';
import { GitFork } from 'lucide-react';
import { HeartHandshake } from 'lucide-react';
import { FileQuestion } from 'lucide-react';
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
            <Scan className="sidebar-icon" />
            <h1 className="text-xl font-semibold">SmartScan</h1>
          </div>
        </SidebarHeader>
        <SidebarContent>
          <SidebarMenu>
            {/* Main Hub */}
             <SidebarMenuItem>
              <SidebarMenuButton tooltip="Main Hub" className="sidebar-section-title">
                <span>Main Hub</span>
              </SidebarMenuButton>
              <SidebarMenuSub>
                 <SidebarMenuSubItem>
                  <SidebarMenuSubButton asChild className={cn('sidebar-link', pathname === '/' && 'sidebar-link-active')}>
                    <Link href="/"><LayoutDashboard className="sidebar-icon" />Dashboard</Link>
                  </SidebarMenuSubButton>
                </SidebarMenuSubItem>
                <SidebarMenuSubItem>
                  <SidebarMenuSubButton asChild className={cn('sidebar-link', pathname === '/marketplace' && 'sidebar-link-active')}>
                    <Link href="/marketplace"><ShoppingBag className="sidebar-icon" />Marketplace</Link>
                  </SidebarMenuSubButton>
                </SidebarMenuSubItem>
                 <SidebarMenuSubItem>
                  <SidebarMenuSubButton asChild className={cn('sidebar-link', pathname === '/services' && 'sidebar-link-active')}>
                    <Link href="/services"><Briefcase className="sidebar-icon" />Services</Link>
                  </SidebarMenuSubButton>
                </SidebarMenuSubItem>
              </SidebarMenuSub>
            </SidebarMenuItem>

            {/* Pro Tools */}
            <SidebarMenuItem>
              <SidebarMenuButton tooltip="Pro Tools" className="sidebar-section-title">
                <span>Pro Tools</span>
              </SidebarMenuButton>
              <SidebarMenuSub>
                <SidebarMenuSubItem>
                  <SidebarMenuSubButton asChild className={cn('sidebar-link', pathname === '/verify' && 'sidebar-link-active')}>
                    <Link href="/verify"><Wrench className="sidebar-icon" />Pricing Tool</Link>
                  </SidebarMenuSubButton>
                </SidebarMenuSubItem>
                <SidebarMenuSubItem>
                  <SidebarMenuSubButton asChild className={cn('sidebar-link', pathname === '/upc-checker' && 'sidebar-link-active')}>
                    <Link href="/upc-checker"><Barcode className="sidebar-icon" />Barcode Scanner</Link>
                  </SidebarMenuSubButton>
                </SidebarMenuSubItem>
                 <SidebarMenuSubItem>
                  <SidebarMenuSubButton asChild className={cn('sidebar-link', pathname === '/appraise-lot' && 'sidebar-link-active')}>
                    <Link href="/appraise-lot"><Gavel className="sidebar-icon" />Bidding Tool</Link>
                  </SidebarMenuSubButton>
                </SidebarMenuSubItem>
              </SidebarMenuSub>
            </SidebarMenuItem>

             {/* Service Hub */}
            <SidebarMenuItem>
              <SidebarMenuButton tooltip="Service Hub" className="sidebar-section-title">
                <span>Service Hub</span>
              </SidebarMenuButton>
              <SidebarMenuSub>
                 <SidebarMenuSubItem>
                  <SidebarMenuSubButton asChild className={cn('sidebar-link', pathname.startsWith('/ambassadors') && 'sidebar-link-active')}>
                    <Link href="/ambassadors/how-it-works"><GitFork className="sidebar-icon" />Ambassadors</Link>
                  </SidebarMenuSubButton>
                </SidebarMenuSubItem>
                <SidebarMenuSubItem>
                  <SidebarMenuSubButton asChild className={cn('sidebar-link', pathname === '/facilities' && 'sidebar-link-active')}>
                    <Link href="/facilities"><ShieldHeart className="sidebar-icon" />Facilities</Link>
                  </SidebarMenuSubButton>
                </SidebarMenuSubItem>
              </SidebarMenuSub>
            </SidebarMenuItem>

            {/* Support & Mission */}
            <SidebarMenuItem>
              <SidebarMenuButton tooltip="Support" className="sidebar-section-title">
                <span>Support & Mission</span>
              </SidebarMenuButton>
              <SidebarMenuSub>
                 <SidebarMenuSubItem>
                    <SidebarMenuSubButton asChild className={cn('sidebar-link', pathname.startsWith('/donate') && 'sidebar-link-active')}>
                        <Link href="/donate"><HeartHandshake className="sidebar-icon" />Donate</Link>
                    </SidebarMenuSubButton>
                 </SidebarMenuSubItem>
                 <SidebarMenuSubItem>
                    <SidebarMenuSubButton asChild className={cn('sidebar-link', pathname === '/mission' && 'sidebar-link-active')}>
                        <Link href="/mission"><LifeBuoy className="sidebar-icon" />Our Mission</Link>
                    </SidebarMenuSubButton>
                 </SidebarMenuSubItem>
                 <SidebarMenuSubItem>
                  <SidebarMenuSubButton asChild className={cn('sidebar-link', pathname === '/faq' && 'sidebar-link-active')}>
                    <Link href="/faq"><FileQuestion className="sidebar-icon" />General FAQs</Link>
                  </SidebarMenuSubButton>
                </SidebarMenuSubItem>
                <SidebarMenuSubItem>
                  <SidebarMenuSubButton asChild className={cn('sidebar-link', pathname === '/help' && 'sidebar-link-active')}>
                    <Link href="/help"><HelpCircle className="sidebar-icon" />Help</Link>
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
                  <Star className="sidebar-icon" />
                  <span>Upgrade</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton asChild tooltip="Account" className={cn('sidebar-link', pathname === '/account' && 'sidebar-link-active')}>
                <Link href="/account">
                  <User className="sidebar-icon" />
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
