'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

import { generateCourseOutline } from '@/ai/flows/generate-course-outline';
import { editCourseContent } from '@/ai/flows/edit-course-content';
import { generateRelevantMultimedia } from '@/ai/flows/generate-relevant-multimedia';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Skeleton } from '@/components/ui/skeleton';
import { MarkdownDisplay } from '@/components/markdown-display';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Image as ImageIcon, Video, FileDown } from 'lucide-react';
import Image from 'next/image';

const outlineSchema = z.object({
  content: z.string().min(100, 'Please provide substantial content for course generation.'),
  numModules: z.coerce.number().int().min(1).max(20).default(5),
  targetAudience: z.string().default('Beginner'),
  tone: z.string().default('Conversational'),
  format: z.string().default('University Course'),
});

type OutlineValues = z.infer<typeof outlineSchema>;

type GenerateCourseOutlineInput = {
  content: string;
  numModules: number;
  targetAudience: string;
};

type EditCourseContentInput = {
    content: string;
    instruction: string;
};

type GenerateRelevantMultimediaInput = {
    lessonContent: string;
};

type GenerateRelevantMultimediaOutput = {
    suggestedImages: { url: string; description: string; }[];
    suggestedVideos: { url: string; title: string; }[];
};


export default function CourseDesignerPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [courseOutline, setCourseOutline] = useState<string | null>(null);
  const [multimedia, setMultimedia] = useState<GenerateRelevantMultimediaOutput | null>(null);
  const { toast } = useToast();

  const form = useForm<OutlineValues>({
    resolver: zodResolver(outlineSchema),
    defaultValues: {
      content: '',
      numModules: 5,
      targetAudience: 'Beginner',
      tone: 'Conversational',
      format: 'University Course',
    },
  });

  const onOutlineSubmit = async (values: OutlineValues) => {
    setIsLoading(true);
    setCourseOutline(null);
    try {
      const result = await generateCourseOutline({
          content: values.content,
          numModules: values.numModules,
          targetAudience: values.targetAudience,
      });
      setCourseOutline(result.outline);
    } catch (error) {
      console.error(error);
      toast({ title: 'Error', description: 'Failed to generate course outline.', variant: 'destructive' });
    } finally {
      setIsLoading(false);
    }
  };
  
  // Dummy data for other tabs
  const [editedContent, setEditedContent] = useState<string>("This is a sample lesson content that can be edited using AI.");
  const handleEdit = async (instruction: string) => {
    setIsLoading(true);
    try {
      const result = await editCourseContent({ content: editedContent, instruction });
      setEditedContent(result.editedContent);
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to edit content.', variant: 'destructive' });
    }
    setIsLoading(false);
  };
  const handleFindMultimedia = async () => {
    setIsLoading(true);
    setMultimedia(null);
    try {
      const result = await generateRelevantMultimedia({ lessonContent: editedContent });
      setMultimedia(result);
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to find multimedia.', variant: 'destructive' });
    }
    setIsLoading(false);
  };


  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-headline text-3xl font-bold">SME Course Designer</h1>
        <p className="text-muted-foreground">Transform your expertise into a structured, engaging course.</p>
      </div>

      <Tabs defaultValue="outline">
        <TabsList>
          <TabsTrigger value="outline">1. Outline</TabsTrigger>
          <TabsTrigger value="content" disabled={!courseOutline}>2. Content Editor</TabsTrigger>
          <TabsTrigger value="multimedia" disabled={!courseOutline}>3. Multimedia</TabsTrigger>
          <TabsTrigger value="export" disabled={!courseOutline}>4. Export</TabsTrigger>
        </TabsList>
        <TabsContent value="outline">
          <Card>
            <CardHeader>
              <CardTitle>Generate Course Outline</CardTitle>
              <CardDescription>Provide your source material and define the course parameters. The AI will generate a starting outline.</CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onOutlineSubmit)} className="space-y-6">
                  <FormField
                    control={form.control}
                    name="content"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>SME Content</FormLabel>
                        <FormControl>
                          <Textarea placeholder="Paste your documents, lecture transcripts, or company manuals here..." className="min-h-[250px]" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <FormField control={form.control} name="numModules" render={({ field }) => (
                        <FormItem><FormLabel>Number of Modules</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem>
                    )} />
                    <FormField control={form.control} name="targetAudience" render={({ field }) => (
                        <FormItem><FormLabel>Target Audience</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl><SelectContent><SelectItem value="Beginner">Beginner</SelectItem><SelectItem value="Intermediate">Intermediate</SelectItem><SelectItem value="Expert">Expert</SelectItem></SelectContent></Select><FormMessage /></FormItem>
                    )} />
                    <FormField control={form.control} name="tone" render={({ field }) => (
                        <FormItem><FormLabel>Tone</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl><SelectContent><SelectItem value="Academic">Academic</SelectItem><SelectItem value="Conversational">Conversational</SelectItem><SelectItem value="Technical">Technical</SelectItem></SelectContent></Select><FormMessage /></FormItem>
                    )} />
                    <FormField control={form.control} name="format" render={({ field }) => (
                        <FormItem><FormLabel>Format</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl><SelectContent><SelectItem value="Webinar">Webinar</SelectItem><SelectItem value="University Course">University Course</SelectItem><SelectItem value="E-Book">E-Book</SelectItem></SelectContent></Select><FormMessage /></FormItem>
                    )} />
                  </div>
                  <Button type="submit" disabled={isLoading}>
                    {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Generate Outline
                  </Button>
                </form>
              </Form>
              {isLoading && !courseOutline && (
                <div className="mt-6 space-y-4">
                  <Skeleton className="h-8 w-1/2" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-4/5" />
                  <Skeleton className="h-4 w-full" />
                </div>
              )}
              {courseOutline && (
                <Card className="mt-6">
                  <CardHeader><CardTitle>Generated Outline</CardTitle></CardHeader>
                  <CardContent><MarkdownDisplay content={courseOutline} /></CardContent>
                </Card>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="content">
            <Card>
                <CardHeader><CardTitle>AI Editing Suite</CardTitle><CardDescription>Refine your course content. Select a section to start editing with AI.</CardDescription></CardHeader>
                <CardContent>
                    <Accordion type="single" collapsible defaultValue="item-1">
                        <AccordionItem value="item-1">
                            <AccordionTrigger>Module 1: Introduction</AccordionTrigger>
                            <AccordionContent className="space-y-4">
                                <Textarea value={editedContent} onChange={(e) => setEditedContent(e.target.value)} className="min-h-[150px]" />
                                <div className="flex gap-2">
                                <Button onClick={() => handleEdit('Shorten this content')} disabled={isLoading}>Shorten</Button>
                                <Button onClick={() => handleEdit('Generate 3 quiz questions based on this content')} disabled={isLoading}>Generate Quiz</Button>
                                <Button onClick={() => handleEdit('Rewrite this in a more technical tone')} disabled={isLoading}>Make Technical</Button>
                                </div>
                            </AccordionContent>
                        </AccordionItem>
                        <AccordionItem value="item-2"><AccordionTrigger>Module 2: Core Concepts</AccordionTrigger><AccordionContent>Content for Module 2.</AccordionContent></AccordionItem>
                    </Accordion>
                </CardContent>
            </Card>
        </TabsContent>
        <TabsContent value="multimedia">
            <Card>
                <CardHeader><CardTitle>Multimedia Resource Curation</CardTitle><CardDescription>Generate relevant images and find videos for your lesson content.</CardDescription></CardHeader>
                <CardContent className="space-y-4">
                    <p className="text-sm text-muted-foreground">Using content from Module 1 editor.</p>
                    <Button onClick={handleFindMultimedia} disabled={isLoading}>
                        {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Suggest Multimedia
                    </Button>
                    
                    {isLoading && !multimedia && (
                        <div className="grid md:grid-cols-2 gap-6 mt-4">
                            <div><h3 className="font-headline text-lg mb-2">Images</h3><Skeleton className="h-40 w-full" /></div>
                            <div><h3 className="font-headline text-lg mb-2">Videos</h3><Skeleton className="h-40 w-full" /></div>
                        </div>
                    )}

                    {multimedia && (
                        <div className="grid md:grid-cols-2 gap-6 mt-4">
                            <div>
                                <h3 className="font-headline text-lg mb-2 flex items-center gap-2"><ImageIcon /> Suggested Images</h3>
                                <div className="grid grid-cols-2 gap-4">
                                    {multimedia.suggestedImages.map((img, i) => (
                                        <Card key={i}>
                                            <CardContent className="p-2">
                                                <Image src={img.url} alt={img.description} width={300} height={200} className="rounded-md object-cover aspect-video" unoptimized/>
                                                <p className="text-xs mt-2 text-muted-foreground">{img.description}</p>
                                            </CardContent>
                                        </Card>
                                    ))}
                                </div>
                            </div>
                            <div>
                                <h3 className="font-headline text-lg mb-2 flex items-center gap-2"><Video /> Suggested Videos</h3>
                                <div className="space-y-2">
                                    {multimedia.suggestedVideos.map((vid, i) => (
                                        <a key={i} href={vid.url} target="_blank" rel="noopener noreferrer" className="block p-3 bg-muted hover:bg-muted/80 rounded-md">
                                            <p className="font-semibold text-sm">{vid.title}</p>
                                            <p className="text-xs text-primary truncate">{vid.url}</p>
                                        </a>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}
                </CardContent>
            </Card>
        </TabsContent>
        <TabsContent value="export">
            <Card>
                <CardHeader><CardTitle>Export Course</CardTitle><CardDescription>Export your completed course in an LMS-compatible format.</CardDescription></CardHeader>
                <CardContent className="flex gap-4">
                    <Button onClick={() => alert('Exporting as SCORM package... (demo)')}><FileDown /> Export as SCORM</Button>
                    <Button onClick={() => alert('Exporting as HTML5 package... (demo)')}><FileDown /> Export as HTML5</Button>
                </CardContent>
            </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
