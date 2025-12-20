'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  SidebarHeader,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarGroup,
  SidebarGroupLabel,
} from '@/components/ui/sidebar';
import { AppLogo } from '@/components/app-logo';
import { BookText, Briefcase, FileText, GraduationCap, LayoutDashboard, Mail, SwatchBook, Languages, MessageSquare, Palette, PenSquare } from 'lucide-react';

export function SidebarNav() {
  const pathname = usePathname();

  const menuItems = [
    {
      group: 'General',
      items: [
        { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
      ],
    },
    {
      group: 'Writer',
      items: [
        { href: '/writer/letter', label: 'Letter Writer', icon: Mail },
        { href: '/writer/novel', label: 'Novel Co-writer', icon: PenSquare },
      ],
    },
    {
      group: 'Tools',
      items: [
        { href: '/tools/summarizer', label: 'Summarizer', icon: FileText },
        { href: '/tools/forms', label: 'Form Creator', icon: Briefcase },
        { href: '/tools/pdf', label: 'PDF & Image Tools', icon: SwatchBook },
        { href: '/tools/translator', label: 'Translator', icon: Languages },
        { href: '/tools/chat-pdf', label: 'Chat with PDF', icon: MessageSquare },
        { href: '/tools/image-generator', label: 'Image Generator', icon: Palette },
      ],
    },
    {
        group: 'Education',
        items: [
            { href: '/courses/designer', label: 'Course Designer', icon: GraduationCap },
        ]
    }
  ];

  return (
    <>
      <SidebarHeader className="bg-sidebar-primary p-4 group-data-[state=expanded]:h-[73px]">
        <Link href="/dashboard">
          <AppLogo />
        </Link>
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu>
          {menuItems.map((group) => (
            <SidebarGroup key={group.group}>
              <SidebarGroupLabel>{group.group}</SidebarGroupLabel>
              {group.items.map((item) => (
                <SidebarMenuItem key={item.href}>
                  <SidebarMenuButton
                    asChild
                    isActive={pathname.startsWith(item.href)}
                    tooltip={{ children: item.label, side: 'right' }}
                  >
                    <Link href={item.href}>
                      <item.icon />
                      <span>{item.label}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarGroup>
          ))}
        </SidebarMenu>
      </SidebarContent>
    </>
  );
}
