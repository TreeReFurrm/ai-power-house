'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { ArrowRight, BookOpen, Briefcase, FileText, GraduationCap, Languages, Lightbulb, Mail, MessageSquare, Palette, PenSquare, Search, SwatchBook, Wand2, History, Badge } from 'lucide-react';
import React, { useState, useEffect } from 'react';
import { ToolCard } from '@/components/tool-card';

const allFeatures = [
  {
    title: 'Human-Like Letter Writer',
    description: 'Craft personalized letters with AI that mimics human writing styles for any tone or purpose.',
    href: '/writer/letter',
    icon: Mail,
    imageId: 'letter-writer',
    isPro: false,
  },
  {
    title: 'Novel Co-writer',
    description: 'Your creative partner for writing fiction. Generate ideas, continue chapters, and refine your prose.',
    href: '/writer/novel',
    icon: PenSquare,
    imageId: 'novel-writer',
    isPro: false,
  },
  {
    title: 'Fine-Print Summarizer',
    description: 'Summarize complex documents, highlighting key terms and conditions in an easy-to-understand format.',
    href: '/tools/summarizer',
    icon: FileText,
    imageId: 'summarizer',
    isPro: false,
  },
  {
    title: 'Business Form Creator',
    description: 'Generate customized business forms like invoices and contracts with AI assistance.',
    href: '/tools/forms',
    icon: Briefcase,
    imageId: 'form-creator',
    isPro: false,
  },
  {
    title: 'Start-up Idea Mentor',
    description: 'Generate innovative startup ideas tailored to your skills and capabilities with our AI-powered business concept mentor.',
    href: '/tools/business-idea-generator',
    icon: Lightbulb,
    imageId: 'business-idea-generator',
    isPro: false,
  },
  {
    title: 'SME Course Designer',
    description: 'Turn your expertise into engaging courses. Upload content and let AI build the foundation.',
    href: '/courses/designer',
    icon: GraduationCap,
    imageId: 'course-designer',
    isPro: false,
  },
  {
    title: 'Prompt Enhancer',
    description: 'Learn how to write better AI prompts. Turn your simple goal into a detailed, effective instruction for any AI.',
    href: '/tools/prompt-enhancer',
    icon: Wand2,
    imageId: 'prompt-enhancer',
    isPro: false,
  },
  {
    title: 'PDF & Image Tools',
    description: 'A full suite of tools to merge, split, compress, and convert your PDF and image files.',
    href: '/tools/pdf',
    icon: SwatchBook,
    imageId: 'pdf-tools',
    isPro: true,
  },
  {
    title: 'AI Translator',
    description: 'Transform your text instantly with our AI translator. Supports multiple languages.',
    href: '/tools/translator',
    icon: Languages,
    imageId: 'ai-translator',
    isPro: false,
  },
  {
    title: 'Chat with PDF',
    description: 'Summarize, ask questions, extract key insights, and understand research from any PDF.',
    href: '/tools/chat-pdf',
    icon: MessageSquare,
    imageId: 'chat-pdf',
    isPro: true,
  },
  {
    title: 'Image Generator',
    description: 'Create stunning AI art and images. Turn your visions into reality with a simple text prompt.',
    href: '/tools/image-generator',
    icon: Palette,
    imageId: 'image-generator',
    isPro: false,
  },
  {
    title: 'AI Reading Assistant',
    description: 'Maximize your reading efficiency without sacrificing comprehension. Get summaries and key points.',
    href: '/tools/summarizer',
    icon: BookOpen,
    imageId: 'reading-assistant',
    isPro: false,
  },
];

export default function DashboardPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [recentlyUsed, setRecentlyUsed] = useState<string[]>([]);

  useEffect(() => {
    const storedRecents = localStorage.getItem('recentlyUsedTools');
    if (storedRecents) {
      setRecentlyUsed(JSON.parse(storedRecents));
    }
  }, []);

  const handleToolClick = (href: string) => {
    let updatedRecents = [href, ...recentlyUsed.filter(item => item !== href)];
    updatedRecents = updatedRecents.slice(0, 4); // Keep only the last 4
    setRecentlyUsed(updatedRecents);
    localStorage.setItem('recentlyUsedTools', JSON.stringify(updatedRecents));
  };
  
  const filteredFeatures = allFeatures.filter(feature =>
    feature.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    feature.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const recentlyUsedFeatures = recentlyUsed
    .map(href => allFeatures.find(f => f.href === href))
    .filter(Boolean) as typeof allFeatures;


  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="font-headline text-4xl font-bold tracking-tight">Welcome to AI Powerhouse</h1>
        <p className="text-muted-foreground mt-2">Your suite of intelligent tools for writing and content creation. Select a tool to get started.</p>
        <div className="relative mt-4 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search for a tool..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border rounded-full bg-background"
          />
        </div>
      </div>
      
      {recentlyUsedFeatures.length > 0 && (
        <div>
          <h2 className="font-headline text-2xl font-bold tracking-tight mb-4 flex items-center gap-2">
            <History className="h-6 w-6" /> Recently Used
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {recentlyUsedFeatures.map((feature) => (
              <ToolCard
                key={feature.href}
                {...feature}
                onClick={() => handleToolClick(feature.href)}
              />
            ))}
          </div>
        </div>
      )}

      <div>
        <h2 className="font-headline text-2xl font-bold tracking-tight mb-4">All Tools</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredFeatures.map((feature) => (
            <ToolCard
              key={feature.title}
              {...feature}
              onClick={() => handleToolClick(feature.href)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
