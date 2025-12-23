
import { VerificationTool } from '@/components/valuscan/verification-tool';
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function VerifyPage() {
  return (
    <div className="container mx-auto max-w-xl py-8">
       <header className="text-center">
        <h1 className="page-title">Pricing Tool</h1>
        <p className="page-subtitle">
            Snap an item to get an instant, data-driven market valuation and start a listing.
        </p>
      </header>
      <VerificationTool />
    </div>
  );
}
