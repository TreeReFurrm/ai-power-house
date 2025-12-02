
'use client';

import { useState, useEffect } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '../ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '../ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '../ui/form';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Sparkles, DollarSign, ArrowRight, Pencil, Info, Save } from 'lucide-react';
import { Badge } from '../ui/badge';
import { useUser, useFirestore, addDocumentNonBlocking, useDoc, useMemoFirebase } from '@/firebase';
import { useRouter, useSearchParams } from 'next/navigation';
import { Alert, AlertDescription, AlertTitle } from '../ui/alert';
import { ImageUploader } from './image-uploader';
import { scanItem, type ScanItemOutput } from '@/ai/flows/scan-item';
import { Progress } from '../ui/progress';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Switch } from '../ui/switch';
import { collection, serverTimestamp, doc } from 'firebase/firestore';

const listingSchema = z.object({
  title: z.string().min(5, 'Title must be at least 5 characters.'),
  description: z.string().min(20, 'Description must be at least 20 characters.'),
  price: z.coerce.number().min(0, 'Price must be a valid number.'),
  condition: z.string().optional(),
  tags: z.array(z.string()).optional(),
  publishToRefurrm: z.boolean().default(true),
  image: z.string().optional(), // Holds data URI from uploader or URL params
});

type ListingFormData = z.infer<typeof listingSchema>;

