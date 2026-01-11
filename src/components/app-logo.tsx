import { Bot } from 'lucide-react';
import { cn } from '@/lib/utils';

export function AppLogo({ className }: { className?: string }) {
  return (
    <div className={cn("flex items-center gap-2", className)}>
      <div className="bg-primary text-primary-foreground p-2 rounded-lg shadow-[0_0_18px_hsl(var(--primary)/0.35)]">
        <Bot className="h-6 w-6" />
      </div>
      <h1 className="font-logo text-lg font-bold uppercase tracking-[0.2em] text-primary-foreground hidden group-data-[state=expanded]:block">
        AI Powerhouse
      </h1>
    </div>
  );
}
