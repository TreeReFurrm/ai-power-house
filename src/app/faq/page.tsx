
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

const faqSections = {
  "SmartScan Basics": [
    {
      question: "What is SmartScan?",
      answer: "SmartScan is ReFURRM’s AI-powered tool that lets you verify value, check UPC deals, list items instantly, and identify sentimental objects during intake."
    },
    {
      question: "Does SmartScan store my photos?",
      answer: "Only for the duration needed to generate your listing or appraisal. Everything else is deleted per policy."
    },
    {
      question: "How accurate is the value checker?",
      answer: "It uses live-market resale data, trending demand, and condition scoring to give you a 90-percent confidence estimate."
    }
  ],
  "Listing Items": [
    {
      question: "How do I list an item?",
      answer: "Tap “List an Item,” upload a photo, confirm condition, and the AI will generate your listing automatically."
    },
    {
      question: "Can I edit the listing?",
      answer: "Yes, you can edit everything before posting to the Exchange."
    },
    {
      question: "Do items get reviewed?",
      answer: "Yes. A moderator checks for prohibited items and verifies safety compliance."
    }
  ],
  "Marketplace": [
    {
      question: "What is the ReFURRM Exchange?",
      answer: "A community marketplace where you can buy from other users or browse ReFURRBISHED items."
    },
    {
      question: "Why are some items marked “Sentimental Hold”?",
      answer: "Those items are flagged as possibly belonging to original owners. They cannot be purchased."
    }
  ],
  "Services & Ambassadors": [
    {
      question: "How much do Ambassador services cost?",
      answer: "Costs vary by project size. A price estimate is shown before confirming."
    },
    {
      question: "Do Ambassadors remove trash?",
      answer: "No. Their work focuses on salvage, organization, and ethical intake."
    },
    {
      question: "What happens if they find sentimental items?",
      answer: "They log them in SmartScan, flag them, and initiate a return attempt."
    }
  ],
  "Donations": [
    {
      question: "Where do donation proceeds go?",
      answer: "Into the LEAN Foundation hardship-prevention fund."
    },
    {
      question: "Can I track impact?",
      answer: "Yes. The app displays anonymized weekly impact reports."
    }
  ],
  "Auction-Prevention Assistance": [
    {
      question: "What is LEAN Foundation?",
      answer: "ReFURRM’s hardship prevention branch. It provides micro-assistance for users facing storage auction loss."
    },
    {
      question: "Who qualifies?",
      answer: "Any user verified as at risk of auction, subject to available funding."
    },
    {
      question: "How fast is assistance released?",
      answer: "Usually within 24 to 48 hours after verification."
    }
  ],
  "Account & Settings": [
    {
      question: "How do I update my email or phone number?",
      answer: "Go to Account → Edit Profile."
    },
    {
      question: "Can I disable notifications?",
      answer: "Yes. Toggle under Account → Notifications."
    }
  ],
  "Safety & Policies": [
    {
      question: "What items are prohibited from sale?",
      answer: "Hazardous chemicals, weapons, expired food, counterfeit goods, and anything unsafe for resale."
    },
    {
      question: "Are returns allowed?",
      answer: "Marketplace sales between users are final unless the seller misrepresented the item."
    },
    {
      question: "What if I find my own items for sale?",
      answer: "Contact support immediately. ReFURRM will investigate and initiate return protocols if applicable."
    }
  ],
  "Contact": [
    {
      question: "How do I reach support?",
      answer: "In-app messaging under Account → Support or email lean@refurrm.org."
    }
  ]
};

type FaqSection = keyof typeof faqSections;

export default function FaqPage() {
  return (
    <div className="container mx-auto max-w-3xl py-8 space-y-8">
      <header className="text-center">
        <Badge variant="outline">Support</Badge>
        <h1 className="text-4xl font-bold tracking-tight mt-2">Frequently Asked Questions</h1>
      </header>

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
