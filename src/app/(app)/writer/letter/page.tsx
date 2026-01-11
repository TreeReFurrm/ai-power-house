'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { writePersonalizedLetter } from '@/ai/flows/write-personalized-letter';
import { useToast } from '@/hooks/use-toast';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { MarkdownDisplay } from '@/components/markdown-display';
import { Loader2, Clipboard } from 'lucide-react';

const formSchema = z.object({
  recipientName: z.string().min(1, 'Recipient name is required.'),
  purpose: z.string().min(3, 'Purpose is required.'),
  tone: z.string(),
  style: z.enum(['casual', 'warm', 'professional', 'heartfelt']),
  length: z.enum(['short', 'medium', 'long']),
  senderName: z.string().optional(),
  relationship: z.string().optional(),
  letterBody: z.string().min(10, 'Please provide some content for the letter body.'),
});

type FormValues = z.infer<typeof formSchema>;

// Types moved from the flow file
type WritePersonalizedLetterInput = {
    tone: string;
    purpose: string;
    recipientName: string;
    senderName?: string;
    relationship?: string;
    style?: 'casual' | 'warm' | 'professional' | 'heartfelt';
    length?: 'short' | 'medium' | 'long';
    letterBody: string;
};
type WritePersonalizedLetterOutput = {
    personalizedLetter: string;
};


export default function LetterWriterPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [generatedLetter, setGeneratedLetter] = useState<string | null>(null);
  const { toast } = useToast();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      recipientName: '',
      purpose: '',
      tone: 'formal',
      style: 'warm',
      length: 'medium',
      senderName: '',
      relationship: '',
      letterBody: '',
    },
  });

  const onSubmit = async (values: WritePersonalizedLetterInput) => {
    setIsLoading(true);
    setGeneratedLetter(null);
    const normalizeOptional = (value?: string) => value?.trim() || undefined;
    try {
      const result = await writePersonalizedLetter({
        ...values,
        senderName: normalizeOptional(values.senderName),
        relationship: normalizeOptional(values.relationship),
      });
      setGeneratedLetter(result.personalizedLetter);
    } catch (error) {
      console.error(error);
      toast({
        title: 'Error',
        description: 'Failed to generate the letter. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = () => {
    if (generatedLetter) {
      navigator.clipboard.writeText(generatedLetter);
      toast({ title: 'Copied!', description: 'Letter copied to clipboard.' });
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-headline text-3xl font-bold">Human-Like Letter Writer</h1>
        <p className="text-muted-foreground">Craft the perfect letter for any occasion without sounding like a robot.</p>
      </div>
      <div className="grid md:grid-cols-2 gap-8 items-start">
        <Card>
          <CardHeader>
            <CardTitle>Letter Details</CardTitle>
          </CardHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <CardContent className="space-y-4">
                <div className="grid sm:grid-cols-2 gap-4">
                  <FormField control={form.control} name="recipientName" render={({ field }) => (
                    <FormItem><FormLabel>Recipient's Name</FormLabel><FormControl><Input placeholder="Jane Doe" {...field} /></FormControl><FormMessage /></FormItem>
                  )} />
                  <FormField control={form.control} name="purpose" render={({ field }) => (
                    <FormItem><FormLabel>Purpose of Letter</FormLabel><FormControl><Input placeholder="Thank you" {...field} /></FormControl><FormMessage /></FormItem>
                  )} />
                </div>
                <div className="grid sm:grid-cols-2 gap-4">
                  <FormField control={form.control} name="senderName" render={({ field }) => (
                    <FormItem><FormLabel>Your Name (optional)</FormLabel><FormControl><Input placeholder="Alex Smith" {...field} /></FormControl><FormMessage /></FormItem>
                  )} />
                  <FormField control={form.control} name="relationship" render={({ field }) => (
                    <FormItem><FormLabel>Relationship (optional)</FormLabel><FormControl><Input placeholder="Friend, coworker, aunt..." {...field} /></FormControl><FormMessage /></FormItem>
                  )} />
                </div>
                <div className="grid sm:grid-cols-3 gap-4">
                  <FormField control={form.control} name="tone" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tone</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl><SelectTrigger><SelectValue placeholder="Select a tone" /></SelectTrigger></FormControl>
                        <SelectContent>
                          <SelectItem value="formal">Formal</SelectItem>
                          <SelectItem value="informal">Informal</SelectItem>
                          <SelectItem value="friendly">Friendly</SelectItem>
                          <SelectItem value="persuasive">Persuasive</SelectItem>
                          <SelectItem value="sympathetic">Sympathetic</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )} />
                  <FormField control={form.control} name="style" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Style</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl><SelectTrigger><SelectValue placeholder="Select a style" /></SelectTrigger></FormControl>
                        <SelectContent>
                          <SelectItem value="casual">Casual</SelectItem>
                          <SelectItem value="warm">Warm</SelectItem>
                          <SelectItem value="professional">Professional</SelectItem>
                          <SelectItem value="heartfelt">Heartfelt</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )} />
                  <FormField control={form.control} name="length" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Length</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl><SelectTrigger><SelectValue placeholder="Select length" /></SelectTrigger></FormControl>
                        <SelectContent>
                          <SelectItem value="short">Short</SelectItem>
                          <SelectItem value="medium">Medium</SelectItem>
                          <SelectItem value="long">Long</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )} />
                </div>
                <FormField control={form.control} name="letterBody" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Key Points / Notes</FormLabel>
                    <FormControl>
                      <Textarea placeholder="e.g., Thank you for the graduation gift. It meant a lot, and I'll use it as I figure out what's next..." className="min-h-[150px]" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
              </CardContent>
              <CardFooter>
                <Button type="submit" disabled={isLoading} className="w-full">
                  {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Write Letter
                </Button>
              </CardFooter>
            </form>
          </Form>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Generated Letter</CardTitle>
              <CardDescription>Your personalized letter will appear here.</CardDescription>
            </div>
            {generatedLetter && (
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
            {generatedLetter && <MarkdownDisplay content={generatedLetter} />}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
