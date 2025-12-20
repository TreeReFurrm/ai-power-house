'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { generatePromptSuggestion } from '@/ai/flows/generate-prompt-suggestion';
import { useToast } from '@/hooks/use-toast';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { Skeleton } from '@/components/ui/skeleton';
import { MarkdownDisplay } from '@/components/markdown-display';
import { Loader2, Clipboard, Wand2, Sparkles } from 'lucide-react';

const formSchema = z.object({
  goal: z.string().min(10, 'Please describe your goal in a bit more detail.'),
});

type FormValues = z.infer<typeof formSchema>;

type GeneratePromptSuggestionInput = {
  goal: string;
};


export default function PromptEnhancerPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [suggestedPrompt, setSuggestedPrompt] = useState<string | null>(null);
  const { toast } = useToast();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      goal: '',
    },
  });

  const onSubmit = async (values: FormValues) => {
    setIsLoading(true);
    setSuggestedPrompt(null);
    try {
      const result = await generatePromptSuggestion(values);
      setSuggestedPrompt(result.suggestedPrompt);
    } catch (error) {
      console.error(error);
      toast({
        title: 'Error',
        description: 'Failed to generate a prompt suggestion. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = () => {
    if (suggestedPrompt) {
      navigator.clipboard.writeText(suggestedPrompt);
      toast({ title: 'Copied!', description: 'Suggested prompt copied to clipboard.' });
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-headline text-3xl font-bold">AI Prompt Enhancer</h1>
        <p className="text-muted-foreground">Turn your simple goal into a detailed, effective prompt for any AI model.</p>
      </div>

      <div className="grid md:grid-cols-2 gap-8 items-start">
        <Card>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <CardHeader>
                <CardTitle>Your Goal</CardTitle>
                <CardDescription>Describe what you want the AI to do in simple terms.</CardDescription>
              </CardHeader>
              <CardContent>
                <FormField
                  control={form.control}
                  name="goal"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="sr-only">Your Goal</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="e.g., 'improve my chapter without changing my voice' or 'explain quantum computing to a 5-year-old'"
                          className="min-h-[150px]"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
              <CardFooter>
                <Button type="submit" disabled={isLoading} className="w-full">
                  {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Sparkles className="mr-2 h-4 w-4" />}
                  Enhance Prompt
                </Button>
              </CardFooter>
            </form>
          </Form>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Suggested Prompt</CardTitle>
              <CardDescription>Copy this optimized prompt to get better AI results.</CardDescription>
            </div>
            {suggestedPrompt && (
              <Button variant="outline" size="icon" onClick={handleCopy}>
                <Clipboard className="h-4 w-4" />
                <span className="sr-only">Copy</span>
              </Button>
            )}
          </CardHeader>
          <CardContent className="min-h-[300px] bg-muted/50 rounded-md">
            {isLoading && (
              <div className="space-y-2 p-6 pt-0">
                <Skeleton className="h-4 w-4/5" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-1/2" />
                <Skeleton className="h-4 w-3/4" />
              </div>
            )}
            {suggestedPrompt && <MarkdownDisplay content={suggestedPrompt} className="p-4" />}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
