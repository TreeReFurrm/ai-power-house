
'use client';

import { CheckCircle, Home, Truck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useRouter } from 'next/navigation';

export default function ConfirmationPage() {
  const router = useRouter();

  // In a real application, you would use searchParams.get('listingId')
  // to fetch the listing details and the selected ambassador name here.
  const ambassadorName = 'Maria Rodriguez'; 
  const listingTitle = 'Mid-Century Modern Desk';

  return (
    <div className="max-w-2xl mx-auto p-4 space-y-6 text-center">
      <Card className="shadow-2xl border-green-500/50">
        <CardHeader>
          <div className="flex justify-center mb-4">
            <CheckCircle className="w-16 h-16 text-green-500" />
          </div>
          <CardTitle className="text-3xl">Fulfillment Initiated!</CardTitle>
          <CardDescription className="text-lg">
            Your request for <strong>"{listingTitle}"</strong> has been sent.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="font-semibold flex items-center justify-center text-primary">
            <Truck className="w-5 h-5 mr-2" />
            Your local Ambassador, <strong>{ambassadorName}</strong>, has been notified.
          </p>
          <p className="text-muted-foreground">
            They will reach out to you within <strong>24 hours</strong> to schedule the final pickup time. Check your email for a confirmation and tracking link.
          </p>
        </CardContent>
      </Card>

      <div className="flex justify-center gap-4 pt-4">
        <Button onClick={() => router.push('/')} className="flex items-center">
          <Home className="w-4 h-4 mr-2" />
          Go to Dashboard
        </Button>
        <Button variant="outline">
          View Tracking Link
        </Button>
      </div>
    </div>
  );
}
