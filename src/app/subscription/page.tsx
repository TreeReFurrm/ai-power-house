
'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useUser } from '@/firebase';
import { useToast } from '@/hooks/use-toast';
import { Check, Loader2, Star } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

const proFeatures = [
    'Unlimited AI-powered item scans',
    'Full cloud inventory sync',
    'Advanced listing generation',
    'Access to Tier 1 & 2 Ambassador services',
    'Profitability and sales analytics'
];

export default function SubscriptionPage() {
    const { user } = useUser();
    const { toast } = useToast();
    const router = useRouter();
    const [isProcessing, setIsProcessing] = useState(false);

    const handleUpgrade = async () => {
        setIsProcessing(true);
        toast({
            title: 'Redirecting to checkout...',
            description: 'You will be securely redirected to Stripe to complete your subscription.',
        });

        try {
            const response = await fetch('/api/stripe/create-checkout', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    // In a real app, this would be a specific price ID for the Pro Tier subscription
                    amount: 29, 
                    donorEmail: user?.email,
                    donorName: user?.displayName || 'Pro User',
                }),
            });

            const { url, error } = await response.json();

            if (error) {
                throw new Error(error);
            }

            if (url) {
                router.push(url);
            } else {
                throw new Error('Could not initiate subscription. Please try again.');
            }
        } catch (err: any) {
            console.error(err);
            toast({
                variant: 'destructive',
                title: 'Subscription Failed',
                description: err.message || 'An unexpected error occurred. Please contact support.',
            });
            setIsProcessing(false);
        }
    };

    return (
        <div className="container mx-auto max-w-2xl py-8">
            <Card className="shadow-lg">
                <CardHeader className="text-center">
                    <div className="mx-auto w-fit rounded-full bg-primary/10 p-3 mb-4">
                        <Star className="size-8 text-primary" />
                    </div>
                    <CardTitle className="text-3xl font-bold tracking-tight">Pro Tier</CardTitle>
                    <CardDescription className="text-lg text-muted-foreground">
                        Unlock the full power of ReFurrm SmartScan.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="text-center">
                        <p className="text-4xl font-bold">$29<span className="text-lg font-normal text-muted-foreground">/month</span></p>
                    </div>
                    <ul className="space-y-3 text-sm">
                        {proFeatures.map((feature, index) => (
                            <li key={index} className="flex items-center">
                                <Check className="mr-2 h-4 w-4 text-green-500" />
                                <span className="text-muted-foreground">{feature}</span>
                            </li>
                        ))}
                    </ul>
                </CardContent>
                <CardFooter>
                    <Button onClick={handleUpgrade} disabled={isProcessing} className="w-full" size="lg">
                        {isProcessing && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Upgrade to Pro
                    </Button>
                </CardFooter>
            </Card>
        </div>
    );
}
