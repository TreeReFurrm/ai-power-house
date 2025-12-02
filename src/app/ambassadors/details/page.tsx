
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function AmbassadorDetailsPage() {
  return (
    <div className="container mx-auto max-w-2xl py-8">
      <Card className="border-none shadow-none bg-transparent mb-6">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-bold tracking-tight">Ambassador Program</CardTitle>
          <CardDescription className="text-lg text-muted-foreground">
            Details about the Ambassador program are coming soon.
          </CardDescription>
        </CardHeader>
      </Card>
    </div>
  );
}
