
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { AlertCircle } from "lucide-react";
import Link from "next/link";

const faqSections = {
  "SmartScan Tools": [
    {
      question: "What is SmartScan?",
      answer: "SmartScan is ReFURRM’s AI tool that helps you verify value, scan UPC codes, generate listings, and flag items that might be emotionally significant."
    },
    {
      question: "How accurate is the value checker tool?",
      answer: "SmartScan uses real-time resale data and condition scoring to provide an estimated value. It is an informed guide, not a guarantee of a final sale price."
    },
    {
      question: "Does SmartScan store my photos?",
      answer: "Photos are stored only as long as needed for the listing or appraisal, and then they are handled according to our data retention policy."
    }
  ],
  "Listing And Marketplace": [
    {
      question: "How do I list an item for sale?",
      answer: "Select “List an Item,” upload a photo, confirm the item's condition, edit any AI-generated details, and publish it to the ReFurrm Ethical Resale."
    },
    {
      question: "Can I edit a listing after it is posted?",
      answer: "Yes. You can update the price, description, and photos as long as the item has not been sold."
    },
    {
      question: "What is the ReFurrm Ethical Resale?",
      answer: "The ReFurrm Ethical Resale is the marketplace where you can buy items from other users and browse ReFURRBISHED inventory."
    },
    {
        question: "Why is an item marked with a 'Sentimental Hold'?",
        answer: "This label means the item may belong to an original owner. It is locked from sale while we investigate its origin."
    }
  ],
  "Ambassador Services": [
    {
      question: "How much do Ambassador services cost?",
      answer: "Costs depend on the project size and your location. You will see a clear estimate before you confirm your booking."
    },
    {
      question: "Do Ambassadors remove trash or junk?",
      answer: "Ambassadors focus on sorting, salvage, and documentation. Large trash removal may require a separate hauling service."
    },
    {
      question: "What happens if an Ambassador finds sentimental items?",
      answer: "They flag the items, log the details into SmartScan, and either confirm with you or initiate a return process if the items belong to someone else."
    }
  ],
  "Donations And LEAN Foundation": [
    {
      question: "What is the LEAN Foundation?",
      answer: "The LEAN Foundation is ReFURRM’s hardship prevention branch that uses funds from resale and donations to help users facing an auction or severe financial strain related to storage or housing."
    },
    {
        question: "Who can request hardship assistance?",
        answer: "Any user who can show they are at risk of losing a storage unit or key belongings to an auction is eligible, subject to available funding and verification."
    },
    {
        question: "How fast can assistance be released?",
        answer: "Once verified, many cases are processed within 24 to 48 hours, depending on partner processing times."
    }
  ],
   "Auction Prevention And Returns": [
    {
      question: "What should I do if I find my belongings listed in the app?",
      answer: "You should contact support immediately through Account → Help. We will freeze the listing and start a verification process to confirm ownership."
    },
    {
      question: "Can ReFURRM stop an auction for me?",
      answer: "ReFURRM cannot guarantee that an auction will be stopped. The LEAN Foundation can sometimes help with small, targeted assistance when it is possible and funding is available."
    },
    {
      question: "How do you verify original owners?",
      answer: "We use a combination of documentation, account history, proof of rental, and internal checks before releasing any item as a confirmed return."
    }
  ],
  "Account And Settings": [
    {
      question: "How do I update my contact information?",
      answer: "Go to Account → Edit Profile and update your email, phone number, or address."
    },
    {
      question: "How do I change my notification settings?",
      answer: "Go to Account → Notifications and toggle notifications on or off for listing updates, Ambassador messages, and impact reports."
    }
  ],
  "Safety And Policies": [
    {
      question: "What items are prohibited on the platform?",
      answer: "No weapons, hazardous materials, stolen goods, expired consumables, counterfeit items, or anything that violates local or federal law are allowed."
    },
    {
      question: "Are sales on the marketplace final?",
      answer: "Peer-to-peer sales are usually final. In cases of clear misrepresentation or safety concerns, please contact support."
    },
     {
      question: "What should I do if something feels wrong?",
      answer: "If any interaction inside the app feels unsafe or exploitative, use the Account → Help section so a human can review your case."
    }
  ],
   "Technical Issues": [
    {
      question: "My photo will not upload. What should I do?",
      answer: "First, check your internet connection, then try again with a smaller file size. If it still fails, restart the app and retry."
    },
    {
      question: "My camera is not working in the app. What should I do?",
      answer: "Please make sure camera permissions are enabled for the app in your device's settings."
    },
     {
      question: "The app will not let me log in. What should I do?",
      answer: "Please confirm your email and password are correct, then request a password reset if needed. If that fails, contact support."
    },
    {
      question: "The value checker tool is not loading. What's wrong?",
      answer: "This may be a temporary connection issue. Please try again in a few minutes. If the problem continues, report it under Account → Help."
    }
  ]
};

type FaqSection = keyof typeof faqSections;

export default function FaqPage() {
  return (
    <div className="container mx-auto max-w-3xl py-8 space-y-8">
      <header className="text-center space-y-4">
        <h1 className="text-4xl font-bold tracking-tight mt-2">Help Center and FAQ</h1>
        <p className="text-xl text-muted-foreground">Find answers fast or search for a specific topic.</p>
        <div className="px-4">
            <Input 
                placeholder="Search by keyword, tool, or question (e.g., 'camera not working', 'Ambassador pricing')"
            />
        </div>
      </header>

      <Card className="bg-destructive/10 border-destructive/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><AlertCircle className="size-5"/> Hardship Assistance</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">If you need help preventing a storage auction or recovering items never meant to be sold, start a hardship request here. Human support email: <a href="mailto:lean@refurrm.org" className="text-primary underline">lean@refurrm.org</a></p>
          <Button asChild>
            <a href="mailto:lean@refurrm.org">Request Hardship Review</a>
          </Button>
        </CardContent>
      </Card>

      {Object.keys(faqSections).map(section => (
        <Card key={section}>
            <CardHeader>
                <CardTitle>{section}</CardTitle>
            </CardHeader>
            <CardContent>
                <Accordion type="single" collapsible className="w-full">
                    {(faqSections[section as FaqSection]).map((item, index) => (
                        <AccordionItem value={`item-${section}-${index}`} key={index}>
                            <AccordionTrigger className="text-left">{item.question}</AccordionTrigger>
                            <AccordionContent>
                            {item.answer}
                            </AccordionContent>
                        </AccordionItem>
                    ))}
                </Accordion>
            </CardContent>
        </Card>
      ))}
    </div>
  );
}
