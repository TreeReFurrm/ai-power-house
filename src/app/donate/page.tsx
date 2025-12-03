
'use client';

import { DollarSign, Gift, ArrowRight, UserPlus, Heart, Info, Loader2, BookCheck, ShieldCheck, LifeBuoy } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useUser } from '@/firebase';
import Link from 'next/link';
import { Separator } from '@/components/ui/separator';

export default function DonationPage() {
  const router = useRouter();
  const [amount, setAmount] = useState(50); // Default donation amount
  const { toast } = useToast();
  const [isProcessing, setIsProcessing] = useState(false);
  const { user } = useUser();

  const impactTiers = [
    { amount: 25, label: '$25', description: 'Supports the full labor cost of an Agent Supervisor performing the mandatory compliance review for one AI-flagged sensitive item.', pillar: 'Ethics', icon: ShieldCheck },
    { amount: 50, label: '$50', description: 'Funds the certified search, identity verification, and initial outreach attempts to contact a former owner for item recovery.', pillar: 'Legacy', icon: BookCheck },
    { amount: 100, label: '$100', description: 'Contributes directly to the "LEAN on ReFurrm" micro-fund for providing emergency assistance to individuals facing unit loss.', pillar: 'Auction Support', icon: LifeBuoy },
  ];

  // Handler for Monetary Donation
  const handleMonetaryDonate = async () => {
    setIsProcessing(true);
    toast({
        title: 'Processing Donation...',
        description: `We are redirecting you to our secure payment processor.`
    });

    try {
      const response = await fetch('/api/stripe/create-checkout', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
              amount: amount,
              donorEmail: user?.email,
              donorName: user?.displayName || 'Anonymous Supporter'
          }),
      });

      const { url, error } = await response.json();

      if (error) {
        throw new Error(error);
      }

      if (url) {
        // Redirect to Stripe's checkout page
        router.push(url);
      } else {
        throw new Error('Could not initiate donation. Please try again.');
      }
    } catch (err: any) {
        console.error(err);
        toast({
            variant: 'destructive',
            title: 'Donation Failed',
            description: err.message || 'An unexpected error occurred. Please try again later.'
        });
        setIsProcessing(false);
    }
  };

  // Handler for Item Donation - Reroutes to the item scanning/listing flow
  const handleItemDonate = () => {
    router.push('/list'); 
  };
    
  // Handler to route to the Ambassador sign-up page
  const handleAmbassadorInterest = () => {
    router.push('/ambassadors/apply'); 
  };

  return (
    <div className="max-w-5xl mx-auto p-4 space-y-10">
      <header className="text-center space-y-3">
        <Heart className="w-12 h-12 text-primary mx-auto" />
        <h1 className="text-4xl font-extrabold tracking-tight">
         Donate to the LEAN Foundation
        </h1>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
          Your contributions power our ethical preservation efforts and community support network.
        </p>
      </header>
      
      {/* --- Mission & Disclosure Block --- */}
      <Card className="bg-primary/5 border-primary/20 shadow-inner">
        <CardHeader className="text-center">
            <CardTitle className="flex items-center gap-2 text-xl text-primary mx-auto">
                <Info className="w-5 h-5" />
                Our Mission: The L.E.A.N. Protocol
            </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm text-center">
            <p className="max-w-prose mx-auto">
               ReFURRM SmartScan's core mission is to uphold the L.E.A.N. Protocol across every step of the reverse logistics chain, ensuring that profit is balanced with responsibility.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 text-left">
                <div className="p-4 rounded-lg bg-background/50">
                    <h3 className="font-bold">L: Legacy Preservation</h3>
                    <p className="text-xs text-muted-foreground">Focus: Protecting items of significance and personal value flagged during the Chain-of-Custody process.<br/><b>Action:</b> Funding secure, 30-day archival storage and the specialized outreach needed for former owner recovery.</p>
                </div>
                 <div className="p-4 rounded-lg bg-background/50">
                    <h3 className="font-bold">E: Ethical Standards</h3>
                    <p className="text-xs text-muted-foreground">Focus: Enforcing the Privacy & Dignity Standard for all sensitive materials (e.g., documents, hard drives).<br/><b>Action:</b> Covering the cost of mandatory human review for AI-flagged items and certified, secure destruction when recovery is not possible.</p>
                </div>
                 <div className="p-4 rounded-lg bg-background/50">
                    <h3 className="font-bold">A: Auction Support</h3>
                    <p className="text-xs text-muted-foreground">Focus: Providing rapid, compassionate support to individuals facing urgent situations related to storage unit loss.<br/><b>Action:</b> Funding the "LEAN on ReFURRM" program, which offers emergency assistance, micro-loan options, and direct coordination with our Ambassador network.</p>
                </div>
            </div>
        </CardContent>
      </Card>
      {/* ------------------------------------- */}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* === COLUMN 1: MONETARY DONATION (IMPACT TIERS) === */}
        <Card className="lg:col-span-2 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-2xl">
              <DollarSign className="w-6 h-6" />
              Invest in Integrity
            </CardTitle>
            <CardDescription>
              Your financial support funds the specific tools and personnel required to execute the Legacy, Ethics, and Auction Support protocols.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {impactTiers.map((tier) => (
                  <Button 
                    key={tier.amount} 
                    variant={amount === tier.amount ? 'default' : 'outline'}
                    onClick={() => setAmount(tier.amount)}
                    className="flex flex-col h-auto py-4 text-center justify-center items-start text-left"
                    disabled={isProcessing}
                  >
                    <div className="flex items-center gap-2">
                        <tier.icon className="size-5 text-primary"/>
                        <span className="text-lg font-bold">{tier.label}</span>
                    </div>
                     <p className="text-xs text-muted-foreground/90 mt-2 block whitespace-normal">{tier.description}</p>
                     <p className="text-xs font-semibold mt-2">{tier.pillar}</p>
                  </Button>
                ))}
              </div>
                <Separator />
              <div className="space-y-4">
                <Label htmlFor="amount-custom" className="font-semibold">Custom Amount (USD)</Label>
                <Input
                  id="amount-custom"
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(parseFloat(e.target.value) || 0)}
                  min="5"
                  step="5"
                  className="text-lg py-6"
                  placeholder="50"
                  disabled={isProcessing}
                />
              </div>
              <Button 
                onClick={handleMonetaryDonate} 
                className="w-full h-12 text-lg"
                disabled={isProcessing || amount <= 0}
              >
                {isProcessing ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                {isProcessing ? 'Processing...' : `Contribute $${amount.toFixed(2)} Now`}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* === COLUMN 2: PHYSICAL ITEM DONATION & AMBASSADOR CALL === */}
        <div className="space-y-6">
            <Card className="h-full flex flex-col">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-2xl">
                  <Gift className="w-6 h-6" />
                  ReFurrbish an Item
                </CardTitle>
                <CardDescription>
                  Donate an item for ethical resale. All proceeds support the L.E.A.N. mission. <Button variant="link" asChild className="p-0 h-auto"><Link href="/refurrbish-guide">Learn More</Link></Button>
                </CardDescription>
              </CardHeader>
              <CardContent className="flex-grow flex flex-col justify-between">
                  <ul className="space-y-2 text-sm text-muted-foreground mb-4 list-disc pl-5">
                    <li>Use our AI tools to submit your item.</li>
                    <li>We handle assessment, resale, and direct all net proceeds to the L.E.A.N. Foundation.</li>
                  </ul>
                  <Button onClick={handleItemDonate} className="w-full mt-auto">
                    ReFurrbish an Item <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-2xl">
                  <UserPlus className="w-6 h-6" />
                  Become an Ambassador
                </CardTitle>
                <CardDescription>
                  Lead local efforts, coordinate pickups, and be a core part of our mission. <Button variant="link" asChild className="p-0 h-auto"><Link href="/ambassadors/how-it-works">Learn More</Link></Button>
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button 
                    variant="default" 
                    onClick={handleAmbassadorInterest} 
                    className="w-full"
                    disabled={isProcessing}
                >
                  Apply Now
                </Button>
              </CardContent>
            </Card>
        </div>
      </div>
       <Card className="mt-8">
            <CardHeader>
                <CardTitle>Disclosure</CardTitle>
            </CardHeader>
            <CardContent>
                <p className="text-xs text-muted-foreground">All "LEAN on ReFURRM" applications are reviewed according to strict ethical guidelines. Any unused funds are strictly reserved for future, approved needs within the same mission.</p>
            </CardContent>
       </Card>
    </div>
  );
}
