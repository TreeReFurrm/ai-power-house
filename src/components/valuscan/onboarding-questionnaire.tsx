
'use client';

import { useState } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '../ui/button';
import { Card, CardContent } from '../ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '../ui/form';
import { RadioGroup, RadioGroupItem } from '../ui/radio-group';
import { Input } from '../ui/input';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';
import { useFirestore, useUser, setDocumentNonBlocking } from '@/firebase';
import { doc } from 'firebase/firestore';
import { useRouter } from 'next/navigation';
import { Progress } from '../ui/progress';

const onboardingSchema = z.object({
  primaryGoal: z.string({ required_error: 'Please select an option.' }),
  isAgent: z.string().optional(),
  agentId: z.string().optional(),
});

type OnboardingFormData = z.infer<typeof onboardingSchema>;

export function OnboardingQuestionnaire() {
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const firestore = useFirestore();
  const { user } = useUser();
  const router = useRouter();

  const form = useForm<OnboardingFormData>({
    resolver: zodResolver(onboardingSchema),
  });

  const primaryGoal = form.watch('primaryGoal');

  const handleNext = async () => {
    let nextStep = currentStep + 1;
    let isValid = true;
    
    if (currentStep === 1) {
      isValid = await form.trigger('primaryGoal');
      const goal = form.getValues('primaryGoal');
      if (goal === 'B') {
        nextStep = 3; // Skip to Agent ID step
      }
    } else if (currentStep === 2) {
      isValid = await form.trigger('isAgent');
      const isAgent = form.getValues('isAgent');
      if (isAgent === 'Yes') {
        nextStep = 3; // Go to Agent ID step
      } else {
        // This is a General User, finish the flow
        await completeOnboarding('general_user');
        return;
      }
    } else if (currentStep === 3) {
      isValid = await form.trigger('agentId');
      if (isValid) {
        // This is an Agent, finish the flow
        await completeOnboarding('agent_user');
        return;
      }
    }
    
    if (isValid) {
      setCurrentStep(nextStep);
    }
  };

  const handleBack = () => {
    let prevStep = currentStep - 1;
    // If coming back from Agent ID, logic depends on the initial goal
    if (currentStep === 3) {
      const goal = form.getValues('primaryGoal');
      if (goal === 'B') {
        prevStep = 1; // Go back to the first question
      } else {
        prevStep = 2; // Go back to the Yes/No agent question
      }
    }
    setCurrentStep(prevStep);
  };
  
  const completeOnboarding = async (role: 'general_user' | 'agent_user') => {
      if (!firestore || !user) {
        toast({
            variant: 'destructive',
            title: 'Error',
            description: 'You must be logged in to complete onboarding.',
        });
        return;
    }
    setIsSubmitting(true);
    
    try {
        const userRef = doc(firestore, 'users', user.uid);
        await setDocumentNonBlocking(userRef, { role }, { merge: true });

        toast({
            title: "Onboarding Complete!",
            description: "You're all set up.",
        });

        // Redirect based on role
        if (role === 'agent_user') {
            router.push('/agent-hub'); // Redirect agents to their hub
        } else {
            router.push('/'); // Redirect general users to the main dashboard
        }

    } catch (error) {
        console.error('Error saving role:', error);
        toast({
            variant: 'destructive',
            title: 'Save Failed',
            description: 'There was an error saving your profile.',
        });
        setIsSubmitting(false);
    }
  }
  
  const totalSteps = primaryGoal === 'B' ? 2 : 3;
  const progress = (currentStep / totalSteps) * 100;

  const renderStepContent = () => {
    switch(currentStep) {
        case 1: return (
            <FormField
              control={form.control}
              name="primaryGoal"
              render={({ field }) => (
                <FormItem className="space-y-4">
                  <FormLabel className="text-lg font-semibold">What brings you to ReFURRM today?</FormLabel>
                  <FormControl>
                    <RadioGroup onValueChange={field.onChange} defaultValue={field.value} className="flex flex-col space-y-2">
                      <FormItem className="flex items-center space-x-3 space-y-0 rounded-md border p-4 hover:bg-accent has-[[data-state=checked]]:bg-secondary">
                        <FormControl><RadioGroupItem value="A" /></FormControl>
                        <FormLabel className="font-normal w-full cursor-pointer">I want to quickly price and sell/donate a few items.</FormLabel>
                      </FormItem>
                      <FormItem className="flex items-center space-x-3 space-y-0 rounded-md border p-4 hover:bg-accent has-[[data-state=checked]]:bg-secondary">
                        <FormControl><RadioGroupItem value="B" /></FormControl>
                        <FormLabel className="font-normal w-full cursor-pointer">I am logging inventory for a clean-out or large lot.</FormLabel>
                      </FormItem>
                      <FormItem className="flex items-center space-x-3 space-y-0 rounded-md border p-4 hover:bg-accent has-[[data-state=checked]]:bg-secondary">
                        <FormControl><RadioGroupItem value="C" /></FormControl>
                        <FormLabel className="font-normal w-full cursor-pointer">I only want to appraise an item for myself.</FormLabel>
                      </FormItem>
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
        );
        case 2: return (
            <FormField
              control={form.control}
              name="isAgent"
              render={({ field }) => (
                <FormItem className="space-y-4">
                  <FormLabel className="text-lg font-semibold">Are you a ReFURRM team member or agent?</FormLabel>
                  <FormControl>
                    <RadioGroup onValueChange={field.onChange} defaultValue={field.value} className="flex flex-col space-y-2">
                       <FormItem className="flex items-center space-x-3 space-y-0 rounded-md border p-4 hover:bg-accent has-[[data-state=checked]]:bg-secondary">
                        <FormControl><RadioGroupItem value="Yes" /></FormControl>
                        <FormLabel className="font-normal w-full cursor-pointer">Yes, I have Agent Credentials.</FormLabel>
                      </FormItem>
                       <FormItem className="flex items-center space-x-3 space-y-0 rounded-md border p-4 hover:bg-accent has-[[data-state=checked]]:bg-secondary">
                        <FormControl><RadioGroupItem value="No" /></FormControl>
                        <FormLabel className="font-normal w-full cursor-pointer">No, I am a General User.</FormLabel>
                      </FormItem>
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
        );
        case 3: return (
            <FormField
              control={form.control}
              name="agentId"
              render={({ field }) => (
                <FormItem className="space-y-4">
                  <FormLabel className="text-lg font-semibold">Please enter your Agent ID to begin Unit Intake.</FormLabel>
                   <FormControl>
                     <Input placeholder="Enter your Agent ID" {...field} />
                   </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
        );
        default: return null;
    }
  }

  return (
    <Card>
      <CardContent className="p-6">
        <FormProvider {...form}>
          <form onSubmit={(e) => e.preventDefault()} className="space-y-8">
            <Progress value={progress} className="w-full" />
            
            {renderStepContent()}

            <div className="flex justify-between items-center pt-4">
                <Button type="button" variant="outline" onClick={handleBack} disabled={currentStep === 1 || isSubmitting}>
                    Back
                </Button>
                <Button type="button" onClick={handleNext} disabled={isSubmitting}>
                    {isSubmitting ? (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                       'Next'
                    )}
                </Button>
            </div>
          </form>
        </FormProvider>
      </CardContent>
    </Card>
  );
}
