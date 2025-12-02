
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, Home } from 'lucide-react';
import Link from 'next/link';

export default function ApplicationSubmittedPage() {
  return (
    <div className="container mx-auto max-w-lg py-8 text-center">
      <Card>
        <CardHeader>
            <div className="mx-auto bg-green-500/10 p-4 rounded-full w-fit mb-4">
                <CheckCircle className="size-12 text-green-500" />
            </div>
            <CardTitle className="text-2xl">Application Received!</CardTitle>
            <CardDescription>
                Thank you for your interest in becoming a ReFurrm Ambassador. Your application has been submitted for review.
            </CardDescription>
        </CardHeader>
        <CardContent>
            <p className="text-muted-foreground">
                We are excited to learn more about you. Our team (and our AI) will review your submission, and we will get back to you via email with the next steps.
            </p>
            <Button asChild className="mt-6">
                <Link href="/">
                    <Home className="mr-2 h-4 w-4" />
                    Return to Dashboard
                </Link>
            </Button>
        </CardContent>
      </Card>
    </div>
  );
}
