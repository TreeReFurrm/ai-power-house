'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { generateBusinessForm } from '@/ai/flows/generate-business-form';
import { useToast } from '@/hooks/use-toast';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Skeleton } from '@/components/ui/skeleton';
import { MarkdownDisplay } from '@/components/markdown-display';
import { Loader2, Clipboard } from 'lucide-react';

const formSchema = z.object({
  formDescription: z.string().min(10, 'Please provide a more detailed description of the form.'),
  businessInformation: z.string().optional(),
  recipientInformation: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

export default function FormCreatorPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [generatedForm, setGeneratedForm] = useState<string | null>(null);
  const { toast } = useToast();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      formDescription: '',
      businessInformation: '',
      recipientInformation: '',
    },
  });

  const onSubmit = async (values: FormValues) => {
    setIsLoading(true);
    setGeneratedForm(null);
    try {
      const result = await generateBusinessForm(values);
      setGeneratedForm(result.formContent);
    } catch (error) {
      console.error(error);
      toast({
        title: 'Error',
        description: 'Failed to generate the business form. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleCopy = () => {
    if (generatedForm) {
      navigator.clipboard.writeText(generatedForm);
      toast({ title: 'Copied!', description: 'Form content copied to clipboard.' });
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-headline text-3xl font-bold">Business Form Creator</h1>
        <p className="text-muted-foreground">Describe the form you need, and let the AI build it for you.</p>
      </div>

      <div className="grid md:grid-cols-2 gap-8 items-start">
        <Card>
          <CardHeader>
            <CardTitle>Form Details</CardTitle>
            <CardDescription>Provide a detailed description of the form, and optionally, your business info to pre-fill.</CardDescription>
          </CardHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <CardContent className="space-y-4">
                <FormField
                  control={form.control}
                  name="formDescription"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Form Description</FormLabel>
                      <FormControl>
                        <Textarea placeholder="e.g., A simple invoice with fields for item, quantity, price, and total. Include a space for a logo..." className="min-h-[150px]" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="businessInformation"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Business Information (Optional)</FormLabel>
                      <FormControl>
                        <Textarea placeholder="e.g., My Company LLC, 123 Main St, Anytown, USA" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="recipientInformation"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Who the form is going to (Optional)</FormLabel>
                      <FormControl>
                        <Textarea placeholder="e.g., John Doe, 456 Oak Ave, Otherville, USA" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
              <CardFooter>
                <Button type="submit" disabled={isLoading} className="w-full">
                  {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Generate Form
                </Button>
              </CardFooter>
            </form>
          </Form>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Generated Form</CardTitle>
              <CardDescription>Your custom form will appear here.</CardDescription>
            </div>
            {generatedForm && (
                <Button variant="outline" size="icon" onClick={handleCopy}>
                    <Clipboard className="h-4 w-4" />
                    <span className="sr-only">Copy</span>
                </Button>
            )}
          </CardHeader>
          <CardContent className="min-h-[300px]">
            {isLoading && (
              <div className="space-y-2">
                <Skeleton className="h-4 w-4/5" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-1/2" />
                <Skeleton className="h-4 w-3/4" />
              </div>
            )}
            {generatedForm && <MarkdownDisplay content={generatedForm} />}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
