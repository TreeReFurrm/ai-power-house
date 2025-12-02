
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export default function AmbassadorHowItWorksPage() {
  return (
    <div className="container mx-auto max-w-3xl py-8 space-y-8">
      <header className="text-center">
        <Badge variant="outline">How It Works</Badge>
        <h1 className="text-4xl font-bold tracking-tight mt-2">The ReFURRM Ambassador Program</h1>
      </header>

      <Card>
        <CardHeader>
          <CardTitle>What Is the ReFURRM Ambassador Program?</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-muted-foreground">
          <p>
            Ambassadors are trained community partners who help users with the projects they can’t handle alone: clean-outs, organization, downsizing, item sorting, donation pickups, and on-site SmartScan support.
          </p>
          <p className="font-semibold text-foreground">
            They are not cleaners-for-hire. They are ethical processors trained to protect sentimental items, document value, and follow the ReFURRM Safeguard Protocol.
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>How It Works</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <h3 className="font-semibold text-lg">1. Submit a Request</h3>
            <p className="text-muted-foreground">
              Choose the service type inside the app (clean-out, organization, downsizing, donation pickup, or storage-unit assistance). Enter your ZIP code and project notes so the Ambassador knows what they’re walking into.
            </p>
          </div>
          <div>
            <h3 className="font-semibold text-lg">2. Ambassador Review</h3>
            <p className="text-muted-foreground">
              A certified ReFURRM Ambassador reviews the project details and confirms availability for your area. They may request additional photos or notes.
            </p>
          </div>
          <div>
            <h3 className="font-semibold text-lg">3. On-Site Support</h3>
            <p className="text-muted-foreground mb-2">Ambassadors follow ReFURRM's ethical intake standards:</p>
            <ul className="list-disc list-inside space-y-1 text-muted-foreground">
              <li>Identify and separate sentimental or “items never meant to be sold”</li>
              <li>Log anything returnable in the SmartScan system</li>
              <li>Photograph and document items for value verification</li>
              <li>Sort items into Keep / ReFURRBISH / Donate</li>
              <li>Provide you with a summary of what is salvageable, saleable, or returnable</li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold text-lg">4. After the Visit</h3>
            <p className="text-muted-foreground mb-2">You’ll receive a digital report inside the app showing:</p>
            <ul className="list-disc list-inside space-y-1 text-muted-foreground">
              <li>Items processed</li>
              <li>Items flagged for sentimental return</li>
              <li>Items eligible for ReFURRBISH (resale)</li>
              <li>Items donated to fund the LEAN Foundation</li>
            </ul>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
            <CardTitle>Where Fees Go</CardTitle>
        </CardHeader>
        <CardContent>
            <p className="text-muted-foreground">
                Part of every service fee helps sustain the LEAN Foundation, which provides hardship assistance for users in danger of losing their storage unit to auction.
            </p>
        </CardContent>
      </Card>

      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>When to Request an Ambassador</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="list-disc list-inside space-y-2 text-muted-foreground">
              <li>You’re overwhelmed</li>
              <li>You inherited a unit or property</li>
              <li>You don’t know what’s valuable</li>
              <li>You want to donate items ethically</li>
              <li>You need someone who understands the emotional weight behind the stuff</li>
            </ul>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>What Ambassadors Are Not</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <ul className="list-disc list-inside space-y-2 text-muted-foreground">
              <li>Not movers</li>
              <li>Not a junk hauling service</li>
              <li>Not a replacement for legal eviction/storage support</li>
              <li className="font-semibold text-foreground">Not buyers who profit off your loss</li>
            </ul>
            <p className="pt-2 font-semibold text-foreground">They are trained to protect your story, not exploit it.</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
