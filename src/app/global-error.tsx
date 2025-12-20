'use client';

import { Button } from "@/components/ui/button";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html>
      <body>
        <div className="min-h-screen bg-background flex flex-col items-center justify-center text-center p-4">
            <div className="max-w-md">
                <h1 className="text-3xl font-headline font-bold text-destructive mb-4">Something went wrong!</h1>
                <p className="text-muted-foreground mb-2">
                    An unexpected error occurred. Please try again.
                </p>

                {error?.message && (
                    <details className="p-4 bg-muted rounded-md text-left text-xs text-muted-foreground border">
                        <summary className="cursor-pointer font-medium mb-2">Error Details</summary>
                        <pre className="whitespace-pre-wrap font-code break-words">{error.message}</pre>
                    </details>
                )}
                
                <div className="mt-6 flex gap-4 justify-center">
                    <Button onClick={() => reset()}>Try again</Button>
                    <Button variant="outline" onClick={() => window.location.assign('/')}>Go to Homepage</Button>
                </div>
            </div>
        </div>
      </body>
    </html>
  );
}
