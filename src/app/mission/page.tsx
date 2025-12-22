
'use client';

import { DollarSign, LifeBuoy, FileText, SearchCheck, ShieldCheck, HandHeart, Target, AlertCircle, Users, Network, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import { useUser } from '@/firebase';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

const contributionTiers = [
    {
        amount: 25,
        title: 'Ethical Review',
        impact: 'Supports the full labor cost of an Agent Supervisor performing the mandatory compliance review for one AI-flagged sensitive item.',
        pillar: 'Ethics',
        icon: ShieldCheck,
        priceId: process.env.NEXT_PUBLIC_STRIPE_ETHICAL_REVIEW_PRICE_ID,
    },
    {
        amount: 50,
        title: 'Legacy Outreach',
        impact: 'Funds the certified search, identity verification, and initial outreach attempts to contact a former owner for item recovery.',
        pillar: 'Legacy',
        icon: SearchCheck,
        priceId: process.env.NEXT_PUBLIC_STRIPE_LEGACY_OUTREACH_PRICE_ID,
    },
    {
        amount: 100,
        title: 'Auction Relief',
        impact: 'Contributes directly to the "LEAN on ReFURRM" micro-fund for providing emergency assistance to individuals facing unit loss.',
        pillar: 'Auction Support',
        icon: LifeBuoy,
        priceId: process.env.NEXT_PUBLIC_STRIPE_AUCTION_RELIEF_PRICE_ID,
    },
];

export default function MissionPage() {
    const { user } = useUser();
    const { toast } = useToast();
    const router = useRouter();
    const [isProcessing, setIsProcessing] = useState<number | null>(null);

    const handleDonate = async (amount: number, priceId: string | undefined) => {
        if (!user) {
            toast({
                title: 'Please log in',
                description: 'You need to be logged in to make a donation.',
                variant: 'destructive',
            });
            router.push('/login');
            return;
        }
        
        if (!priceId) {
            toast({
                title: 'Configuration Error',
                description: 'This donation tier is not configured for payments yet. Please contact support.',
                variant: 'destructive',
            });
            return;
        }

        setIsProcessing(amount);
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
                    amount: amount,
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
                description: err.message || 'An unexpected error occurred. Please contact support.',
            });
            setIsProcessing(null);
        }
    };


  return (
    <div className="max-w-4xl mx-auto p-4 space-y-12">
      <header className="text-center space-y-4">
        <HandHeart className="w-12 h-12 text-primary mx-auto" />
        <h1 className="text-4xl font-extrabold tracking-tight text-primary">
          The Legacy & Ethics Action Network (L.E.A.N.)
        </h1>
        <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
          ReFURRM's core mission is to uphold the L.E.A.N. Protocol across every step of the reverse logistics chain, ensuring that profit is balanced with responsibility.
        </p>
      </header>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 text-center">
          <Card className="flex flex-col">
              <CardHeader>
                  <FileText className="size-10 mx-auto text-primary" />
                  <CardTitle className="text-2xl font-bold">Legacy</CardTitle>
              </CardHeader>
              <CardContent className="flex-grow text-sm text-muted-foreground">
                  <p><span className="font-semibold text-foreground">Focus:</span> Protecting items of personal significance flagged during the Chain-of-Custody process.</p>
                   <p className="mt-2"><span className="font-semibold text-foreground">Action:</span> Funding secure, 30-day archival storage and the specialized outreach needed for former owner recovery.</p>
              </CardContent>
          </Card>
          <Card className="flex flex-col">
              <CardHeader>
                  <ShieldCheck className="size-10 mx-auto text-primary" />
                  <CardTitle className="text-2xl font-bold">Ethics</CardTitle>
              </CardHeader>
              <CardContent className="flex-grow text-sm text-muted-foreground">
                  <p><span className="font-semibold text-foreground">Focus:</span> Enforcing the Privacy & Dignity Standard for all sensitive materials (e.g., documents, hard drives).</p>
                   <p className="mt-2"><span className="font-semibold text-foreground">Action:</span> Covering the cost of mandatory human review for AI-flagged items and certified, secure destruction when recovery is not possible.</p>
              </CardContent>
          </Card>
           <Card className="flex flex-col">
              <CardHeader>
                  <Users className="size-10 mx-auto text-primary" />
                  <CardTitle className="text-2xl font-bold">Action</CardTitle>
              </CardHeader>
              <CardContent className="flex-grow text-sm text-muted-foreground">
                  <p><span className="font-semibold text-foreground">Focus:</span> Providing rapid, compassionate support to individuals facing urgent situations related to storage unit loss.</p>
                   <p className="mt-2"><span className="font-semibold text-foreground">Action:</span> Funding the "LEAN on ReFURRM" program, which offers emergency assistance, micro-loan options, and direct coordination with our Ambassador network.</p>
              </CardContent>
          </Card>
           <Card className="flex flex-col">
              <CardHeader>
                  <Network className="size-10 mx-auto text-primary" />
                  <CardTitle className="text-2xl font-bold">Network</CardTitle>
              </CardHeader>
              <CardContent className="flex-grow text-sm text-muted-foreground">
                  <p><span className="font-semibold text-foreground">Focus:</span> Funding and coordinating the Ambassadors who perform ethical intake and outreach services.</p>
              </CardContent>
          </Card>
      </div>

       <Separator />
       
       <Alert>
          <Target className="h-4 w-4"/>
          <AlertTitle>Financial Disclosure</AlertTitle>
          <AlertDescription>
             All "LEAN on ReFURRM" applications are reviewed according to strict ethical guidelines. Any unused funds are strictly reserved for future, approved needs within the same mission.
          </AlertDescription>
       </Alert>

       <div className="bg-white text-destructive p-6 rounded-lg border-2 border-destructive shadow-2xl mt-8">
            <div className="flex items-center">
                <AlertCircle className="h-8 w-8 mr-4" />
                <h2 className="text-2xl font-bold">Facing an Imminent Auction?</h2>
            </div>
            <p className="mt-2 text-destructive/90">
                If your situation is time-sensitive, do not use the standard forms. Contact our crisis team directly for the fastest response.
            </p>
            <Button asChild variant="link" className="p-0 h-auto mt-2 font-bold text-lg text-destructive hover:text-destructive/80">
                <a href="mailto:lean@refurrm.org">Request Hardship Review</a>
            </Button>
       </div>
    </div>
  );
}
