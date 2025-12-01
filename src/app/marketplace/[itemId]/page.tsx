'use client';

import Image from 'next/image';
import { useParams, notFound } from 'next/navigation';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tag, Package, Truck, ArrowLeft, Loader2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { useDoc } from '@/firebase';
import { doc } from 'firebase/firestore';
import { useFirestore, useMemoFirebase } from '@/firebase/provider';
import type { Item } from '@/lib/data';

export default function ItemDetailPage() {
  const params = useParams();
  const itemId = params.itemId as string;
  const firestore = useFirestore();

  const itemRef = useMemoFirebase(() => {
    if (!firestore || !itemId) return null;
    return doc(firestore, 'items', itemId);
  }, [firestore, itemId]);

  const { data: item, isLoading } = useDoc<Item>(itemRef);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!item) {
    notFound();
  }

  return (
    <div>
      <Button asChild variant="outline" className="mb-6">
        <Link href="/marketplace">
          <ArrowLeft className="mr-2" />
          Back to Marketplace
        </Link>
      </Button>
      <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
        <Card className="aspect-square relative overflow-hidden rounded-lg shadow-md">
          <Image
            src={item.imageUrl}
            alt={item.title}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 50vw"
            data-ai-hint={item.imageHint}
          />
        </Card>
        <div className="flex flex-col gap-6">
          <div className="space-y-2">
            <h1 className="text-3xl lg:text-4xl font-bold">{item.title}</h1>
            <p className="text-3xl font-bold text-primary">${item.price.toFixed(2)}</p>
          </div>

          <Card>
            <CardContent className="p-6 space-y-4">
              <p className="text-muted-foreground">{item.description}</p>
              {item.tags && item.tags.length > 0 && (
                <div className="flex items-center gap-2">
                  <Tag className="text-muted-foreground" />
                  <div className="flex flex-wrap gap-2">
                    {item.tags.map(tag => <Badge key={tag} variant="secondary">{tag}</Badge>)}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          <div className="flex flex-col gap-4">
            <Button size="lg" className="w-full">Buy Now</Button>
            <Card className="bg-secondary/50">
              <CardContent className="p-4 flex flex-col gap-4">
                <div className="flex items-center gap-3">
                  <Package className="h-6 w-6 text-primary" />
                  <div>
                    <h4 className="font-semibold">Pre-paid Shipping Label</h4>
                    <p className="text-sm text-muted-foreground">Generated upon purchase.</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Truck className="h-6 w-6 text-primary" />
                  <div>
                    <h4 className="font-semibold">Local Pickup Available</h4>
                    <p className="text-sm text-muted-foreground">Schedule a pickup slot after purchase.</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
