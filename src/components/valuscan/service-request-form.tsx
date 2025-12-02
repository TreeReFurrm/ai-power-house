'use client';

import { useState } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '../ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from '../ui/form';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { useToast } from '@/hooks/use-toast';
import { Loader2, UserCheck, UserX, Send } from 'lucide-react';
import { useUser } from '@/firebase';
import { requestSecondaryService, SecondaryServiceOutput } from '@/ai/flows/request-secondary-service';
import { Alert, AlertDescription, AlertTitle } from '../ui/alert';
import { Checkbox } from '../ui/checkbox';

const serviceRequestSchema = z.object({
  serviceType: z.enum([
      'Full-Service Inventory Clean-out', 
      'Organizational/Staging Support', 
      'Logistics/Pickup Request', 
      'DIY Fulfillment Consultation'
    ], { required_error: 'Please select a service.'}),
  projectSize: z.enum(['Small (1-5 items)', 'Medium (6-15 items)', 'Large (15+ items)'], { required_error: 'Please estimate the project size.' }),
  urgency: z.enum(['Within 48 hours', 'Within 1 week', 'Flexible'], { required_error: 'Please select a deadline.' }),
  zipCode: z.string().min(5, 'Please enter a valid 5-digit ZIP code.').max(5),
  logisticsAcknowledged: z.boolean().refine(val => val === true, {
    message: 'You must acknowledge item accessibility.',
  }),
  notes: z.string().optional(),
});

type ServiceRequestFormData = z.infer<typeof serviceRequestSchema>;

export function ServiceRequestForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [result, setResult] = useState<SecondaryServiceOutput | null>(null);
  const { toast } = useToast();
  const { user } = useUser();

  const form = useForm<ServiceRequestFormData>({
    resolver: zodResolver(serviceRequestSchema),
    defaultValues: {
      logisticsAcknowledged: false,
    }
  });
  
  const serviceType = form.watch('serviceType');

  const onSubmit = async (data: ServiceRequestFormData) => {
    if (!user) {
      toast({
        variant: 'destructive',
        title: 'Please log in',
        description: 'You need to be logged in to request a service.',
      });
      return;
    }
    
    setIsSubmitting(true);
    setResult(null);

    try {
        const serviceTypeMap = {
            'Full-Service Inventory Clean-out': 'cleanout',
            'Organizational/Staging Support': 'organize',
            'Logistics/Pickup Request': 'pickup',
            'DIY Fulfillment Consultation': 'downsize'
        } as const;

        const serviceTypeValue = serviceTypeMap[data.serviceType as keyof typeof serviceTypeMap] || 'cleanout';

        const output = await requestSecondaryService({
            serviceType: serviceTypeValue,
            zipCode: data.zipCode,
            notes: data.notes,
            userId: user.uid,
            projectSize: data.projectSize,
            urgency: data.urgency,
            logisticsAcknowledged: data.logisticsAcknowledged,
        });
      setResult(output);
    } catch (error) {
      console.error('Service request failed:', error);
      toast({
        variant: 'destructive',
        title: 'Request Failed',
        description: 'There was an error submitting your request. Please try again.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const handleReset = () => {
    setResult(null);
    form.reset({ logisticsAcknowledged: false });
  }

  if (result) {
    const isMatched = result.status === 'MATCHED';
    return (
        <Card>
            <CardHeader className="text-center">
                <div className="mx-auto bg-primary/10 p-4 rounded-full w-fit">
                    {isMatched ? <UserCheck className="size-10 text-primary" /> : <UserX className="size-10 text-destructive" />}
                </div>
                <CardTitle>{isMatched ? "We Found a Match!" : "No Match Found Yet"}</CardTitle>
                <CardDescription>{result.message}</CardDescription>
            </CardHeader>
            <CardContent>
                 <Alert variant={isMatched ? 'default' : 'destructive'}>
                    <AlertTitle>Next Steps</AlertTitle>
                    <AlertDescription>
                        {isMatched ? 
                        `Your request has been sent to ${result.assignedAmbassadorName}. They will contact you shortly to schedule the service.`
                        : `We've added your request to our waitlist. We are actively expanding our Ambassador network and will notify you as soon as someone becomes available in your area.`
                        }
                    </AlertDescription>
                </Alert>
                <Button onClick={handleReset} variant="outline" className="w-full mt-6">
                    Make Another Request
                </Button>
            </CardContent>
        </Card>
    )
  }

  return (
    <Card>
      <CardContent className="p-6">
        <FormProvider {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="serviceType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>1. What service do you need?</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value} disabled={isSubmitting}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a service type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="Full-Service Inventory Clean-out">Full-Service Inventory Clean-out</SelectItem>
                      <SelectItem value="Organizational/Staging Support">Organizational/Staging Support (Pro Tier Only)</SelectItem>
                      <SelectItem value="Logistics/Pickup Request">Logistics/Pickup Request</SelectItem>
                      <SelectItem value="DIY Fulfillment Consultation">DIY Fulfillment Consultation</SelectItem>
                    </SelectContent>
                  </Select>
                  { (serviceType === 'Full-Service Inventory Clean-out' || serviceType === 'Organizational/Staging Support') &&
                    <FormDescription className="text-xs text-primary/80">Note: This service requires a consultation. Commissions (10-15%) will apply to all items successfully listed and sold.</FormDescription>
                  }
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid md:grid-cols-2 gap-6">
                <FormField
                control={form.control}
                name="projectSize"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>2. Estimated Project Size</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value} disabled={isSubmitting}>
                        <FormControl>
                        <SelectTrigger>
                            <SelectValue placeholder="Estimate the project size" />
                        </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                        <SelectItem value="Small (1-5 items)">Small (1-5 items)</SelectItem>
                        <SelectItem value="Medium (6-15 items)">Medium (6-15 items)</SelectItem>
                        <SelectItem value="Large (15+ items)">Large (15+ items)</SelectItem>
                        </SelectContent>
                    </Select>
                    <FormMessage />
                    </FormItem>
                )}
                />

                <FormField
                control={form.control}
                name="urgency"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>3. Required Deadline</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value} disabled={isSubmitting}>
                        <FormControl>
                        <SelectTrigger>
                            <SelectValue placeholder="Select a deadline" />
                        </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                        <SelectItem value="Within 48 hours">Within 48 hours</SelectItem>
                        <SelectItem value="Within 1 week">Within 1 week</SelectItem>
                        <SelectItem value="Flexible">Flexible</SelectItem>
                        </SelectContent>
                    </Select>
                    <FormMessage />
                    </FormItem>
                )}
                />
            </div>
            
            <FormField
              control={form.control}
              name="zipCode"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>4. Project ZIP Code</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter your 5-digit ZIP code" {...field} disabled={isSubmitting} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

             <FormField
                control={form.control}
                name="logisticsAcknowledged"
                render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                        <FormControl>
                        <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                            disabled={isSubmitting}
                        />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                        <FormLabel>5. I confirm items are easily accessible.</FormLabel>
                        <FormDescription>
                            (e.g., ground floor, elevator access, or easy street parking).
                        </FormDescription>
                        <FormMessage />
                        </div>
                    </FormItem>
                )}
            />

            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>6. Project Notes (Optional)</FormLabel>
                  <FormControl>
                    <Textarea 
                        placeholder="Include specific requirements or known challenges. e.g., 'Cleaning out a 10x20 storage unit...'" 
                        rows={3} 
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
                <Send className="mr-2 h-4 w-4" />
              )}
              Submit Request
            </Button>
          </form>
        </FormProvider>
      </CardContent>
    </Card>
  );
}
