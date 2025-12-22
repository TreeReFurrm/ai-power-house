
'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { HandHeart, Loader2 } from 'lucide-react';
import { useUser } from '@/firebase';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import { Input } from '../ui/input';
import { cn } from '@/lib/utils';

const tiers = [
    { amount: 25, priceId: process.env.NEXT_PUBLIC_STRIPE_ETHICAL_REVIEW_PRICE_ID },
    { amount: 50, priceId: process.env.NEXT_PUBLIC_STRIPE_LEGACY_OUTREACH_PRICE_ID },
];

export function DirectDonationForm() {
    const { user } = useUser();
    const { toast } = useToast();
    const router = useRouter();
    const [isProcessing, setIsProcessing] = useState<number | 'other' | null>(null);
    const [customAmount, setCustomAmount] = useState('');

    const handleDonate = async (amount: number, priceId: string | undefined, isCustom = false) => {
        if (!user) {
            toast({
                title: 'Please log in',
                description: 'You need to be logged in to make a donation.',
                variant: 'destructive',
            });
            router.push('/login');
            return;
        }

        if (!isCustom && !priceId) {
            toast({
                title: 'Configuration Error',
                description: 'This donation tier is not configured correctly.',
                variant: 'destructive',
            });
            return;
        }

        setIsProcessing(isCustom ? 'other' : amount);
        toast({
            title: 'Redirecting to checkout...',
            description: 'You will be securely redirected to Stripe to complete your donation.',
        });
        
        try {
            const response = await fetch('/api/stripe/create-donation', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    priceId,
                    userEmail: user.email,
                    amount: isCustom ? parseFloat(customAmount) : amount,
                    isCustom,
                }),
            });

            const { url, error } = await response.json();

            if (error) throw new Error(error);
            if (url) window.location.href = url;
            else throw new Error('Could not initiate donation. Please try again.');

        } catch (err: any) {
            console.error(err);
            toast({
                variant: 'destructive',
                title: 'Donation Failed',
                description: err.message || 'An unexpected error occurred.',
            });
            setIsProcessing(null);
        }
    };
    
    return (
         <Card className="flex flex-col rounded-lg shadow-sm hover:shadow-lg transition-shadow lg:col-span-2">
            <CardHeader>
              <div className="flex items-start gap-4">
                <div className="bg-primary/10 p-3 rounded-full border border-primary/20">
                  <HandHeart className="size-6 text-primary" />
                </div>
                <CardTitle className="text-2xl font-bold tracking-tight">Donate to LEAN</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="flex-grow">
              <CardDescription>Your contribution directly funds auction prevention and the return of sentimental items to families.</CardDescription>
              <div className="mt-4 flex flex-col sm:flex-row gap-4">
                  {tiers.map(tier => (
                     <Button 
                        key={tier.amount}
                        onClick={() => handleDonate(tier.amount, tier.priceId)}
                        disabled={!!isProcessing}
                        className={cn("w-full", isProcessing === tier.amount && "bg-primary/80")}
                     >
                         {isProcessing === tier.amount ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                         Donate ${tier.amount}
                     </Button>
                  ))}
                  <div className="flex gap-2">
                     <Input 
                        type="number" 
                        placeholder="Other" 
                        value={customAmount}
                        onChange={(e) => setCustomAmount(e.target.value)}
                        disabled={!!isProcessing}
                     />
                      <Button 
                        onClick={() => handleDonate(parseFloat(customAmount), undefined, true)}
                        disabled={!!isProcessing || !customAmount || parseFloat(customAmount) <= 0}
                        className={cn(isProcessing === 'other' && "bg-primary/80")}
                     >
                         {isProcessing === 'other' ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Go"}
                     </Button>
                  </div>
              </div>
            </CardContent>
          </Card>
    )
}
