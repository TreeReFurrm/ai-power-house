
'use client';

import { DollarSign, LifeBuoy, FileText, SearchCheck, ShieldCheck, HandHeart, Target, AlertCircle, Users, Network } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';

const contributionTiers = [
    {
        amount: 25,
        title: 'Ethical Review',
        impact: 'Supports the full labor cost of an Agent Supervisor performing the mandatory compliance review for one AI-flagged sensitive item.',
        pillar: 'Ethics',
        icon: ShieldCheck,
    },
    {
        amount: 50,
        title: 'Legacy Outreach',
        impact: 'Funds the certified search, identity verification, and initial outreach attempts to contact a former owner for item recovery.',
        pillar: 'Legacy',
        icon: SearchCheck,
    },
    {
        amount: 100,
        title: 'Action Support',
        impact: 'Contributes directly to the "LEAN on ReFURRM" micro-fund for providing emergency assistance to individuals facing unit loss.',
        pillar: 'Action',
        icon: LifeBuoy,
    },
];

export default function DonationPage() {
  return (
    <div className="max-w-4xl mx-auto p-4 space-y-12">
      <header className="text-center space-y-4">
        <HandHeart className="w-12 h-12 text-primary mx-auto" />
        <h1 className="text-4xl font-extrabold tracking-tight text-primary">
          Our Mission: Legacy & Ethics Action Network (L.E.A.N.)
        </h1>
        <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
          ReFURRM's core mission is to build a network that ensures profit is balanced with responsibility at every step of the reverse logistics chain.
        </p>
      </header>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
          <Card className="flex flex-col">
              <CardHeader>
                  <FileText className="size-10 mx-auto text-primary" />
                  <CardTitle className="text-2xl font-bold">Legacy</CardTitle>
                  <p className="font-semibold">Preservation</p>
              </CardHeader>
              <CardContent className="flex-grow text-sm text-muted-foreground space-y-2">
                  <p><span className="font-semibold text-foreground">Focus:</span> Protecting items of personal significance flagged during the Chain-of-Custody process.</p>
              </CardContent>
          </Card>
          <Card className="flex flex-col">
              <CardHeader>
                  <ShieldCheck className="size-10 mx-auto text-primary" />
                  <CardTitle className="text-2xl font-bold">Ethics</CardTitle>
                   <p className="font-semibold">Standards</p>
              </CardHeader>
              <CardContent className="flex-grow text-sm text-muted-foreground space-y-2">
                  <p><span className="font-semibold text-foreground">Focus:</span> Enforcing the Privacy & Dignity Standard for all sensitive materials (documents, hard drives).</p>
              </CardContent>
          </Card>
           <Card className="flex flex-col">
              <CardHeader>
                  <Users className="size-10 mx-auto text-primary" />
                  <CardTitle className="text-2xl font-bold">Action</CardTitle>
                   <p className="font-semibold">Support</p>
              </CardHeader>
              <CardContent className="flex-grow text-sm text-muted-foreground space-y-2">
                  <p><span className="font-semibold text-foreground">Focus:</span> Providing rapid, compassionate support and assistance to individuals facing urgent situations.</p>
              </CardContent>
          </Card>
           <Card className="flex flex-col">
              <CardHeader>
                  <Network className="size-10 mx-auto text-primary" />
                  <CardTitle className="text-2xl font-bold">Network</CardTitle>
                   <p className="font-semibold">Coordination</p>
              </CardHeader>
              <CardContent className="flex-grow text-sm text-muted-foreground space-y-2">
                  <p><span className="font-semibold text-foreground">Focus:</span> Funding and coordinating the Ambassadors who perform ethical intake and outreach services.</p>
              </CardContent>
          </Card>
      </div>

       <Separator />

       <div className="space-y-6 text-center">
            <h2 className="text-3xl font-bold tracking-tight">Invest in Integrity: Your Contribution Fuels L.E.A.N. Action</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">Your financial support funds the specific tools and personnel required to execute the Legacy, Ethics, and Action protocols.</p>
        </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {contributionTiers.map(tier => (
          <Card key={tier.amount} className="flex flex-col text-center">
            <CardHeader>
              <div className="flex items-center justify-center gap-2">
                <tier.icon className="size-6 text-primary" />
                <CardTitle className="text-xl">{tier.title}</CardTitle>
              </div>
              <p className="text-4xl font-bold">${tier.amount}</p>
              <p className="text-xs text-muted-foreground uppercase tracking-wider">{tier.pillar}</p>
            </CardHeader>
            <CardContent className="flex-grow">
              <p className="text-sm text-muted-foreground">{tier.impact}</p>
            </CardContent>
            <CardFooter>
              <Button variant="secondary" className="w-full">Contribute ${tier.amount}</Button>
            </CardFooter>
          </Card>
        ))}
      </div>
      
       <Alert>
          <Target className="h-4 w-4"/>
          <AlertTitle>Financial Disclosure</AlertTitle>
          <AlertDescription>
             All "LEAN on ReFURRM" applications are reviewed according to strict ethical guidelines. Any unused funds are strictly reserved for future, approved needs within the same mission.
          </AlertDescription>
       </Alert>

       <Alert variant="destructive" className="mt-8">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Facing an Imminent Auction?</AlertTitle>
            <AlertDescription>
                If your situation is time-sensitive, do not use the standard forms. Contact our crisis team directly for the fastest response.
                 <Button asChild variant="link" className="p-0 h-auto ml-1 font-semibold text-destructive">
                    <a href="mailto:lean@refurrm.org">Request Hardship Review</a>
                </Button>
            </AlertDescription>
       </Alert>
    </div>
  );
}
