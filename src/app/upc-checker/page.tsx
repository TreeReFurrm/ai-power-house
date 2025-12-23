
import { UpcChecker } from '@/components/valuscan/upc-checker';
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function UpcCheckerPage() {
  return (
    <div className="container mx-auto max-w-2xl py-8">
      <header className="text-center">
        <h1 className="page-title">Barcode Scanner</h1>
        <p className="page-subtitle">
            Enter a barcode and asking price to instantly evaluate profit and resale potential.
        </p>
      </header>
      <UpcChecker />
    </div>
  );
}
