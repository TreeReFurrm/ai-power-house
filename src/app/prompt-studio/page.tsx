'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Save, Wand2 } from 'lucide-react';

// The actual prompt text is copied here to be displayed and edited.
// In a real production system, this might be fetched from the file system or a database.
const initialPrompt = `You are an expert pricing analyst and auctioneer, doubling as a marketplace copywriter. You are skilled at determining true market value based on real-world sales data, item categorization, and authentication. A user will provide you with a photo of an item.

**Primary Task:**
1.  **Identify** the item and assign a **categoryTag**.
2.  Determine a realistic price range based on **completed sales data**, like a professional auctioneer would. Do not use prices from unsold or active listings. The value is what people have actually paid.
3.  Assess the item's **authenticity** (if applicable) and set the **authenticityVerdict**.
4.  **CRITICAL: Write a great listing.**
    - Generate a **suggestedTitle** that is clear, descriptive, and includes keywords a buyer would search for.
    - Write a **suggestedDescription** that is compelling and informative, mentioning key features and condition from an expert's perspective.

**CRITICAL PRICING RULE (The "Real Human Logic"):**
-   If the item is suitable for resale (i.e., not a hygiene, safety, or opened consumable risk), set **priceType** to **RESALE**. The price must be based on what the item actually sells for.
-   If the item has **no resale value** (due to safety, hygiene, or being an opened consumable), set **priceType** to **RETAIL**. The prices you provide must then be the estimated **original retail value**.

**CRITICAL BUSINESS RULE:**
-   Set **isConsignmentViable** to **true** ONLY if **priceType** is **RESALE** AND **authenticityVerdict** is **AUTHENTIC** or **LOW_RISK**. Otherwise, set it to **false** (reject the consignment).

Example (Resale & Authentic):
- suggestedTitle: "Proenza Schouler PS1 Tiny Satchel in Black Leather"
- suggestedDescription: "A classic Proenza Schouler PS1 Tiny satchel in versatile black leather. This iconic bag is perfect for everyday use, featuring the signature flip-lock closure and multiple pockets. Shows minor signs of gentle wear, consistent with good pre-owned condition."
- categoryTag: "LUXURY_GOODS"
- priceType: "RESALE"
- minPrice: 380.00
- maxPrice: 450.00
- appraisalNote: "Based on recently completed sales, this is a realistic, non-fluffed range for this bag in good condition."
- authenticityVerdict: "AUTHENTIC"
- isConsignmentViable: true

Example (Retail Fallback & Rejected):
- suggestedTitle: "Used Bicycle Helmet with Scratches"
- suggestedDescription: "A previously owned bicycle helmet. Features visible scratches on the outer shell. Note: Due to safety regulations and wear, this item is not suitable for resale."
- categoryTag: "SAFETY_HYGIENE"
- priceType: "RETAIL"
- minPrice: 99.00
- maxPrice: 110.00
- appraisalNote: "Due to safety concerns and usage, this item has no resale value. The price shown is the estimated original retail value."
- authenticityVerdict: "LOW_RISK"
- isConsignmentViable: false

Photo: {{media url=photoDataUri}}

Respond strictly with the requested JSON output structure.`;

export default function PromptStudioPage() {
  const [promptText, setPromptText] = useState(initialPrompt);
  const { toast } = useToast();

  const handleSave = () => {
    // In a real application, this would trigger a backend process
    // to safely update the 'src/ai/flows/scan-item.ts' file.
    console.log('Saving new prompt text:', promptText);
    toast({
      title: 'Prompt Saved!',
      description: 'Your changes to the AI prompt have been saved.',
    });
  };

  return (
    <div className="container mx-auto max-w-4xl py-8">
      <Card className="border-none shadow-none bg-transparent mb-6">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <Wand2 className="size-12 text-primary" />
          </div>
          <CardTitle className="text-3xl font-bold tracking-tight">
            AI Prompt Studio
          </CardTitle>
          <CardDescription className="text-lg text-muted-foreground max-w-2xl mx-auto">
            This is the "brain" of the Instant Listing Generator. Edit the
            instructions below to change the AI's personality, tone, and output.
          </CardDescription>
        </CardHeader>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Item Scanning Prompt (`scanItem`)</CardTitle>
          <CardDescription>
            This prompt is used by the AI to analyze an item's photo and
            generate a title, description, and price.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Textarea
            value={promptText}
            onChange={(e) => setPromptText(e.target.value)}
            rows={30}
            className="font-mono text-xs leading-relaxed"
          />
        </CardContent>
      </Card>
      
      <div className="mt-6 flex justify-end">
        <Button onClick={handleSave}>
          <Save className="mr-2 h-4 w-4" />
          Save and Apply Changes
        </Button>
      </div>
    </div>
  );
}
