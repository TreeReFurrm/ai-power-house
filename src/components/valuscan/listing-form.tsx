
'use client';

import { useState } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { ImageUploader } from './image-uploader';
import { Button } from '../ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from '../ui/form';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { Switch } from '../ui/switch';
import { scanItem, type ScanItemOutput } from '@/ai/flows/scan-item';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Sparkles, DollarSign, Heart, Tag, Info, X, AlertTriangle } from 'lucide-react';
import { Badge } from '../ui/badge';
import { useFirestore, addDocumentNonBlocking, useUser } from '@/firebase';
import { collection, serverTimestamp } from 'firebase/firestore';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Alert, AlertDescription, AlertTitle } from '../ui/alert';

const listingSchema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters."),
  description: z.string().min(20, "Description must be at least 20 characters."),
  tags: z.array(z.string()).min(1, "Please add at least one tag."),
  price: z.coerce.number().min(1, "Price must be at least $1."),
  enableEthicalContribution: z.boolean().default(false),
  contributionPercentage: z.coerce.number().min(1).max(100).optional(),
});

type ListingFormData = z.infer<typeof listingSchema>;

export function ListingForm() {
  const [photoDataUri, setPhotoDataUri] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSuggestingPrice, setIsSuggestingPrice] = useState(false);
  const [scanResult, setScanResult] = useState<ScanItemOutput | null>(null);
  const [tagInput, setTagInput] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { toast } = useToast();
  const firestore = useFirestore();
  const { user } = useUser();

  const form = useForm<ListingFormData>({
    resolver: zodResolver(listingSchema),
    defaultValues: {
      title: '',
      description: '',
      tags: [],
      price: undefined,
      enableEthicalContribution: false,
    },
  });

  const handleInitialScan = async (dataUri: string) => {
    if (!user) {
      toast({ variant: 'destructive', title: 'Please sign in to create a listing.'});
      return;
    }
    setPhotoDataUri(dataUri);
    setIsGenerating(true);
    setScanResult(null);

    try {
      const output = await scanItem({ photoDataUri: dataUri });
      setScanResult(output);

      if (!output.isConsignmentViable) {
        // Gatekeeper stops the flow here
        return; 
      }
      
      // Pre-fill the form with AI data
      form.setValue('title', output.itemName);
      form.setValue('description', output.appraisalNote);
      form.setValue('price', output.maxPrice); 
      // Tags could be derived from category or other data in a future iteration
      form.setValue('tags', [output.categoryTag.replace(/_/g, ' ')]);

    } catch (error: any) {
        console.error(error);
        toast({
            variant: 'destructive',
            title: 'Scan Failed',
            description: 'AI could not process the image. Please try again or fill details manually.',
        });
        // Allow manual entry if scan fails
        setScanResult({ isConsignmentViable: true } as ScanItemOutput); // Mock result to show form
    } finally {
      setIsGenerating(false);
    }
  };

  const handlePriceSuggestion = async () => {
    if (!scanResult) return;
    setIsSuggestingPrice(true);
    // In this new flow, price suggestion is part of the initial scan.
    // We just show the existing data.
    setTimeout(() => {
      form.setValue('price', scanResult.maxPrice);
      toast({ title: 'Price Updated', description: 'Set to the suggested maximum resale value.' });
      setIsSuggestingPrice(false);
    }, 500);
  };


  const handleAddTag = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && tagInput.trim()) {
      e.preventDefault();
      const currentTags = form.getValues('tags');
      if (!currentTags.includes(tagInput.trim())) {
        form.setValue('tags', [...currentTags, tagInput.trim()]);
      }
      setTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    form.setValue('tags', form.getValues('tags').filter(tag => tag !== tagToRemove));
  };
  
  const onSubmit = async (data: ListingFormData) => {
    if (!firestore || !user) {
       toast({
        variant: 'destructive',
        title: 'Authentication Error',
        description: 'You must be logged in to create a listing.',
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const itemsCollection = collection(firestore, 'items');
      const randomImage = PlaceHolderImages[Math.floor(Math.random() * PlaceHolderImages.length)];
      
      const newItem = {
        ...data,
        imageUrl: photoDataUri || randomImage.imageUrl, // In a real app, upload to storage and get URL
        imageHint: "custom item",
        createdAt: serverTimestamp(),
        userId: user.uid,
        status: 'listed'
      };
      
      addDocumentNonBlocking(itemsCollection, newItem);

      toast({
        title: "Listing Created!",
        description: "Your item is now live on the marketplace.",
      });

      // Reset form state
      handleReset();

    } catch (error) {
      console.error('Error creating listing:', error);
      toast({
        variant: 'destructive',
        title: 'Submission Failed',
        description: 'There was an error creating your listing.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const handleReset = () => {
    form.reset();
    setScanResult(null);
    setPhotoDataUri(null);
    setIsGenerating(false);
    setIsSubmitting(false);
  }

  if (!scanResult) {
    return (
      <Card>
        <CardContent className="p-6 flex flex-col items-center gap-6">
          <ImageUploader onImageUpload={(uri) => uri && handleInitialScan(uri)} disabled={isGenerating} />
          {isGenerating && (
            <div className="flex items-center text-muted-foreground">
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              <span>AI is analyzing your item...</span>
            </div>
          )}
        </CardContent>
      </Card>
    );
  }

  if (!scanResult.isConsignmentViable) {
    return (
        <Card>
            <CardContent className="p-6 flex flex-col items-center gap-6">
                 <Alert variant="destructive" className="text-center">
                    <AlertTriangle className="h-4 w-4" />
                    <AlertTitle>Listing Rejected</AlertTitle>
                    <AlertDescription>
                        {scanResult.appraisalNote}
                        {scanResult.priceType === 'RETAIL' && (
                            <p className="mt-2 font-bold">Estimated Retail Value for reference: ${scanResult.maxPrice.toFixed(2)}</p>
                        )}
                    </AlertDescription>
                </Alert>
                <Button onClick={handleReset} variant="outline">Try Another Item</Button>
            </CardContent>
        </Card>
    );
  }

  return (
    <FormProvider {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <Card>
          <CardHeader>
            <CardTitle>Review Your Listing</CardTitle>
            <CardDescription>Our AI has pre-filled the details. Feel free to make any changes.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Vintage Leather Armchair" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Describe your item..." rows={5} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="tags"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-2"><Tag className="size-4"/> Tags</FormLabel>
                   <FormControl>
                      <div>
                        <div className="flex flex-wrap gap-2 mb-2 min-h-[2.25rem]">
                          {field.value.map((tag) => (
                            <Badge key={tag} variant="secondary" className="pr-1 text-sm">
                              {tag}
                              <button type="button" onClick={() => handleRemoveTag(tag)} className="ml-1.5 rounded-full p-0.5 hover:bg-destructive/20">
                                <X className="size-3" />
                              </button>
                            </Badge>
                          ))}
                        </div>
                        <Input 
                          placeholder="Add a tag and press Enter" 
                          value={tagInput}
                          onChange={(e) => setTagInput(e.target.value)}
                          onKeyDown={handleAddTag}
                        />
                      </div>
                    </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><DollarSign className="size-5"/> Pricing</CardTitle>
            <CardDescription>Set your price. Our AI has already provided a suggestion.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <FormField
              control={form.control}
              name="price"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Your Price</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input type="number" placeholder="0.00" className="pl-8" {...field} />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div>
              <Button type="button" variant="outline" onClick={handlePriceSuggestion} disabled={isSuggestingPrice}>
                {isSuggestingPrice ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Sparkles className="mr-2 h-4 w-4" />}
                Reset to AI Suggestion
              </Button>
                <div className="mt-4 p-4 bg-accent/50 rounded-lg flex gap-3">
                  <Info className="size-5 text-primary shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-accent-foreground">
                      Suggested Range: ${scanResult.minPrice.toFixed(2)} - ${scanResult.maxPrice.toFixed(2)}
                    </p>
                    <p className="text-sm text-muted-foreground mt-1">{scanResult.appraisalNote}</p>
                  </div>
                </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><Heart className="size-5" /> Ethical Contribution</CardTitle>
            <CardDescription>Optionally, contribute a portion of your sale to fund industry change.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
             <FormField
                control={form.control}
                name="enableEthicalContribution"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">Enable Contribution</FormLabel>
                      <FormDescription>Donate a percentage of the sale.</FormDescription>
                    </div>
                    <FormControl>
                      <Switch checked={field.value} onCheckedChange={field.onChange} />
                    </FormControl>
                  </FormItem>
                )}
              />
              {form.watch('enableEthicalContribution') && (
                <FormField
                  control={form.control}
                  name="contributionPercentage"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Contribution Percentage</FormLabel>
                       <FormControl>
                        <div className="relative">
                          <Input type="number" placeholder="10" {...field} />
                          <span className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground">%</span>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
          </CardContent>
        </Card>

        <Button type="submit" className="w-full" size="lg" disabled={isSubmitting}>
          {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Create Listing
        </Button>
      </form>
    </FormProvider>
  );
}
