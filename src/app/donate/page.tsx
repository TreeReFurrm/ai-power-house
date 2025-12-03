
'use client';

import { DollarSign, Gift, ArrowRight, UserPlus, Heart, Info, Loader2, BookCheck, ShieldCheck, LifeBuoy, Package, Box, Sparkles, AlertCircle, HardHat } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
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
         Donate to the L.E.A.N. Foundation
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto font-mono tracking-widest">
          Legacy • Ethics • Auction • Needs
        </p>
        <p className="text-lg text-muted-foreground max-w-3xl mx-auto pt-2">
          Item donations are ethically processed, priced by SmartScan, and sold through the Marketplace. 100% of net proceeds fund the L.E.A.N. hardship assistance program to prevent auction loss.
        </p>
      </header>
      
      <Card>
        <CardHeader>
            <CardTitle className="text-2xl text-center">Choose Your Donation Service</CardTitle>
            <CardDescription className="text-center">Select the option that best fits your project.</CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
            <Card className="flex flex-col">
                <CardHeader>
                    <HardHat className="size-10 mx-auto text-primary" />
                    <CardTitle className="text-xl">Full-Service Clean-out</CardTitle>
                </CardHeader>
                <CardContent className="flex-grow">
                    <p className="text-sm text-muted-foreground">For large projects, estates, or storage unit clear-outs. An Ambassador manages sorting, inventory, and logistics.</p>
                     <p className="text-xs text-primary/80 mt-2">(Commission-based service applies)</p>
                </CardContent>
                <CardFooter>
                    <Button onClick={() => router.push('/services')} className="w-full">
                        Request Ambassador
                    </Button>
                </CardFooter>
            </Card>
            <Card className="flex flex-col">
                <CardHeader>
                    <Package className="size-10 mx-auto text-primary" />
                    <CardTitle className="text-xl">Logistics Pickup</CardTitle>
                </CardHeader>
                <CardContent className="flex-grow">
                    <p className="text-sm text-muted-foreground">For 1-10 items already sorted, packed, and ready for fast collection by a local Ambassador.</p>
                </CardContent>
                 <CardFooter>
                    <Button onClick={() => router.push('/services')} className="w-full">
                        Schedule Pickup
                    </Button>
                </CardFooter>
            </Card>
            <Card className="flex flex-col">
                <CardHeader>
                    <Sparkles className="size-10 mx-auto text-primary" />
                    <CardTitle className="text-xl">DIY Listing for L.E.A.N.</CardTitle>
                </CardHeader>
                <CardContent className="flex-grow">
                    <p className="text-sm text-muted-foreground">For Pro users who want to list their own items and dedicate 100% of the sale proceeds to the L.E.A.N. Fund.</p>
                </CardContent>
                 <CardFooter>
                    <Button onClick={() => router.push('/list')} className="w-full">
                        List for L.E.A.N. Fund
                    </Button>
                </CardFooter>
            </Card>
        </CardContent>
      </Card>

      <Card>
          <CardHeader>
              <CardTitle className="text-2xl">Ethical Intake & Item Integrity</CardTitle>
              <CardDescription>
                  We process all items with dignity. If an item is identified as potentially sentimental or belonging to a previous owner, we place a Sentimental Hold to investigate safe return before any sale proceeds.
              </CardDescription>
          </CardHeader>
          <CardContent>
              <Accordion type="single" collapsible className="w-full">
                  <AccordionItem value="item-1">
                      <AccordionTrigger>Acceptable Items</AccordionTrigger>
                      <AccordionContent>
                         Home goods, quality electronics, small furniture, and unique items with clear resale value.
                      </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="item-2">
                      <AccordionTrigger>Exclusions</AccordionTrigger>
                      <AccordionContent>
                          Large custom furniture, hazardous waste, broken appliances, and non-compliant materials.
                      </AccordionContent>
                  </AccordionItem>
              </Accordion>
          </CardContent>
      </Card>

       <Alert variant="destructive" className="mt-8">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>URGENT: Auction Risk?</AlertTitle>
            <AlertDescription>
                If you are behind on storage rent or facing an imminent auction, do not proceed with a donation. Contact the L.E.A.N. Foundation directly for time-sensitive, targeted assistance.
                 <Button asChild variant="link" className="p-0 h-auto ml-1 font-semibold text-destructive">
                    <Link href="/faq">Request Hardship Review</Link>
                </Button>
            </AlertDescription>
       </Alert>
    </div>
  );
}
