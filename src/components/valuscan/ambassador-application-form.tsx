
'use client';

import { useState } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '../ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '../ui/form';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Send } from 'lucide-react';
import { useUser, useFirestore, addDocumentNonBlocking } from '@/firebase';
import { collection, serverTimestamp } from 'firebase/firestore';
import { useRouter } from 'next/navigation';

const applicationSchema = z.object({
  whyReFurrm: z.string().min(50, 'Please provide a more detailed answer (at least 50 characters).'),
  operationalExperience: z.string({ required_error: 'Please select your experience level.' }),
  zipCode: z.string().min(5, 'Please enter a valid 5-digit ZIP code.').max(5),
  transportation: z.string({ required_error: 'Please select your transportation type.' }),
  weeklyHours: z.string().min(1, 'Please enter your available hours.'),
  videoIntroUrl: z.string().url('Please enter a valid URL.').optional().or(z.literal('')),
});

type ApplicationFormData = z.infer<typeof applicationSchema>;

export function AmbassadorApplicationForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const { user } = useUser();
  const firestore = useFirestore();
  const router = useRouter();

  const form = useForm<ApplicationFormData>({
    resolver: zodResolver(applicationSchema),
  });

  const onSubmit = async (data: ApplicationFormData) => {
    if (!user || !firestore) {
      toast({
        variant: 'destructive',
        title: 'Authentication Error',
        description: 'You must be logged in to submit an application.',
      });
      return;
    }
    
    setIsSubmitting(true);

    try {
      const applicationData = {
        ...data,
        userId: user.uid,
        status: 'pending_ai_review',
        createdAt: serverTimestamp(),
      };
      
      const applicationsCollection = collection(firestore, 'ambassador_applications');
      await addDocumentNonBlocking(applicationsCollection, applicationData);

      toast({
        title: 'Application Submitted!',
        description: "Thank you for your interest. We'll review your application and be in touch.",
      });
      
      router.push('/ambassadors/apply/submitted');

    } catch (error) {
      console.error('Application submission failed:', error);
      toast({
        variant: 'destructive',
        title: 'Submission Failed',
        description: 'There was an error submitting your application. Please try again.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card>
      <CardContent className="p-6">
        <FormProvider {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            
            <FormField
              control={form.control}
              name="whyReFurrm"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-base">Why ReFurrm?</FormLabel>
                  <FormControl>
                    <Textarea 
                        placeholder="Describe your passion for our mission, sustainability, or ethical business..." 
                        rows={5} 
                        {...field} 
                        disabled={isSubmitting}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="operationalExperience"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-base">Operational Experience</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value} disabled={isSubmitting}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Have you managed a project or business before?" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="side-hustle">Yes, a side-hustle or small project</SelectItem>
                      <SelectItem value="small-business">Yes, a small business</SelectItem>
                      <SelectItem value="management-role">Yes, in a management role</SelectItem>
                      <SelectItem value="none">No, but I'm a fast learner</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid md:grid-cols-2 gap-8">
                <FormField
                control={form.control}
                name="zipCode"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel className="text-base">Primary Service ZIP Code</FormLabel>
                    <FormControl>
                        <Input placeholder="e.g., 90210" {...field} disabled={isSubmitting} />
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
                />
                 <FormField
                control={form.control}
                name="weeklyHours"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel className="text-base">Weekly Hours Available</FormLabel>
                    <FormControl>
                        <Input placeholder="e.g., 10-15" {...field} disabled={isSubmitting} />
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
                />
            </div>
            
             <FormField
              control={form.control}
              name="transportation"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-base">Reliable Transportation</FormLabel>
                   <Select onValueChange={field.onChange} defaultValue={field.value} disabled={isSubmitting}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Do you have reliable transport for items?" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="suv-truck">Yes, an SUV, truck, or van</SelectItem>
                      <SelectItem value="car">Yes, a car</SelectItem>
                      <SelectItem value="none">No</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="videoIntroUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-base">Video Introduction (Optional)</FormLabel>
                   <FormControl>
                    <Input placeholder="Paste a link to a 60-second video (Loom, YouTube, etc.)" {...field} disabled={isSubmitting} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" disabled={isSubmitting} className="w-full" size="lg">
              {isSubmitting ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Send className="mr-2 h-4 w-4" />
              )}
              Submit Application
            </Button>
          </form>
        </FormProvider>
      </CardContent>
    </Card>
  );
}
