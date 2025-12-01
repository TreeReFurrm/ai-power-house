
'use client';

import { useUser, useDoc, useFirestore, useMemoFirebase } from '@/firebase';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { doc } from 'firebase/firestore';
import { Skeleton } from '@/components/ui/skeleton';

export default function AccountPage() {
  const { user, isUserLoading, userError } = useUser();
  const router = useRouter();
  const firestore = useFirestore();

  const userProfileRef = useMemoFirebase(() => {
    if (!firestore || !user) return null;
    return doc(firestore, 'users', user.uid);
  }, [firestore, user]);

  const { data: userProfile, isLoading: isProfileLoading } = useDoc(userProfileRef);

  useEffect(() => {
    if (!isUserLoading && !user) {
      router.push('/login');
    }
  }, [user, isUserLoading, router]);

  if (isUserLoading || !user) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-4 text-muted-foreground">Loading account...</span>
      </div>
    );
  }

  if (userError) {
    return (
      <div className="text-center text-destructive">
        <p>Error loading user: {userError.message}</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-2xl py-8">
      <Card>
        <CardHeader>
          <CardTitle>My Account</CardTitle>
          <CardDescription>View your account details and membership tier.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-muted-foreground">Email</span>
            <span className="font-medium">{user.email}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-muted-foreground">Membership Tier</span>
            {isProfileLoading ? (
              <Skeleton className="h-6 w-24" />
            ) : (
              <Badge variant={userProfile?.tier === 'Pro' ? 'default' : 'secondary'}>
                {userProfile?.tier || 'Loading...'}
              </Badge>
            )}
          </div>
          <div className="flex justify-between items-center">
            <span className="text-muted-foreground">User ID</span>
            <span className="font-mono text-xs text-muted-foreground">{user.uid}</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
