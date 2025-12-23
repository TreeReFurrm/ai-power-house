
'use client';

import type { ReactNode } from 'react';
import { SidebarProvider, Sidebar, SidebarInset, SidebarHeader, SidebarContent, SidebarMenu, SidebarMenuItem, SidebarMenuButton, SidebarFooter, SidebarMenuSub, SidebarMenuSubItem, SidebarMenuSubButton, SidebarGroupLabel } from '@/components/ui/sidebar';
import Link from 'next/link';
import { Header } from './header';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { 
    LayoutDashboard, 
    ShoppingCart, 
    Handshake, 
    ScanLine, 
    Barcode, 
    HardHat, 
    Building, 
    HandHeart, 
    CircleHelp, 
    BookUser, 
    LifeBuoy, 
    Star, 
    User,
    UsersIcon
} from '@/components/valuscan/icons';


export function MainLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  
  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarHeader>
          <div className="flex items-center gap-2 p-2">
            <h1 className="text-xl font-semibold">SmartScan</h1>
          </div>
        </SidebarHeader>
        <SidebarContent>
          <SidebarMenu>
            {/* Main Hub */}
             <SidebarMenuItem>
              <SidebarGroupLabel className="sidebar-section-title">
                Main Hub
              </SidebarGroupLabel>
              <SidebarMenuSub>
                 <SidebarMenuSubItem>
                  <SidebarMenuSubButton asChild className={cn('sidebar-link', pathname === '/' && 'sidebar-link-active')}>
                    <Link href="/"><LayoutDashboard className="sidebar-icon" />Dashboard</Link>
                  </SidebarMenuSubButton>
                </SidebarMenuSubItem>
                <SidebarMenuSubItem>
                  <SidebarMenuSubButton asChild className={cn('sidebar-link', pathname === '/marketplace' && 'sidebar-link-active')}>
                    <Link href="/marketplace"><ShoppingCart className="sidebar-icon" />Marketplace</Link>
                  </SidebarMenuSubButton>
                </SidebarMenuSubItem>
                 <SidebarMenuSubItem>
                  <SidebarMenuSubButton asChild className={cn('sidebar-link', pathname === '/services' && 'sidebar-link-active')}>
                    <Link href="/services"><Handshake className="sidebar-icon" />Services</Link>
                  </SidebarMenuSubButton>
                </SidebarMenuSubItem>
              </SidebarMenuSub>
            </SidebarMenuItem>

            {/* Pro Tools */}
            <SidebarMenuItem>
              <SidebarGroupLabel className="sidebar-section-title">
                Pro Tools
              </SidebarGroupLabel>
              <SidebarMenuSub>
                <SidebarMenuSubItem>
                  <SidebarMenuSubButton asChild className={cn('sidebar-link', pathname === '/verify' && 'sidebar-link-active')}>
                    <Link href="/verify"><ScanLine className="sidebar-icon" />Pricing Tool</Link>
                  </SidebarMenuSubButton>
                </SidebarMenuSubItem>
                <SidebarMenuSubItem>
                  <SidebarMenuSubButton asChild className={cn('sidebar-link', pathname === '/upc-checker' && 'sidebar-link-active')}>
                    <Link href="/upc-checker"><Barcode className="sidebar-icon" />Barcode Scanner</Link>
                  </SidebarMenuSubButton>
                </SidebarMenuSubItem>
                 <SidebarMenuSubItem>
                  <SidebarMenuSubButton asChild className={cn('sidebar-link', pathname === '/appraise-lot' && 'sidebar-link-active')}>
                    <Link href="/appraise-lot"><HardHat className="sidebar-icon" />Bidding Tool</Link>
                  </SidebarMenuSubButton>
                </SidebarMenuSubItem>
              </SidebarMenuSub>
            </SidebarMenuItem>

             {/* Service Hub */}
            <SidebarMenuItem>
              <SidebarGroupLabel className="sidebar-section-title">
                Service Hub
              </SidebarGroupLabel>
              <SidebarMenuSub>
                 <SidebarMenuSubItem>
                  <SidebarMenuSubButton asChild className={cn('sidebar-link', pathname.startsWith('/ambassadors') && 'sidebar-link-active')}>
                    <Link href="/ambassadors/how-it-works"><UsersIcon className="sidebar-icon" />Ambassadors</Link>
                  </SidebarMenuSubButton>
                </SidebarMenuSubItem>
                <SidebarMenuSubItem>
                  <SidebarMenuSubButton asChild className={cn('sidebar-link', pathname === '/facilities' && 'sidebar-link-active')}>
                    <Link href="/facilities"><Building className="sidebar-icon" />Facilities</Link>
                  </SidebarMenuSubButton>
                </SidebarMenuSubItem>
              </SidebarMenuSub>
            </SidebarMenuItem>

            {/* Support & Mission */}
            <SidebarMenuItem>
              <SidebarGroupLabel className="sidebar-section-title">
                Support & Mission
              </SidebarGroupLabel>
              <SidebarMenuSub>
                 <SidebarMenuSubItem>
                    <SidebarMenuSubButton asChild className={cn('sidebar-link', pathname.startsWith('/donate') && 'sidebar-link-active')}>
                        <Link href="/donate"><HandHeart className="sidebar-icon" />Donate</Link>
                    </SidebarMenuSubButton>
                 </SidebarMenuSubItem>
                 <SidebarMenuSubItem>
                    <SidebarMenuSubButton asChild className={cn('sidebar-link', pathname === '/mission' && 'sidebar-link-active')}>
                        <Link href="/mission"><CircleHelp className="sidebar-icon" />Our Mission</Link>
                    </SidebarMenuSubButton>
                 </SidebarMenuSubItem>
                 <SidebarMenuSubItem>
                  <SidebarMenuSubButton asChild className={cn('sidebar-link', pathname === '/faq' && 'sidebar-link-active')}>
                    <Link href="/faq"><BookUser className="sidebar-icon" />General FAQs</Link>
                  </SidebarMenuSubButton>
                </SidebarMenuSubItem>
                <SidebarMenuSubItem>
                  <SidebarMenuSubButton asChild className={cn('sidebar-link', pathname === '/help' && 'sidebar-link-active')}>
                    <Link href="/help"><LifeBuoy className="sidebar-icon" />Help</Link>
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
                  <Star className="sidebar-icon" /><span>Upgrade</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton asChild tooltip="Account" className={cn('sidebar-link', pathname === '/account' && 'sidebar-link-active')}>
                <Link href="/account">
                  <User className="sidebar-icon" /><span>Account</span>
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
