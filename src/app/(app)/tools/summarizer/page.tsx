'use client';

import { useState, useRef, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Image from 'next/image';
import { summarizeDocument } from '@/ai/flows/summarize-document';
import { extractTextFromImage } from '@/ai/flows/extract-text-from-image';
import { useToast } from '@/hooks/use-toast';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { Skeleton } from '@/components/ui/skeleton';
import { MarkdownDisplay } from '@/components/markdown-display';
import { Loader2, Camera, RefreshCcw } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

const formSchema = z.object({
  documentText: z.string().min(100, 'Please paste at least 100 characters to summarize.'),
});

type FormValues = z.infer<typeof formSchema>;

export default function SummarizerPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [summary, setSummary] = useState<string | null>(null);
  const [hasCameraPermission, setHasCameraPermission] = useState<boolean | null>(null);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const { toast } = useToast();
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const getCameraPermission = async () => {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        setHasCameraPermission(false);
        return;
      }
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } });
        setHasCameraPermission(true);

        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (error) {
        console.error('Error accessing camera:', error);
        setHasCameraPermission(false);
        toast({
          variant: 'destructive',
          title: 'Camera Access Denied',
          description: 'Please enable camera permissions in your browser settings to use this feature.',
        });
      }
    };

    getCameraPermission();

    return () => {
        if (videoRef.current && videoRef.current.srcObject) {
            const stream = videoRef.current.srcObject as MediaStream;
            stream.getTracks().forEach(track => track.stop());
        }
    }
  }, [toast]);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      documentText: '',
    },
  });

  const handleCapture = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const context = canvas.getContext('2d');
      if (context) {
        context.drawImage(video, 0, 0, video.videoWidth, video.videoHeight);
        const dataUri = canvas.toDataURL('image/jpeg');
        setCapturedImage(dataUri);
        handleOcr(dataUri);
      }
    }
  };

  const handleOcr = async (imageUri: string) => {
    setIsLoading(true);
    setSummary(null);
    form.reset({ documentText: '' });
    try {
        const result = await extractTextFromImage({ imageDataUri: imageUri });
        form.setValue('documentText', result.extractedText);
        toast({ title: "Text Extracted!", description: "Text from the image has been placed in the text area."});
    } catch (error) {
        console.error(error);
        toast({ title: 'Error', description: 'Failed to extract text from the image.', variant: 'destructive'});
    } finally {
        setIsLoading(false);
    }
  };


  const onSubmit = async (values: FormValues) => {
    setIsLoading(true);
    setSummary(null);
    try {
      const result = await summarizeDocument(values);
      setSummary(result.summary);
    } catch (error) {
      console.error(error);
      toast({
        title: 'Error',
        description: 'Failed to summarize the document. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-headline text-3xl font-bold">Fine-Print Summarizer</h1>
        <p className="text-muted-foreground">Make sense of complex documents. Paste text or use your camera to get a clear, concise summary.</p>
      </div>
      <Tabs defaultValue="text">
        <TabsList>
            <TabsTrigger value="text">Text Input</TabsTrigger>
            <TabsTrigger value="camera">Camera Input</TabsTrigger>
        </TabsList>
        <TabsContent value="text">
            <Card>
                <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)}>
                    <CardHeader>
                    <CardTitle>Document to Summarize</CardTitle>
                    </CardHeader>
                    <CardContent>
                    <FormField
                        control={form.control}
                        name="documentText"
                        render={({ field }) => (
                        <FormItem>
                            <FormLabel className="sr-only">Document Text</FormLabel>
                            <FormControl>
                            <Textarea placeholder="Paste your lengthy terms of service, legal agreements, or any other complex document here..." className="min-h-[250px] text-sm" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                        )}
                    />
                    </CardContent>
                    <CardFooter>
                    <Button type="submit" disabled={isLoading}>
                        {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Summarize
                    </Button>
                    </CardFooter>
                </form>
                </Form>
            </Card>
        </TabsContent>
        <TabsContent value="camera">
            <Card>
                <CardHeader>
                    <CardTitle>Capture Document</CardTitle>
                    <CardDescription>Position your document in the camera view and capture the image to extract text.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    {hasCameraPermission === false && (
                        <Alert variant="destructive">
                            <AlertTitle>Camera Access Required</AlertTitle>
                            <AlertDescription>
                                Please allow camera access in your browser to use this feature. You may need to refresh the page after granting permission.
                            </AlertDescription>
                        </Alert>
                    )}
                    <div className="grid md:grid-cols-2 gap-4">
                        <div className="relative aspect-video bg-muted rounded-md flex items-center justify-center">
                            {hasCameraPermission === null && <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />}
                            <video ref={videoRef} className="w-full aspect-video rounded-md" autoPlay muted playsInline />
                            <canvas ref={canvasRef} className="hidden" />
                            {capturedImage && (
                                <div className='absolute inset-0 flex items-center justify-center bg-background/80'>
                                    <p className='font-bold text-lg'>Text Extracted!</p>
                                </div>
                            )}
                        </div>
                        <div className="relative aspect-video bg-muted rounded-md flex items-center justify-center">
                            {capturedImage ? (
                                <Image src={capturedImage} alt="Captured document" layout="fill" className="object-contain rounded-md" />
                            ) : (
                                <p className="text-sm text-muted-foreground">Captured image preview</p>
                            )}
                        </div>
                    </div>
                </CardContent>
                <CardFooter className="gap-4">
                    <Button onClick={handleCapture} disabled={!hasCameraPermission || isLoading}>
                        <Camera className="mr-2 h-4 w-4" />
                        Capture
                    </Button>
                     <Button onClick={() => setCapturedImage(null)} variant="outline" disabled={!capturedImage}>
                        <RefreshCcw className="mr-2 h-4 w-4" />
                        Retake
                    </Button>
                </CardFooter>
            </Card>
        </TabsContent>
      </Tabs>
      
      {(isLoading || summary) && (
        <Card>
          <CardHeader>
            <CardTitle>Summary</CardTitle>
            <CardDescription>Here are the key points from your document.</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading && !summary && (
              <div className="space-y-2">
                <Skeleton className="h-4 w-4/5" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
              </div>
            )}
            {summary && <MarkdownDisplay content={summary} />}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
