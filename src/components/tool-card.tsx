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
import { useUser } from '@/firebase';
import { cn } from '@/lib/utils';

interface ToolCardProps {
  title: string;
  description: string;
  href: string;
  icon: LucideIcon;
  imageId: string;
  isPro: boolean;
  onClick: () => void;
  className?: string;
  style?: React.CSSProperties;
}

export function ToolCard({
  title,
  description,
  href,
  icon: Icon,
  imageId,
  isPro,
  onClick,
  className,
  style,
}: ToolCardProps) {
  const placeholder = PlaceHolderImages.find(img => img.id === imageId);
  const { isAdmin } = useUser();
  const showProBadge = isPro && !isAdmin;

  return (
    <Card
      className={cn(
        "group flex flex-col overflow-hidden border border-white/10 bg-card/70 shadow-[0_18px_40px_rgba(0,0,0,0.35)] transition-all hover:-translate-y-1 hover:border-white/20 hover:shadow-[0_20px_45px_rgba(0,0,0,0.45)]",
        className
      )}
      style={style}
    >
      <CardHeader className="flex-row items-start gap-4 pb-3">
        <div className="rounded-xl bg-primary/15 p-3 text-primary shadow-[0_0_18px_hsl(var(--primary)/0.2)]">
          <Icon className="w-6 h-6" />
        </div>
        <div className="flex-1">
          <div className="flex justify-between items-center">
            <CardTitle className="font-headline text-lg uppercase tracking-[0.12em]">{title}</CardTitle>
            {showProBadge && (
              <Badge variant="destructive" className="flex items-center gap-1 bg-accent/90 text-accent-foreground">
                <Star className="w-3 h-3" /> Pro
              </Badge>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent className="flex-grow flex flex-col">
        {placeholder && (
          <div className="mb-4 rounded-xl overflow-hidden aspect-video border border-white/10 shadow-[0_10px_30px_rgba(0,0,0,0.3)]">
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
        <Button
          asChild
          className="w-full mt-auto h-11 uppercase tracking-[0.18em] text-xs"
          onClick={onClick}
          disabled={showProBadge}
        >
          <Link href={showProBadge ? '#' : href}>
            {showProBadge ? 'Upgrade to Use' : 'Open Tool'} <ArrowRight />
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
