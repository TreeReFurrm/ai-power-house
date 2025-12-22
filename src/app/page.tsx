
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight, ScanLine, Sparkles, Users } from "lucide-react";
import Link from "next/link";
import { DirectDonationForm } from "@/components/valuscan/direct-donation-form";

const tools = [
  {
    title: "Instant Listing Generator",
    description: "Upload a photo and let our AI create a title, description, and fair market price for you in seconds.",
    link: "/list",
    icon: Sparkles,
    cta: "Create a Listing",
  },
  {
    title: "Pricing Tool",
    description: "Quickly appraise an item's value based on its condition and where you found it. Perfect for yard sales.",
    link: "/verify",
    icon: ScanLine,
    cta: "Appraise an Item",
  },
  {
    title: "Ambassador Services",
    description: "Need hands-on help with a clean-out, organization, or large donation? Request a certified Ambassador.",
    link: "/services",
    icon: Users,
    cta: "Request a Service",
  },
]

export default function Home() {
  return (
    <div className="flex flex-col gap-8">
      
      {/* Header */}
      <div className="text-center">
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-primary">
          SmartScan
        </h1>
        <p className="mt-3 text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
          The AI-powered toolkit for ethical resale, donations, and profit.
        </p>
      </div>
      
      {/* Action Grid */}
      <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-2">
        {tools.map((tool) => (
          <Card key={tool.title} className="flex flex-col rounded-lg shadow-sm hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-start gap-4">
                <div className="bg-primary/10 p-3 rounded-full border border-primary/20">
                  <tool.icon className="size-6 text-primary" />
                </div>
                <CardTitle className="text-2xl font-bold tracking-tight">{tool.title}</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="flex-grow">
              <CardDescription>{tool.description}</CardDescription>
            </CardContent>
            <CardContent>
              <Button asChild className="w-full">
                  <Link href={tool.link}>
                      {tool.cta} <ArrowRight className="ml-2 size-4" />
                  </Link>
              </Button>
            </CardContent>
          </Card>
        ))}
         <DirectDonationForm />
      </div>
        
      <footer className="text-center text-xs text-muted-foreground py-4 border-t">
          <p>We only use your photos to create listings. We do not use your images to train models without your permission. <Link href="/privacy" className="underline">Privacy Policy</Link>.</p>
      </footer>
    </div>
  );
}
