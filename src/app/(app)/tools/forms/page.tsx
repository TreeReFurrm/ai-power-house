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
import { Textarea } from '@/components/ui/textarea';
import { Skeleton } from '@/components/ui/skeleton';
import { MarkdownDisplay } from '@/components/markdown-display';
import { Loader2, Clipboard, FilePlus, Sparkles } from 'lucide-react';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { cn } from '@/lib/utils';


const formSchema = z.object({
  formDescription: z.string().min(10, 'Please provide a more detailed description of the form.'),
  formStyle: z.enum(['fill-in', 'completed']),
  businessInformation: z.string().optional(),
  recipientInformation: z.string().optional(),
}).refine(
  (data) => {
    if (data.formStyle === 'completed') {
      return !!data.businessInformation && !!data.recipientInformation;
    }
    return true;
  },
  {
    message: 'Business and recipient information are required for a completed document.',
    path: ['businessInformation'], // You can choose which field to show the error on
  }
);


type FormValues = z.infer<typeof formSchema>;

type GenerateBusinessFormInput = {
  formDescription: string;
  formStyle: 'fill-in' | 'completed';
  businessInformation?: string;
  recipientInformation?: string;
};


const formTemplates = [
  {
    name: 'Invoice',
    description: 'A standard invoice for services rendered. It should include fields for company info, client info, item description, quantity, rate, subtotal, tax, and total amount due.',
  },
  {
    name: 'Rental Application',
    description: 'A standard residential lease application for a property in [Your State]. It should include sections for applicant personal information, employment history, rental history, references, and an authorization for a background check.',
  },
  {
    name: 'Job Application',
    description: 'A generic job application form. It should include fields for personal details, position applied for, education history, employment history, skills, and references.',
  },
  {
    name: 'Proposal',
    description: 'A business proposal for a project. It should include sections for project overview, scope of work, deliverables, timeline, pricing, and terms and conditions.',
  },
   {
    name: 'Service Agreement',
    description: 'A basic service agreement contract. It needs to define the relationship between the service provider and the client, scope of services, payment terms, and termination conditions.',
  },
];


export default function FormCreatorPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [generatedForm, setGeneratedForm] = useState<string | null>(null);
  const { toast } = useToast();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      formDescription: '',
      formStyle: 'fill-in',
      businessInformation: '',
      recipientInformation: '',
    },
  });
  
  const formStyle = form.watch('formStyle');

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
  
  const setTemplate = (description: string) => {
    form.setValue('formDescription', description, { shouldValidate: true });
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-headline text-3xl font-bold">Business Form Creator</h1>
        <p className="text-muted-foreground">Describe the form you need, or start with a template, and let the AI build it for you.</p>
      </div>

      <div className="grid md:grid-cols-2 gap-8 items-start">
        <Card>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <CardHeader>
                <CardTitle>Form Details</CardTitle>
                <CardDescription>Describe the form and choose whether you want a template or a completed document.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                
                <div>
                  <FormLabel>1. Start with a template (optional)</FormLabel>
                  <div className="flex flex-wrap gap-2 pt-2">
                    {formTemplates.map((template) => (
                      <Button
                        key={template.name}
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => setTemplate(template.description)}
                        className="text-xs"
                      >
                         <FilePlus className="mr-2 h-3 w-3" />
                        {template.name}
                      </Button>
                    ))}
                  </div>
                </div>

                <FormField
                  control={form.control}
                  name="formDescription"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>2. Form Description</FormLabel>
                      <FormControl>
                        <Textarea placeholder="e.g., A simple invoice with fields for item, quantity, price, and total. Include a space for a logo..." className="min-h-[120px]" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                    control={form.control}
                    name="formStyle"
                    render={({ field }) => (
                        <FormItem className="space-y-3">
                        <FormLabel>3. Document Style</FormLabel>
                        <FormControl>
                            <RadioGroup
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                            className="flex flex-col space-y-1"
                            >
                            <FormItem className="flex items-center space-x-3 space-y-0">
                                <FormControl>
                                <RadioGroupItem value="fill-in" />
                                </FormControl>
                                <FormLabel className="font-normal">
                                Generate a fill-in document
                                </FormLabel>
                            </FormItem>
                            <FormItem className="flex items-center space-x-3 space-y-0">
                                <FormControl>
                                <RadioGroupItem value="completed" />
                                </FormControl>
                                <FormLabel className="font-normal">
                                Generate a completed document
                                </FormLabel>
                            </FormItem>
                            </RadioGroup>
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                />

                <div className={cn('space-y-4 transition-opacity', formStyle === 'fill-in' && 'opacity-50 pointer-events-none')}>
                    <FormField
                    control={form.control}
                    name="businessInformation"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>4. Your Business Information</FormLabel>
                        <FormControl>
                            <Textarea disabled={formStyle === 'fill-in'} placeholder="e.g., My Company LLC, 123 Main St, Anytown, USA" {...field} />
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
                        <FormLabel>5. Recipient's Information</FormLabel>
                        <FormControl>
                            <Textarea disabled={formStyle === 'fill-in'} placeholder="e.g., John Doe, 456 Oak Ave, Otherville, USA" {...field} />
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                    />
                </div>
              </CardContent>
              <CardFooter>
                <Button type="submit" disabled={isLoading} className="w-full">
                  {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Sparkles className="mr-2 h-4 w-4" />}
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
              <div className="space-y-2 p-6 pt-0">
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
