
'use client';

import { useState } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '../ui/button';
import { Card, CardContent } from '../ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '../ui/form';
import { Input } from '../ui/input';
import { useToast } from '@/hooks/use-toast';
import { Loader2, PlayCircle } from 'lucide-react';
import { useUser, useFirestore, addDocumentNonBlocking } from '@/firebase';
import { collection, serverTimestamp } from 'firebase/firestore';
import { useRouter } from 'next/navigation';

const jobSchema = z.object({
  facilityRef: z.string().min(3, 'Please enter a valid facility reference (e.g., Unit #, Address).'),
});

type JobFormData = z.infer<typeof jobSchema>;

export function AgentJobForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const { user } = useUser();
  const firestore = useFirestore();
  const router = useRouter();

  const form = useForm<JobFormData>({
    resolver: zodResolver(jobSchema),
  });

  const onSubmit = async (data: JobFormData) => {
    if (!user || !firestore) {
      toast({
        variant: 'destructive',
        title: 'Authentication Error',
        description: 'You must be logged in as an Agent to start a job.',
      });
      return;
    }
    
    setIsSubmitting(true);

    try {
      const custodyUnitData = {
        facilityRef: data.facilityRef,
        agentId: user.uid,
        startTime: serverTimestamp(),
        status: 'In Progress',
      };
      
      const unitsCollection = collection(firestore, 'custody_units');
      const docRef = await addDocumentNonBlocking(unitsCollection, custodyUnitData);

      toast({
        title: 'Job Started!',
        description: `Custody Unit ${docRef?.id} has been created.`,
      });
      
      // In the next step, we will redirect to the mass scanning page
      // For now, we'll just log it.
      console.log(`Redirecting to mass scan for unit: ${docRef?.id}`);
      // router.push(`/agent-hub/scan/${docRef.id}`);

    } catch (error) {
      console.error('Failed to start job:', error);
      toast({
        variant: 'destructive',
        title: 'Failed to Start Job',
        description: 'There was an error creating the custody unit. Please try again.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card>
      <CardContent className="p-6">
        <FormProvider {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="facilityRef"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-base">Facility or Unit Reference</FormLabel>
                  <FormControl>
                    <Input 
                        placeholder="e.g., Storage Unit #C-14 or Auction 'Main St. Bids'" 
                        {...field} 
                        disabled={isSubmitting}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" disabled={isSubmitting} className="w-full" size="lg">
              {isSubmitting ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <PlayCircle className="mr-2 h-4 w-4" />
              )}
              Start New Job & Begin Scanning
            </Button>
          </form>
        </FormProvider>
      </CardContent>
    </Card>
  );
}
