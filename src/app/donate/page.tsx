
'use client';

import { DollarSign, Gift, ArrowRight, UserPlus, Heart, Info, Loader2, BookCheck, ShieldCheck, LifeBuoy, Package, Box, Sparkles, AlertCircle, HardHat } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

export default function DonationPage() {
  const router = useRouter();

  return (
    <div className="max-w-4xl mx-auto p-4 space-y-10">
      <header className="text-center space-y-3">
        <Heart className="w-12 h-12 text-primary mx-auto" />
        <h1 className="text-4xl font-extrabold tracking-tight">
          L.E.A.N. Foundation
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto font-mono tracking-widest">
          Legacy • Ethics • Assistance • Network
        </p>
        <p className="text-lg text-muted-foreground max-w-3xl mx-auto pt-2">
          The L.E.A.N. Foundation provides auction prevention, sentimental item return services, and direct hardship support. 100% of net proceeds from donated items fund this mission.
        </p>
      </header>
      
      <Card>
        <CardHeader>
            <CardTitle className="text-2xl text-center">How You Can Help</CardTitle>
            <CardDescription className="text-center">Choose the option that best fits your situation.</CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6 text-center">
            <Card className="flex flex-col">
                <CardHeader>
                    <Gift className="size-10 mx-auto text-primary" />
                    <CardTitle className="text-xl">Donate Items</CardTitle>
                </CardHeader>
                <CardContent className="flex-grow">
                    <p className="text-sm text-muted-foreground">Donate items to be ReFURBISHED and sold. Proceeds directly fund the L.E.A.N. mission.</p>
                </CardContent>
                <CardFooter>
                    <Button onClick={() => router.push('/refurrbish-guide')} className="w-full">
                        Start a Donation
                    </Button>
                </CardFooter>
            </Card>
            <Card className="flex flex-col">
                <CardHeader>
                    <DollarSign className="size-10 mx-auto text-primary" />
                    <CardTitle className="text-xl">Support the Fund</CardTitle>
                </CardHeader>
                <CardContent className="flex-grow">
                   <p className="text-sm text-muted-foreground">Make a direct financial contribution to support users facing hardship and operational costs for item returns.</p>
                </CardContent>
                 <CardFooter>
                    <Button variant="secondary" className="w-full">
                        Contribute Now
                    </Button>
                </CardFooter>
            </Card>
        </CardContent>
      </Card>

      <Card>
          <CardHeader>
              <CardTitle className="text-2xl">What We Do</CardTitle>
              <CardDescription>
                  Our core services are designed to provide a safety net for the most vulnerable situations in the resale and storage economy.
              </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
              <Accordion type="single" collapsible className="w-full">
                  <AccordionItem value="item-1">
                      <AccordionTrigger>Auction Prevention</AccordionTrigger>
                      <AccordionContent>
                         We provide small, targeted grants to help users pay off storage unit debt and prevent their belongings from being auctioned off. This is our primary mission.
                      </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="item-2">
                      <AccordionTrigger>Sentimental Item Return</AccordionTrigger>
                      <AccordionContent>
                          If we identify an item with high sentimental value (e.g., family photos, personal documents) in our intake process, we use our resources to find and return it to the original owner, free of charge.
                      </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="item-3">
                      <AccordionTrigger>Hardship Support</AccordionTrigger>
                      <AccordionContent>
                          For users in extreme circumstances, we offer support that goes beyond just funds, including connecting them with local resources and Ambassador-led assistance for sorting and decision-making.
                      </AccordionContent>
                  </AccordionItem>
              </Accordion>
          </CardContent>
      </Card>

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
