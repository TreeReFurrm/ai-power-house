
import { OnboardingQuestionnaire } from '@/components/valuscan/onboarding-questionnaire';
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function WelcomePage() {
  return (
    <div className="container mx-auto max-w-2xl py-8">
      <Card className="border-none shadow-none bg-transparent mb-6">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-bold tracking-tight text-primary">Welcome to ReFurrm</CardTitle>
          <CardDescription className="text-lg text-muted-foreground">
            Let's quickly get you to the right place.
          </CardDescription>
        </CardHeader>
      </Card>
      <OnboardingQuestionnaire />
    </div>
  );
}
