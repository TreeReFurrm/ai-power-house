'use client';

import { useState } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { ImageUploader } from './image-uploader';
import { Button } from '../ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '../ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { verifyItemValue, type VerifyItemValueOutput } from '@/ai/flows/verify-item-value';
import { Loader2, Sparkles } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const conditions = [
    "New (Sealed)",
    "Excellent (Like New)",
    "Good (Used, Working)",
    "Fair (Scratches/Minor Issue)",
] as const;

const sources = [
    "Personal Garage/Storage",
    "Yard Sale/Flea Market (Buying)",
    "Retail Store (Walmart/Target)",
    "Online Marketplace (eBay/Poshmark)",
] as const;

const verificationSchema = z.object({
  photoDataUri: z.string().min(1, 'Please upload a photo.'),
  condition: z.enum(conditions),
  source: z.enum(sources),
});

type VerificationFormData = z.infer<typeof verificationSchema>;

export function VerificationTool() {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<VerifyItemValueOutput | null>(null);
  const { toast } = useToast();

  const form = useForm<VerificationFormData>({
    resolver: zodResolver(verificationSchema),
    defaultValues: {
      photoDataUri: '',
      condition: "Good (Used, Working)",
      source: "Personal Garage/Storage",
    },
  });

  const onSubmit = async (data: VerificationFormData) => {
    setIsLoading(true);
    setResult(null);
    try {
      const output = await verifyItemValue(data);
      setResult(output);
    } catch (error) {
      console.error(error);
      toast({
        variant: "destructive",
        title: "Verification Failed",
        description: "The AI could not determine the value. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setResult(null);
    setIsLoading(false);
    form.reset();
  };
  
  const photoDataUri = form.watch('photoDataUri');

  return (
    <Card>
      <CardContent className="p-6">
        {!result ? (
          <FormProvider {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col items-center gap-6">
              <FormField
                control={form.control}
                name="photoDataUri"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormControl>
                      <ImageUploader
                        onImageUpload={(uri) => field.onChange(uri || '')}
                        disabled={isLoading}
                      />
                    </FormControl>
                    <FormMessage className="text-center" />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="condition"
                render={({ field }) => (
                  <FormItem className="w-full max-w-md">
                    <FormLabel>Item Condition</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value} disabled={isLoading}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select the item's condition" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {conditions.map((c) => (
                            <SelectItem key={c} value={c}>{c}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="source"
                render={({ field }) => (
                  <FormItem className="w-full max-w-md">
                    <FormLabel>Valuation Context</FormLabel>
                     <Select onValueChange={field.onChange} defaultValue={field.value} disabled={isLoading}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select the valuation source/context" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                         {sources.map((s) => (
                            <SelectItem key={s} value={s}>{s}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit" disabled={isLoading || !photoDataUri} className="w-full max-w-xs">
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Verifying...
                  </>
                ) : (
                  <>
                    <Sparkles className="mr-2 h-4 w-4" />
                    Verify Value
                  </>
                )}
              </Button>
            </form>
          </FormProvider>
        ) : (
          <div className="flex flex-col items-center gap-6 text-center">
            <Card className="w-full bg-secondary">
              <CardHeader>
                <CardDescription>Realistic Resale Value Range</CardDescription>
                <CardTitle className="text-4xl font-bold text-primary">
                  ${result.minResaleValue.toFixed(2)} - ${result.maxResaleValue.toFixed(2)}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">{result.justification}</p>
              </CardContent>
            </Card>
            <Button onClick={handleReset} variant="outline" className="w-full max-w-xs">
              Verify Another Item
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
