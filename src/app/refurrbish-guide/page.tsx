
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export default function RefurrbishGuidePage() {
  return (
    <div className="container mx-auto max-w-3xl py-8 space-y-8">
      <header className="text-center">
        <Badge variant="outline">How Donations Work</Badge>
        <h1 className="text-4xl font-bold tracking-tight mt-2">ReFURRBISH an Item</h1>
      </header>

      <Card>
        <CardHeader>
          <CardTitle>What Does “ReFURRBISH” Mean?</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-muted-foreground">
          <p>
            ReFURRBISH is our ethical resale process. When you donate an item, we clean it, evaluate it using SmartScan AI, prepare it for resale, and list it in the ReFURRM Exchange.
          </p>
          <p className="font-semibold text-foreground">
            Proceeds directly support the LEAN Foundation hardship fund.
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>How the Donation Process Works</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <h3 className="font-semibold text-lg">1. You Donate an Item</h3>
            <p className="text-muted-foreground">
              Drop-off, pick-up, or submit through an Ambassador visit. Include notes if the item has sentimental value or should be treated with extra respect.
            </p>
          </div>
          <div>
            <h3 className="font-semibold text-lg">2. We Process It</h3>
            <p className="text-muted-foreground mb-2">Your item goes through ReFURRM’s ethical intake system:</p>
            <ul className="list-disc list-inside space-y-1 text-muted-foreground">
              <li>Clean and sanitize</li>
              <li>Light repair if needed</li>
              <li>Photograph and list</li>
              <li>Tag as ReFURRBISHED</li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold text-lg">3. We Determine Its Value</h3>
            <p className="text-muted-foreground">
              SmartScan assigns a market value based on current resale data. High-value items may qualify for Quiet Consignment, allowing you to earn a percentage.
            </p>
          </div>
          <div>
            <h3 className="font-semibold text-lg">4. It Enters the ReFURRM Exchange</h3>
            <p className="text-muted-foreground">
              Your donation becomes part of a mission-driven marketplace where buyers know their purchase funds someone’s second chance.
            </p>
          </div>
        </CardContent>
      </Card>

      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Where Proceeds Go</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-2">Sales from donations support:</p>
            <ul className="list-disc list-inside space-y-2 text-muted-foreground">
              <li>LEAN Foundation Hardship Grants: micro-assistance for users trying to stop storage auctions</li>
              <li>Item return costs (shipping, verification, location search)</li>
              <li>Kits and supplies for Ambassador projects</li>
              <li>Operational support for ethical salvage</li>
            </ul>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Why Donate to ReFURRM?</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground">
              Because your item doesn’t just get “resold.” It gets a new life with purpose attached to it.
            </p>
            <p className="font-semibold text-foreground">
              Every donated item keeps someone else from losing what was never meant to be sold.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
