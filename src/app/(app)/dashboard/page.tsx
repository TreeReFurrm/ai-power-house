import Link from 'next/link';
import Image from 'next/image';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { ArrowRight, BookText, Briefcase, FileText, GraduationCap, Mail, MessageSquare, Palette, SwatchBook, Languages, BookOpen, PenSquare } from 'lucide-react';

export default function DashboardPage() {
  const features = [
    {
      title: 'Human-Like Letter Writer',
      description: 'Craft personalized letters with AI that mimics human writing styles for any tone or purpose.',
      href: '/writer/letter',
      icon: Mail,
      imageId: 'letter-writer',
    },
    {
      title: 'Novel Co-writer',
      description: 'Your creative partner for writing fiction. Generate ideas, continue chapters, and refine your prose.',
      href: '/writer/novel',
      icon: PenSquare,
      imageId: 'novel-writer',
    },
    {
      title: 'Fine-Print Summarizer',
      description: 'Summarize complex documents, highlighting key terms and conditions in an easy-to-understand format.',
      href: '/tools/summarizer',
      icon: FileText,
      imageId: 'summarizer',
    },
    {
      title: 'Business Form Creator',
      description: 'Generate customized business forms like invoices and contracts with AI assistance.',
      href: '/tools/forms',
      icon: Briefcase,
      imageId: 'form-creator',
    },
    {
      title: 'SME Course Designer',
      description: 'Turn your expertise into engaging courses. Upload content and let AI build the foundation.',
      href: '/courses/designer',
      icon: GraduationCap,
      imageId: 'course-designer',
    },
    {
      title: 'PDF & Image Tools',
      description: 'A full suite of tools to merge, split, compress, and convert your PDF and image files.',
      href: '/tools/pdf',
      icon: SwatchBook,
      imageId: 'pdf-tools',
    },
    {
      title: 'AI Translator',
      description: 'Transform your text instantly with our AI translator. Supports multiple languages.',
      href: '/tools/translator',
      icon: Languages,
      imageId: 'ai-translator',
    },
    {
      title: 'Chat with PDF',
      description: 'Summarize, ask questions, extract key insights, and understand research from any PDF.',
      href: '/tools/chat-pdf',
      icon: MessageSquare,
      imageId: 'chat-pdf',
    },
    {
      title: 'Image Generator',
      description: 'Create stunning AI art and images. Turn your visions into reality with a simple text prompt.',
      href: '/tools/image-generator',
      icon: Palette,
      imageId: 'image-generator',
    },
    {
      title: 'AI Reading Assistant',
      description: 'Maximize your reading efficiency without sacrificing comprehension. Get summaries and key points.',
      href: '/tools/summarizer',
      icon: BookOpen,
      imageId: 'reading-assistant',
    },
  ];

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="font-headline text-4xl font-bold tracking-tight">Welcome to AI Powerhouse</h1>
        <p className="text-muted-foreground mt-2">Your suite of intelligent tools for writing and content creation. Select a tool to get started.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {features.map((feature) => {
          const placeholder = PlaceHolderImages.find(img => img.id === feature.imageId);
          return (
            <Card key={feature.title} className="flex flex-col overflow-hidden transition-transform hover:scale-[1.02] hover:shadow-lg">
              <CardHeader className="flex-row items-start gap-4">
                <div className="p-3 bg-primary/10 text-primary rounded-lg">
                    <feature.icon className="w-6 h-6" />
                </div>
                <div>
                  <CardTitle className="font-headline text-xl">{feature.title}</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="flex-grow">
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
                <CardDescription>{feature.description}</CardDescription>
              </CardContent>
              <CardFooter>
                <Button asChild className="w-full">
                  <Link href={feature.href}>
                    Open Tool <ArrowRight />
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
