'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { generateBusinessIdea } from '@/ai/flows/generate-business-idea';
import { useToast } from '@/hooks/use-toast';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { Skeleton } from '@/components/ui/skeleton';
import { MarkdownDisplay } from '@/components/markdown-display';
import { Loader2, Lightbulb, Check } from 'lucide-react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

const formSchema = z.object({
  interests: z.string().min(10, 'Please describe your interests in a bit more detail.'),
});

type FormValues = z.infer<typeof formSchema>;

type GenerateBusinessIdeaInput = {
  interests: string;
};

type GenerateBusinessIdeaOutput = {
  ideas: {
    title: string;
    description: string;
    firstSteps: string[];
  }[];
};

export default function BusinessIdeaGeneratorPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [generatedIdeas, setGeneratedIdeas] = useState<GenerateBusinessIdeaOutput | null>(null);
  const { toast } = useToast();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      interests: '',
    },
  });

  const onSubmit = async (values: FormValues) => {
    setIsLoading(true);
    setGeneratedIdeas(null);
    try {
      const result = await generateBusinessIdea(values);
      setGeneratedIdeas(result);
    } catch (error) {
      console.error(error);
      toast({
        title: 'Error',
        description: 'Failed to generate business ideas. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-headline text-3xl font-bold">Start-up Idea Mentor</h1>
        <p className="text-muted-foreground">Generate innovative startup ideas tailored to your skills and capabilities.</p>
      </div>

      <Card>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <CardHeader>
              <CardTitle>Your Interests & Skills</CardTitle>
            </CardHeader>
            <CardContent>
              <FormField
                control={form.control}
                name="interests"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="sr-only">Your Interests</FormLabel>
                    <FormControl>
                      <Textarea placeholder="e.g., 'I love animals, especially dogs. I enjoy being outdoors and am good at training. I also have some experience with social media marketing...'" className="min-h-[150px]" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
            <CardFooter>
              <Button type="submit" disabled={isLoading}>
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Generate Ideas
              </Button>
            </CardFooter>
          </form>
        </Form>
      </Card>
      
      {(isLoading || generatedIdeas) && (
        <Card>
          <CardHeader>
            <CardTitle className='flex items-center gap-2'><Lightbulb /> Generated Ideas</CardTitle>
            <CardDescription>Here are a few business ideas based on your interests.</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading && (
              <div className="space-y-4">
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
              </div>
            )}
            {generatedIdeas && (
              <Accordion type="single" collapsible className="w-full">
                {generatedIdeas.ideas.map((idea, index) => (
                  <AccordionItem value={`item-${index}`} key={index}>
                    <AccordionTrigger className='text-lg'>{idea.title}</AccordionTrigger>

                    <AccordionContent className="space-y-4 pt-2">
                        <p className="text-muted-foreground">{idea.description}</p>
                        <div>
                            <h4 className="font-semibold mb-2">First Steps:</h4>
                            <ul className="space-y-2">
                                {idea.firstSteps.map((step, stepIndex) => (
                                    <li key={stepIndex} className="flex items-start gap-2">
                                        <Check className="h-5 w-5 text-primary mt-0.5 shrink-0" />
                                        <span>{step}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
