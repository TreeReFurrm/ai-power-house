'use client';

import {
  ArrowRight,
  Combine,
  FileText,
  ImageIcon,
  Key,
  Layers,
  Package,
  Scissors,
  Shield,
  Spline,
  Sparkles,
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

export default function PdfToolsPage() {
  const tools = [
    { title: 'Merge PDF', icon: Combine, description: 'Combine multiple PDFs into a single document.' },
    { title: 'Compress PDF', icon: Package, description: 'Reduce file size by compressing text and images.' },
    { title: 'Split PDF', icon: Scissors, description: 'Extract pages or split a PDF into multiple files.' },
    { title: 'PDF to JPEG', icon: FileText, description: 'Export each PDF page as a separate JPEG file.' },
    { title: 'Image to PDF', icon: ImageIcon, description: 'Convert JPEG, PNG, and other images into a single PDF.' },
    { title: 'Unlock PDF', icon: Key, description: 'Remove password and encryption from your PDFs.' },
    { title: 'Protect PDF', icon: Shield, description: 'Add a password and encrypt your PDF files.' },
    { title: 'Add Watermark', icon: Spline, description: 'Add a text or image watermark to your PDF.' },
    { title: 'Extract Pages', icon: Layers, description: 'Select and save only the pages you need.' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-headline text-3xl font-bold">PDF & Image Tools</h1>
        <p className="text-muted-foreground">A complete suite of tools to manage and manipulate your documents.</p>
      </div>

      <Alert className="bg-primary/10 border-primary/20 text-primary-foreground">
        <Sparkles className="h-5 w-5 text-primary" />
        <AlertTitle className="text-primary font-bold">Unlock All Tools</AlertTitle>
        <AlertDescription className="flex items-center justify-between">
          <span>These powerful PDF and Image tools are available on our Pro plan.</span>
          <Button asChild size="sm">
            <Link href="/pro">Upgrade to Pro</Link>
          </Button>
        </AlertDescription>
      </Alert>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {tools.map((tool) => (
          <Card key={tool.title} className="flex flex-col transition-transform hover:scale-[1.02] hover:shadow-lg opacity-60">
            <CardHeader className="flex-row items-start gap-4">
              <div className="p-3 bg-primary/10 text-primary rounded-lg">
                <tool.icon className="w-6 h-6" />
              </div>
              <div>
                <CardTitle className="font-headline text-lg">{tool.title}</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="flex-grow">
              <CardDescription>{tool.description}</CardDescription>
            </CardContent>
            <CardFooter>
              <Button asChild className="w-full" variant="secondary" disabled>
                <Link href="#">
                  Upgrade to Use
                </Link>
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
