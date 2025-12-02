
import { AgentJobForm } from '@/components/valuscan/agent-job-form';
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function AgentHubPage() {
  return (
    <div className="container mx-auto max-w-2xl py-8">
      <Card className="border-none shadow-none bg-transparent mb-6">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-bold tracking-tight">Agent Hub</CardTitle>
          <CardDescription className="text-lg text-muted-foreground">
            Start a new unit clean-out and establish chain of custody.
          </CardDescription>
        </CardHeader>
      </Card>
      <AgentJobForm />
    </div>
  );
}
