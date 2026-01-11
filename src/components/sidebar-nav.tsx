
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
  SidebarFooter,
  SidebarSeparator,
} from '@/components/ui/sidebar';
import { AppLogo } from '@/components/app-logo';
import { Briefcase, FileText, GraduationCap, Languages, LayoutDashboard, Lightbulb, LogIn, LogOut, Mail, MessageSquare, Palette, PenSquare, Star, SwatchBook, UserPlus, Wand2 } from 'lucide-react';
import { useAuth, useUser } from '@/firebase';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from './ui/button';

export function SidebarNav() {
  const pathname = usePathname();
  const { user, isUserLoading } = useUser();
  const auth = useAuth();


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
        { href: '/tools/business-idea-generator', label: 'Idea Generator', icon: Lightbulb },
        { href: '/tools/prompt-enhancer', label: 'Prompt Enhancer', icon: Wand2 },
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

  const getInitials = (name?: string | null) => {
    if (!name) return 'U';
    const parts = name.split(' ');
    if (parts.length > 1) {
      return parts[0][0] + parts[parts.length - 1][0];
    }
    return name.substring(0, 2);
  }

  return (
    <>
      <SidebarHeader className="bg-sidebar-primary p-4 group-data-[state=expanded]:h-auto">
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
       <SidebarFooter>
        <SidebarSeparator />
        {isUserLoading ? (
            <div className="flex items-center gap-2 p-2">
                <Avatar className="h-8 w-8"><AvatarFallback>?</AvatarFallback></Avatar>
                <span className="text-sm font-medium">Loading...</span>
            </div>
        ) : user ? (
            <div className="flex flex-col gap-2 p-2">
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton asChild tooltip={{children: 'Upgrade to Pro', side: 'right'}}>
                            <Link href="/pro">
                                <Star />
                                <span>Go Pro</span>
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
                <div className="flex items-center justify-between p-2 group-data-[state=expanded]:flex-row flex-col-reverse gap-2">
                     <div className="flex items-center gap-2">
                        <Avatar className="h-8 w-8">
                            {user.photoURL && <AvatarImage src={user.photoURL} alt={user.displayName || 'User'} />}
                            <AvatarFallback>{getInitials(user.displayName || user.email)}</AvatarFallback>
                        </Avatar>
                        <div className="group-data-[state=expanded]:block hidden">
                            <p className="text-sm font-semibold truncate">{user.displayName || 'Anonymous'}</p>
                            <p className="text-xs text-muted-foreground truncate">{user.email || 'No email'}</p>
                        </div>
                     </div>
                    <SidebarMenuButton tooltip={{ children: 'Logout', side: 'right' }} onClick={() => auth.signOut()} className="h-8 w-8 shrink-0">
                        <LogOut />
                    </SidebarMenuButton>
                </div>
            </div>
        ) : (
             <SidebarMenu className="p-2">
                <SidebarMenuItem>
                  <SidebarMenuButton asChild tooltip={{ children: 'Sign In', side: 'right' }}>
                    <Link href="/login">
                      <LogIn />
                      <span>Sign In</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild tooltip={{ children: 'Sign Up', side: 'right' }}>
                    <Link href="/signup">
                      <UserPlus />
                      <span>Sign Up</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
             </SidebarMenu>
        )}
      </SidebarFooter>
    </>
  );
}
