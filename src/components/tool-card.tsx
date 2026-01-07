'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { ArrowRight, Star } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

interface ToolCardProps {
  title: string;
  description: string;
  href: string;
  icon: LucideIcon;
  imageId: string;
  isPro: boolean;
  onClick: () => void;
}

export function ToolCard({ title, description, href, icon: Icon, imageId, isPro, onClick }: ToolCardProps) {
  const placeholder = PlaceHolderImages.find(img => img.id === imageId);

  return (
    <Card className="flex flex-col overflow-hidden transition-transform hover:scale-[1.02] hover:shadow-lg">
      <CardHeader className="flex-row items-start gap-4">
        <div className="p-3 bg-primary/10 text-primary rounded-lg">
          <Icon className="w-6 h-6" />
        </div>
        <div className="flex-1">
          <div className="flex justify-between items-center">
            <CardTitle className="font-headline text-xl">{title}</CardTitle>
            {isPro && (
              <Badge variant="destructive" className="flex items-center gap-1 bg-accent text-accent-foreground">
                <Star className="w-3 h-3" /> Pro
              </Badge>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent className="flex-grow flex flex-col">
        {placeholder && (
          <div className="mb-4 rounded-lg overflow-hidden aspect-video">
            <Image
              src={placeholder.imageUrl}
              alt={placeholder.description}
              width={600}
              height={400}
              data-ai-hint={placeholder.imageHint}
              className="object-cover w-full h-full"
            />
          </div>
        )}
        <p className="text-sm text-muted-foreground leading-relaxed flex-grow">{description}</p>
      </CardContent>
      <CardFooter>
        <Button asChild className="w-full mt-auto" onClick={onClick}>
          <Link href={href}>
            Open Tool <ArrowRight />
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