export function InstantListingGenerator() {
  const [currentStep, setCurrentStep] = useState(1);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [aiResult, setAiResult] = useState<ScanItemOutput | null>(null);
  
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();
  const { user } = useUser();
  const firestore = useFirestore();

  const userProfileRef = useMemoFirebase(() => {
    if (!firestore || !user) return null;
    return doc(firestore, 'users', user.uid);
  }, [firestore, user]);
  const { data: userProfile } = useDoc(userProfileRef);

  // For this prototype, we'll consider anyone who isn't an Ambassador a "General User"
  const isGeneralUser = userProfile?.tier !== 'Ambassador';

  const form = useForm<ListingFormData>({
    resolver: zodResolver(listingSchema),
    defaultValues: {
        publishToRefurrm: true,
        tags: [],
    }
  });

  // Pre-fill form from URL params (e.g., from Verification Tool)
  useEffect(() => {
    if (searchParams.has('title')) {
        const prefillData: Partial<ListingFormData> = {};
        prefillData.title = searchParams.get('title') || '';
        prefillData.description = searchParams.get('description') || '';
        prefillData.price = parseFloat(searchParams.get('price') || '0');
        const imgUri = searchParams.get('img');
        if(imgUri) {
            prefillData.image = imgUri;
        }

        form.reset(prefillData);
        if(imgUri) {
             setAiResult({
                suggestedTitle: prefillData.title,
                suggestedDescription: prefillData.description || '',
                maxPrice: prefillData.price,
             } as ScanItemOutput)
        }
        setCurrentStep(2);
    }
  }, [searchParams, form]);


  const handleImageUpload = async (dataUri: string | null) => {
    if (dataUri) {
      form.setValue('image', dataUri);
      setIsGenerating(true);
      try {
        const result = await scanItem({ photoDataUri: dataUri });
        setAiResult(result);
        form.reset({
          title: result.suggestedTitle,
          description: result.suggestedDescription,
          price: result.maxPrice,
          tags: result.categoryTag ? [result.categoryTag.replace(/_/g, ' ')] : [],
          condition: 'Good', // Default condition
          publishToRefurrm: true,
          image: dataUri,
        });
        setCurrentStep(2);
      } catch (error) {
        console.error("AI generation failed:", error);
        toast({
          variant: "destructive",
          title: "AI Generation Failed",
          description: "Could not analyze the photo. Please try another one."
        });
      } finally {
        setIsGenerating(false);
      }
    } else {
        form.setValue('image', undefined);
    }
  };

  const handleKeepForMyself = async () => {
    if (!user || !firestore || !aiResult) {
      toast({ title: 'An error occurred. Please log in and try again.', variant: 'destructive' });
      return;
    }

    setIsSubmitting(true);
    const data = form.getValues();

    try {
        const appraisalRef = collection(firestore, 'users', user.uid, 'private_appraisals');
        const privateAppraisal = {
            userId: user.uid,
            itemName: data.title,
            aiSuggestedTitle: aiResult.suggestedTitle,
            aiSuggestedDescription: aiResult.suggestedDescription,
            minPrice: aiResult.minPrice,
            maxPrice: aiResult.maxPrice,
            appraisalNote: aiResult.appraisalNote,
            categoryTag: aiResult.categoryTag,
            authenticityVerdict: aiResult.authenticityVerdict,
            imageUrl: data.image, // In a real app, upload this to storage first
            createdAt: serverTimestamp(),
        };
        await addDocumentNonBlocking(appraisalRef, privateAppraisal);
        toast({
            title: "Appraisal Saved!",
            description: "Your private appraisal has been saved to your account.",
        });
        // Redirect to a new "Appraisal Saved" confirmation page or account page
        router.push('/account'); 
    } catch (error) {
         console.error("Saving appraisal failed:", error);
        toast({ title: 'Save Failed', description: 'Could not save your private appraisal. Please try again.', variant: 'destructive' });
    } finally {
        setIsSubmitting(false);
    }
  };


  const onSubmit = async (data: ListingFormData) => {
    if (!user || !firestore) {
      toast({ title: 'Please log in to publish a listing.', variant: 'destructive' });
      return;
    }
    
    if (!data.image) {
      toast({ title: 'An image is required to publish a listing.', variant: 'destructive' });
      return;
    }

    setIsSubmitting(true);
    
    try {
        const itemsCollection = collection(firestore, 'items');
        const newItem = {
            title: data.title,
            description: data.description,
            price: data.price,
            tags: data.tags || [],
            imageUrl: data.image, // In a real app, this would be a URL after uploading to storage
            imageHint: data.tags?.[0] || 'item',
            userId: user.uid,
            status: 'listed',
            createdAt: serverTimestamp(),
            condition: data.condition,
        };
        await addDocumentNonBlocking(itemsCollection, newItem);

        toast({
        title: "Listing Published!",
        description: `${data.title} is now live on the Marketplace.`,
        });
        router.push('/marketplace');

    } catch (error) {
        console.error("Publishing failed:", error);
        toast({ title: 'Publishing Failed', description: 'Could not save your listing. Please try again.', variant: 'destructive' });
        setIsSubmitting(false);
    }
  };
  
  const progress = (currentStep / 3) * 100;

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <Card>
            <CardHeader>
              <CardTitle>Step 1: Upload or Snap Photo</CardTitle>
              <CardDescription>Best results: single item, clear background, good lighting.</CardDescription>
            </CardHeader>
            <CardContent>
              <ImageUploader onImageUpload={handleImageUpload} disabled={isGenerating} />
              <p className="text-xs text-muted-foreground text-center mt-4">
                Image privacy: We only use your photo to create this listing.
              </p>
            </CardContent>
          </Card>
        );
      case 2:
        return (
          <Card>
            <CardHeader>
              <CardTitle>Step 2: AI Generates Listing</CardTitle>
              <CardDescription>Review and edit the AI suggestions before publishing. You can edit any field.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel className="flex items-center">Listing Title <Pencil className="ml-2 h-3 w-3" /></FormLabel>
                        <FormControl><Input {...field} /></FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                />

                <div className="grid md:grid-cols-2 gap-6">
                    <FormField
                        control={form.control}
                        name="price"
                        render={({ field }) => (
                            <FormItem>
                            <FormLabel className="flex items-center">Price <Pencil className="ml-2 h-3 w-3" /></FormLabel>
                            <FormControl>
                                <div className="relative">
                                    <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                    <Input type="number" step="0.01" className="pl-8" {...field} />
                                </div>
                            </FormControl>
                             <FormDescription className="text-xs">
                                {aiResult?.minPrice && `Suggested fair price: $${aiResult.minPrice.toFixed(2)} - $${aiResult.maxPrice.toFixed(2)}`}
                            </FormDescription>
                            <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="condition"
                        render={({ field }) => (
                             <FormItem>
                                <FormLabel>Condition</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                    <SelectTrigger><SelectValue placeholder="Select condition" /></SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                    <SelectItem value="New">New</SelectItem>
                                    <SelectItem value="Like new">Like new</SelectItem>
                                    <SelectItem value="Good">Good</SelectItem>
                                    <SelectItem value="Fair">Fair</SelectItem>
                                </SelectContent>
                                </Select>
                            </FormItem>
                        )}
                    />
                </div>
                 <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel className="flex items-center">Description <Pencil className="ml-2 h-3 w-3" /></FormLabel>
                        <FormControl><Textarea rows={4} {...field} /></FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                />
                 <FormField
                    control={form.control}
                    name="tags"
                    render={({ field }) => (
                    <FormItem>
                        <FormLabel>Suggested Tags</FormLabel>
                        <div className="flex flex-wrap gap-2 p-3 border rounded-md min-h-[40px] bg-muted/50">
                            {field.value?.map((tag: string) => (
                                <Badge key={tag} variant="secondary">{tag}</Badge>
                            ))}
                        </div>
                    </FormItem>
                    )}
                />
                
                {aiResult && (
                    <Alert>
                        <Info className="h-4 w-4"/>
                        <AlertTitle>AI Confidence: {aiResult?.authenticityVerdict === 'AUTHENTIC' ? '92%' : '82%'}</AlertTitle>
                        <AlertDescription>
                            {aiResult?.appraisalNote}
                            <Button variant="link" size="sm" className="p-0 h-auto ml-1">Explain price</Button>
                        </AlertDescription>
                    </Alert>
                )}


            </CardContent>
            <CardFooter>
                 <Button onClick={() => setCurrentStep(3)} className="w-full">
                    Continue to Disposition <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
            </CardFooter>
          </Card>
        );
      case 3:
        return (
          <Card>
            <CardHeader>
              <CardTitle>Step 3: Choose Action</CardTitle>
              <CardDescription>What would you like to do with this item?</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                 {isGeneralUser && (
                    <Button onClick={handleKeepForMyself} disabled={isSubmitting} variant="outline" className="w-full h-auto py-4 flex-col items-start text-left">
                        <div className="flex items-center font-bold text-base"><Save className="mr-2"/> Keep for Myself</div>
                        <p className="font-normal text-sm text-muted-foreground pl-7">Save this appraisal to your private log. No listing will be created.</p>
                    </Button>
                 )}

                <FormField
                    control={form.control}
                    name="publishToRefurrm"
                    render={({ field }) => (
                        <div className="rounded-lg border p-4 hover:bg-accent has-[[data-state=checked]]:bg-secondary/50">
                            <FormItem className="flex flex-row items-center justify-between">
                                <div className="space-y-0.5">
                                    <FormLabel className="text-base font-bold flex items-center">
                                        <Sparkles className="mr-2" /> Consignment Sale (Make Money)
                                    </FormLabel>
                                    <FormDescription>Publish to Marketplace. You handle fulfillment.</FormDescription>
                                </div>
                                <FormControl>
                                    <Switch checked={field.value} onCheckedChange={field.onChange} />
                                </FormControl>
                            </FormItem>
                        </div>
                    )}
                />
            </CardContent>
            <CardFooter className="flex flex-col gap-4">
                <Button onClick={form.handleSubmit(onSubmit)} disabled={isSubmitting || !form.getValues('publishToRefurrm')} className="w-full">
                     {isSubmitting ? <Loader2 className="animate-spin mr-2"/> : <ArrowRight className="mr-2" />}
                    Proceed to Listing
                </Button>
                <Button variant="outline" onClick={() => setCurrentStep(2)} className="w-full">Go Back</Button>
            </CardFooter>
          </Card>
        );
      default:
        return null;
    }
  };
  
  return (
    <div className="container mx-auto max-w-2xl py-8">
      <header className="text-center mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Instant Listing Generator</h1>
        <p className="text-lg text-muted-foreground">
          Upload a photo — get an SEO title, description, and a fair price in seconds.
        </p>
      </header>
      <div className="mb-8 px-4">
        <Progress value={progress} className="w-full"/>
      </div>
      <FormProvider {...form}>
        <form onSubmit={(e) => e.preventDefault()} className="space-y-8">
            {renderStep()}
        </form>
      </FormProvider>
    </div>
  );
}
