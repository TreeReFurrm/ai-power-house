
'use client';

import Image from 'next/image';
import { useParams, notFound, useRouter } from 'next/navigation';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tag, Package, Truck, ArrowLeft, Loader2, Heart } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { useDoc, useUser, useFirestore, addDocumentNonBlocking, updateDocumentNonBlocking } from '@/firebase';
import { doc, collection, serverTimestamp } from 'firebase/firestore';
import { useMemoFirebase } from '@/firebase/provider';
import type { Item } from '@/lib/data';
import { useToast } from '@/hooks/use-toast';
import { useState } from 'react';

export default function ItemDetailPage() {
  const params = useParams();
  const itemId = params.itemId as string;
  const firestore = useFirestore();
  const { user } = useUser();
  const { toast } = useToast();
  const router = useRouter();
  const [isBuying, setIsBuying] = useState(false);

  const itemRef = useMemoFirebase(() => {
    if (!firestore || !itemId) return null;
    return doc(firestore, 'items', itemId);
  }, [firestore, itemId]);

  const { data: item, isLoading } = useDoc<Item>(itemRef);

  const handleBuyNow = async () => {
    if (!user) {
      toast({
        variant: 'destructive',
        title: 'Please log in',
        description: 'You need to be logged in to purchase an item.',
      });
      router.push('/login');
      return;
    }

    if (!firestore || !item) return;

    if (user.uid === item.userId) {
      toast({
        variant: 'destructive',
        title: 'Cannot buy your own item',
        description: 'You cannot purchase an item you have listed.',
      });
      return;
    }

    setIsBuying(true);

    try {
      // 1. Create Sale Document
      const salesCollection = collection(firestore, 'sales');
      const saleData = {
        itemId: item.id,
        buyerId: user.uid,
        sellerId: item.userId,
        saleDate: serverTimestamp(),
        salePrice: item.price,
        ethicalContributionId: null, // Will be updated if contribution is made
      };
      
      const saleDocRef = await addDocumentNonBlocking(salesCollection, saleData);
      
      // 2. Create Ethical Contribution if applicable
      if (item.enableEthicalContribution && item.contributionPercentage && saleDocRef) {
        const contributionAmount = (item.price * item.contributionPercentage) / 100;
        const contributionsCollection = collection(firestore, 'ethical_contributions');
        const contributionData = {
          saleId: saleDocRef.id,
          amount: contributionAmount,
          contributionDate: serverTimestamp(),
        };
        const contributionDocRef = await addDocumentNonBlocking(contributionsCollection, contributionData);
        
        // Link contribution to sale
        if(contributionDocRef) {
            updateDocumentNonBlocking(saleDocRef, { ethicalContributionId: contributionDocRef.id });
        }
      }

      // 3. Update Item Status
      if(itemRef){
        updateDocumentNonBlocking(itemRef, { status: 'sold' });
      }


      toast({
        title: 'Purchase Successful!',
        description: `You have purchased ${item.title}.`,
      });

      // Redirect or update UI
      router.push('/account');

    } catch (error) {
      console.error('Purchase failed:', error);
      toast({
        variant: 'destructive',
        title: 'Purchase Failed',
        description: 'There was an error processing your purchase.',
      });
    } finally {
      setIsBuying(false);
    }
  };


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
          Back to ReFurrm Ethical Resale
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
            <div className="flex items-baseline gap-4">
              <p className="text-3xl font-bold text-primary">${item.price.toFixed(2)}</p>
              {item.status === 'sold' && <Badge variant="destructive">Sold</Badge>}
            </div>
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
               {item.enableEthicalContribution && (
                <div className="flex items-center gap-2 pt-2 text-sm text-primary">
                  <Heart className="h-5 w-5" />
                  <span>A portion of this sale supports the LEAN Foundation.</span>
                </div>
              )}
            </CardContent>
          </Card>

          <div className="flex flex-col gap-4">
            <Button size="lg" className="w-full" onClick={handleBuyNow} disabled={isBuying || item.status === 'sold'}>
              {isBuying ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                'Buy Now'
              )}
            </Button>
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
