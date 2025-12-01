
'use client';

import { useState } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { ImageUploader } from './image-uploader';
import { Button } from '../ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '../ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '../ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Input } from '../ui/input';
import { verifyItemValue, type VerifyItemValueOutput } from '@/ai/flows/verify-item-value';
import { Loader2, Sparkles, DollarSign, TrendingUp, AlertCircle, BadgeCheck, ShoppingCart } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Separator } from '../ui/separator';

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
  askingPrice: z.coerce.number().optional(),
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
      source: "Yard Sale/Flea Market (Buying)",
      askingPrice: undefined,
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

  const getVerdictIcon = (verdict: string) => {
    if (verdict.includes("BUY NOW")) return <BadgeCheck className="text-green-500" />;
    if (verdict.includes("Good Deal")) return <TrendingUp className="text-blue-500" />;
    if (verdict.includes("Break-even")) return <AlertCircle className="text-yellow-500" />;
    return <AlertCircle className="text-destructive" />;
  }

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
                        </Trigger>
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

              <FormField
                control={form.control}
                name="askingPrice"
                render={({ field }) => (
                  <FormItem className="w-full max-w-md">
                    <FormLabel>Asking Price (Optional)</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input type="number" step="0.01" placeholder="Enter price to check profit" className="pl-8" {...field} disabled={isLoading} />
                      </div>
                    </FormControl>
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
                <p className="text-sm text-muted-foreground">{result.justification}</p>
              </CardContent>
            </Card>

            {result.profitAnalysis && (
                 <Card className="w-full">
                    <CardHeader className="text-center">
                        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                            {getVerdictIcon(result.profitAnalysis.verdict)}
                        </div>
                        <CardTitle className="text-2xl">{result.profitAnalysis.verdict}</CardTitle>
                    </CardHeader>
                    <CardContent className="grid grid-cols-2 gap-4 text-sm">
                        <div className="text-left"><ShoppingCart className="inline-block mr-2" />Asking Price</div>
                        <div className="text-right font-medium">${result.profitAnalysis.potentialGrossProfit > 0 ? form.getValues('askingPrice')?.toFixed(2) : result.profitAnalysis.askingPrice?.toFixed(2) }</div>
                        
                        <div className="text-left"><DollarSign className="inline-block mr-2" />Potential Profit</div>
                        <div className="text-right font-medium text-green-600">${result.profitAnalysis.potentialGrossProfit.toFixed(2)}</div>

                        <div className="text-left"><TrendingUp className="inline-block mr-2" />Potential ROI</div>
                        <div className="text-right font-medium text-green-600">{result.profitAnalysis.potentialRoiPercent.toFixed(1)}%</div>

                    </CardContent>
                 </Card>
            )}

            <Button onClick={handleReset} variant="outline" className="w-full max-w-xs">
              Verify Another Item
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
