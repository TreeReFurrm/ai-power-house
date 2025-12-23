
import { ServiceRequestForm } from '@/components/valuscan/service-request-form';
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function ServicesPage() {
  return (
    <div className="container mx-auto max-w-2xl py-8">
      <header className="text-center">
        <h1 className="page-title">Request an Ambassador Service</h1>
        <p className="page-subtitle">
            Request hands-on assistance for inventory, organization, or major clean-outs.
        </p>
      </header>
      <Card>
        <ServiceRequestForm />
      </Card>
    </div>
  );
}
