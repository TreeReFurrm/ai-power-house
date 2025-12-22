
'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useUser } from '@/firebase';
import { useToast } from '@/hooks/use-toast';
import { Check, Loader2, Star, X } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { cn } from '@/lib/utils';

const features = [
    { name: 'AI-Powered Item Scans', community: '5/month', scanner: '50/month', pro: '500/month' },
    { name: 'Cloud Inventory Sync', community: false, scanner: true, pro: true },
    { name: 'Advanced Listing Generation', community: false, scanner: false, pro: true },
    { name: 'Profitability & Sales Analytics', community: false, scanner: false, pro: true },
    { name: 'Tier 1 Ambassador Services', community: true, scanner: true, pro: true },
    { name: 'Tier 2 Ambassador Services', community: false, scanner: true, pro: true },
];

export default function SubscriptionPage() {
    const { user } = useUser();
    const { toast } = useToast();
    const router = useRouter();
    const [isProcessing, setIsProcessing] = useState<string | null>(null);

    const handleUpgrade = async (priceIdKey: 'scanner' | 'pro', planName: string) => {
        if (!user) {
            toast({
                title: 'Please log in',
                description: 'You need to be logged in to subscribe.',
                variant: 'destructive',
            });
            router.push('/login');
            return;
        }

        setIsProcessing(planName);
        toast({
            title: 'Redirecting to checkout...',
            description: `You will be securely redirected to Stripe to complete your ${planName} subscription.`,
        });

        const priceId = priceIdKey === 'scanner' 
            ? process.env.NEXT_PUBLIC_STRIPE_SCANNER_PRICE_ID
            : process.env.NEXT_PUBLIC_STRIPE_PRO_PRICE_ID;

        try {
            const response = await fetch('/api/stripe/create-checkout', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    priceId,
                    userEmail: user.email,
                }),
            });

            const { url, error } = await response.json();

            if (error) throw new Error(error);
            if (url) window.location.href = url;
            else throw new Error('Could not initiate subscription. Please try again.');

        } catch (err: any) {
            console.error(err);
            toast({
                variant: 'destructive',
                title: 'Subscription Failed',
                description: err.message || 'An unexpected error occurred. Please contact support.',
            });
            setIsProcessing(null);
        }
    };

    return (
        <div className="container mx-auto py-8">
            <header className="text-center mb-10">
                <h1 className="text-4xl font-extrabold tracking-tight">Find the Right Plan for You</h1>
                <p className="text-lg text-muted-foreground mt-2">Start for free, or unlock advanced tools to maximize your profit and impact.</p>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
                {/* Community Tier */}
                <Card>
                    <CardHeader>
                        <CardTitle>Community</CardTitle>
                        <CardDescription>For casual users and those getting started.</CardDescription>
                        <p className="text-4xl font-bold">$0</p>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <ul className="space-y-3 text-sm">
                            {features.map((feature) => (
                                <li key={feature.name} className="flex items-center">
                                    {feature.community ? <Check className="mr-2 h-4 w-4 text-green-500" /> : <X className="mr-2 h-4 w-4 text-muted-foreground" />}
                                    <span className={cn(!feature.community && "text-muted-foreground")}>{feature.name} {typeof feature.community === 'string' && <span className="font-semibold text-foreground">({feature.community})</span>}</span>
                                </li>
                            ))}
                        </ul>
                    </CardContent>
                    <CardFooter>
                        <Button variant="outline" className="w-full" disabled>Current Plan</Button>
                    </CardFooter>
                </Card>

                {/* Scanner Tier */}
                <Card className="border-primary shadow-lg">
                    <CardHeader>
                        <CardTitle>Scanner</CardTitle>
                        <CardDescription>For dedicated thrifters and resellers.</CardDescription>
                        <p className="text-4xl font-bold">$8.99<span className="text-lg font-normal text-muted-foreground">/mo</span></p>
                        <p className="text-sm text-muted-foreground">or $2.99/week (coming soon)</p>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <ul className="space-y-3 text-sm">
                            {features.map((feature) => (
                                <li key={feature.name} className="flex items-center">
                                    {feature.scanner ? <Check className="mr-2 h-4 w-4 text-green-500" /> : <X className="mr-2 h-4 w-4 text-muted-foreground" />}
                                    <span className={cn(!feature.scanner && "text-muted-foreground")}>{feature.name} {typeof feature.scanner === 'string' && <span className="font-semibold text-foreground">({feature.scanner})</span>}</span>
                                </li>
                            ))}
                        </ul>
                    </CardContent>
                    <CardFooter>
                         <Button onClick={() => handleUpgrade('scanner', 'Scanner')} disabled={isProcessing !== null} className="w-full">
                            {isProcessing === 'Scanner' ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                            Upgrade to Scanner
                        </Button>
                    </CardFooter>
                </Card>

                {/* Pro Tier */}
                <Card>
                    <CardHeader>
                        <div className="flex justify-between items-center">
                            <CardTitle>Pro</CardTitle>
                            <Star className="text-primary fill-primary" />
                        </div>
                        <CardDescription>For professionals and small businesses.</CardDescription>
                        <p className="text-4xl font-bold">$28.99<span className="text-lg font-normal text-muted-foreground">/mo</span></p>
                    </CardHeader>
                    <CardContent className="space-y-4">
                         <ul className="space-y-3 text-sm">
                            {features.map((feature) => (
                                <li key={feature.name} className="flex items-center">
                                    {feature.pro ? <Check className="mr-2 h-4 w-4 text-green-500" /> : <X className="mr-2 h-4 w-4 text-muted-foreground" />}
                                    <span>{feature.name} {typeof feature.pro === 'string' && <span className="font-semibold">({feature.pro})</span>}</span>
                                </li>
                            ))}
                        </ul>
                    </CardContent>
                    <CardFooter>
                         <Button onClick={() => handleUpgrade('pro', 'Pro')} disabled={isProcessing !== null} className="w-full" variant="secondary">
                            {isProcessing === 'Pro' ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                            Upgrade to Pro
                        </Button>
                    </CardFooter>
                </Card>
            </div>
        </div>
    );
}
