
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { Badge } from "@/components/ui/badge";

const donationFaqData = [
    {
        question: "What types of items can I donate?",
        answer: "Most household goods, furniture, electronics, décor, clothing, books, toys, and small appliances. We cannot accept hazardous materials or broken items that cannot be repaired safely."
    },
    {
        question: "Is my donation tax deductible?",
        answer: "Donations support the LEAN Foundation (our hardship-prevention branch). Tax-deductible eligibility will be listed once nonprofit status is publicly active inside the app."
    },
    {
        question: "Do I need to clean the items first?",
        answer: "No, but it helps. Ambassadors will process everything to meet resale standards."
    },
    {
        question: "Do you pick up donations?",
        answer: "Yes — available through Ambassador Service scheduling."
    },
    {
        question: "Can I donate sentimental items?",
        answer: "You can, but we will always ask if you are sure. If an item appears sentimental, Ambassadors will flag it for confirmation before resale."
    },
    {
        question: "Can I request proceeds from my donation?",
        answer: "No. Donations support the hardship fund. If you want to earn from an item, submit it under Quiet Consignment."
    },
    {
        question: "Where does the money go?",
        answer: "Straight into LEAN Foundation hardship assistance for users who request help preventing auctions."
    },
    {
        question: "How do I know my donation helped someone?",
        answer: "Inside the app you’ll see anonymized impact updates like: '3 users assisted this week', '$412 allocated to auction-prevention support', '12 items returned to original owners'."
    },
    {
        question: "Do you ever reject donations?",
        answer: "Yes: broken, moldy, unsafe, or non-restorable items will be declined."
    }
];


export default function DonationFaqPage() {
  return (
    <div className="container mx-auto max-w-3xl py-8 space-y-8">
        <header className="text-center">
            <Badge variant="outline">FAQ</Badge>
            <h1 className="text-4xl font-bold tracking-tight mt-2">Donation Questions</h1>
        </header>

        <Accordion type="single" collapsible className="w-full">
            {donationFaqData.map((item, index) => (
                 <AccordionItem value={`item-${index}`} key={index}>
                    <AccordionTrigger className="text-left">{item.question}</AccordionTrigger>
                    <AccordionContent>
                    {item.answer}
                    </AccordionContent>
                </AccordionItem>
            ))}
        </Accordion>
    </div>
  );
}
