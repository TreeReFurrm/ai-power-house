
import { AmbassadorApplicationForm } from '@/components/valuscan/ambassador-application-form';
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function AmbassadorApplyPage() {
  return (
    <div className="container mx-auto max-w-2xl py-8">
      <Card className="border-none shadow-none bg-transparent mb-6">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-bold tracking-tight text-primary">Become a ReFurrm Ambassador</CardTitle>
          <CardDescription className="text-lg text-muted-foreground">
            Lead your community in ethical salvage and help us grow our mission.
          </CardDescription>
        </CardHeader>
      </Card>
      <AmbassadorApplicationForm />
    </div>
  );
}
