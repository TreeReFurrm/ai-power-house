
'use client';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import { User, Bell, LogOut, LogIn, UserPlus, LifeBuoy } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { useFirebase } from '@/firebase';
import { getAuth, signOut } from 'firebase/auth';
import Link from 'next/link';
import { Skeleton } from '../ui/skeleton';

export function Header() {
  const { user, isUserLoading } = useFirebase();
  const auth = getAuth();

  const handleLogout = async () => {
    await signOut(auth);
  };

  return (
    <header className="flex h-14 items-center gap-4 border-b bg-background px-4 lg:px-6 sticky top-0 z-30">
      <SidebarTrigger className="md:hidden" />
      <div className="w-full flex-1">
        {/* Can add breadcrumbs or page title here later */}
      </div>
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" className="rounded-full">
          <Bell className="h-5 w-5" />
          <span className="sr-only">Toggle notifications</span>
        </Button>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="rounded-full">
              {isUserLoading ? (
                <Skeleton className="h-6 w-6 rounded-full" />
              ) : (
                <User className="h-5 w-5" />
              )}
              <span className="sr-only">Toggle user menu</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {isUserLoading ? (
               <DropdownMenuItem disabled>Loading...</DropdownMenuItem>
            ) : user ? (
              <>
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/account">
                    <User className="mr-2" /> Profile
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <LifeBuoy className="mr-2" /> Settings
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout}>
                  <LogOut className="mr-2" />
                  Logout
                </DropdownMenuItem>
              </>
            ) : (
              <>
                <DropdownMenuItem asChild>
                  <Link href="/login">
                    <LogIn className="mr-2" />
                    Login
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/signup">
                    <UserPlus className="mr-2" />
                    Sign Up
                  </Link>
                </DropdownMenuItem>
              </>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
