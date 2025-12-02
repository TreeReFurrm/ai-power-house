
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BadgePercent, Sparkles, LayoutGrid, Wrench, Search, Handshake } from "lucide-react";
import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-col gap-8">
      <div className="text-center md:text-left">
        <h1 className="text-3xl font-bold tracking-tight">Welcome to ReFurrm SmartScan</h1>
        <p className="text-muted-foreground">Your AI assistant for de-cluttering and ethical selling.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Link href="/list" className="md:col-span-2 flex">
           <Card className="flex flex-col w-full rounded-lg shadow-sm hover:shadow-lg transition-shadow hover:bg-card/95 cursor-pointer">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Instant Listing Generator</span>
                  <Sparkles className="h-5 w-5 text-muted-foreground" />
                </CardTitle>
              </CardHeader>
              <CardContent className="flex-grow">
                 <p className="text-sm text-muted-foreground">Generate a complete, professional listing from just a photo in seconds.</p>
              </CardContent>
            </Card>
        </Link>
        
        <Link href="/verify" className="flex">
           <Card className="flex flex-col w-full rounded-lg shadow-sm hover:shadow-lg transition-shadow hover:bg-card/95 cursor-pointer">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Ethical Price Engine</span>
                  <BadgePercent className="h-5 w-5 text-muted-foreground" />
                </CardTitle>
              </CardHeader>
              <CardContent className="flex-grow">
                <p className="text-sm text-muted-foreground">Get a fair price range based on real sales data, ensuring a quick and realistic sale.</p>
              </CardContent>
            </Card>
        </Link>

        <Link href="/marketplace" className="flex">
            <Card className="flex flex-col w-full rounded-lg shadow-sm hover:shadow-lg transition-shadow hover:bg-card/95 cursor-pointer">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Marketplace</span>
                   <LayoutGrid className="h-5 w-5 text-muted-foreground" />
                </CardTitle>
              </CardHeader>
              <CardContent className="flex-grow">
                <p className="text-sm text-muted-foreground">Browse curated listings or sell your own items on our ethical exchange.</p>
              </CardContent>
            </Card>
        </Link>
        
         <Link href="/services" className="md:col-span-2 flex">
           <Card className="flex flex-col w-full rounded-lg shadow-sm hover:shadow-lg transition-shadow hover:bg-card/95 cursor-pointer">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Ambassador Services</span>
                  <Handshake className="h-5 w-5 text-muted-foreground" />
                </CardTitle>
              </CardHeader>
              <CardContent className="flex-grow">
                <p className="text-sm text-muted-foreground">Need help with a bigger project? Our Ambassadors are here to assist with clean-outs, organization, and more.</p>
              </CardContent>
            </Card>
        </Link>
      </div>
    </div>
  );
}
