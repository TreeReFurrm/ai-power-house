
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight, Zap } from "lucide-react";
import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-col gap-8">
      
      {/* Hero Block */}
      <Card className="text-center bg-primary/5 border-primary/10">
        <CardHeader className="p-8 md:p-12">
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-primary">
            Ethics. Change. ReFURRM.
          </h1>
          <p className="mt-4 text-lg md:text-xl text-muted-foreground font-mono tracking-wide">
            The Dual Mission: Ethical Profit Meets Human Compassion.
          </p>
        </CardHeader>
        <CardContent className="px-8 md:px-12 pb-10">
          <p className="max-w-3xl mx-auto text-base text-foreground/90">
            ReFURRM transforms the resale industry by giving power back to the consumer. We provide industry-leading SmartScan tools for maximum ROI, while funding the L.E.A.N. Foundation to protect legacies and prevent auction loss.
          </p>
        </CardContent>
      </Card>
      
      {/* Action Columns */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Profit Column */}
        <Card className="flex flex-col w-full rounded-lg shadow-sm hover:shadow-lg transition-shadow hover:bg-card/95">
          <CardHeader>
            <CardTitle className="text-2xl font-bold tracking-tight">SCAN SMARTER, NOT HARDER</CardTitle>
            <CardDescription className="text-base">Unlock unlimited data, ROI analytics, and priority alerts. Turn every item into certain profit.</CardDescription>
          </CardHeader>
          <CardContent className="flex-grow flex flex-col justify-end">
            <Button asChild>
                <Link href="/subscription">
                    Unlock SmartScan Pro <Zap className="ml-2 size-4" />
                </Link>
            </Button>
          </CardContent>
        </Card>

        {/* Mission Column */}
        <Card className="flex flex-col w-full rounded-lg shadow-sm hover:shadow-lg transition-shadow hover:bg-card/95">
          <CardHeader>
            <CardTitle className="text-2xl font-bold tracking-tight">PROTECT A LEGACY TODAY</CardTitle>
            <CardDescription className="text-base">Donate items to fund the L.E.A.N. Foundation or request targeted hardship assistance to save belongings from auction.</CardDescription>
          </CardHeader>
          <CardContent className="flex-grow flex flex-col justify-end">
            <Button asChild variant="secondary">
                 <Link href="/donate">
                    Go to L.E.A.N. Foundation <ArrowRight className="ml-2 size-4" />
                 </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
        
      <footer className="text-center text-xs text-muted-foreground py-4">
          <p>We only use your photos to create listings. We do not use your images to train models without your permission. <Link href="/privacy" className="underline">Privacy Policy</Link>.</p>
      </footer>
    </div>
  );
}
