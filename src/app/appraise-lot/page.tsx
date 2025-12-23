
'use client';

import { useState }from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Sparkles, AlertCircle, Eye, EyeOff } from 'lucide-react';
import { appraiseLot, type AppraiseLotOutput } from '@/ai/flows/appraise-lot-flow';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ScrollArea } from '@/components/ui/scroll-area';

// A simplified multi-image uploader for this specific use case
function MultiImageUploader({ onUpload, disabled }: { onUpload: (dataUris: string[]) => void, disabled?: boolean }) {
    const [previews, setPreviews] = useState<string[]>([]);
    const { toast } = useToast();

    const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const files = event.target.files;
        if (!files || files.length === 0) return;

        if (files.length > 5) {
            toast({ title: "Too many files", description: "You can upload a maximum of 5 photos.", variant: "destructive" });
            return;
        }

        const dataUris: string[] = [];
        const filePromises = Array.from(files).map(file => {
            return new Promise<string>((resolve, reject) => {
                if (!file.type.startsWith('image/')) {
                    return reject(new Error(`File ${file.name} is not an image.`));
                }
                const reader = new FileReader();
                reader.onload = (e) => resolve(e.target?.result as string);
                reader.onerror = reject;
                reader.readAsDataURL(file);
            });
        });

        try {
            const loadedUris = await Promise.all(filePromises);
            setPreviews(loadedUris);
            onUpload(loadedUris);
        } catch (error: any) {
            toast({ title: "Upload Error", description: error.message, variant: "destructive" });
        }
    };

    return (
        <Card className="p-0">
            <div className="flex flex-col items-center justify-center p-6 text-center border-2 border-dashed rounded-lg" style={{borderColor: '#3A3A3A'}}>
                <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleFileChange}
                    className="w-full h-full absolute inset-0 opacity-0 cursor-pointer"
                    disabled={disabled}
                />
                <Sparkles className="w-8 h-8 text-muted-foreground" />
                <p className="font-semibold text-lg mt-2">Upload Auction Lot Photos</p>
                <p className="text-sm text-muted-foreground">Select up to 5 images</p>
            </div>
            {previews.length > 0 && (
                <div className="mt-4 grid grid-cols-3 sm:grid-cols-5 gap-2 p-4 pt-0">
                    {previews.map((src, i) => (
                        <img key={i} src={src} alt={`Preview ${i + 1}`} className="aspect-square w-full object-cover rounded-md" />
                    ))}
                </div>
            )}
        </Card>
    );
}


export default function BiddingToolPage() {
  const [photoDataUris, setPhotoDataUris] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<AppraiseLotOutput | null>(null);
  const { toast } = useToast();

  const handleAppraise = async () => {
    if (photoDataUris.length === 0) {
      toast({ title: 'No photos uploaded', description: 'Please upload at least one photo of the lot.', variant: 'destructive' });
      return;
    }
    setIsLoading(true);
    setResult(null);
    try {
      const output = await appraiseLot({ photoDataUris });
      setResult(output);
    } catch (error) {
      console.error('Appraisal failed:', error);
      toast({
        variant: 'destructive',
        title: 'Appraisal Failed',
        description: 'The AI could not process your request. Please try again.',
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleReset = () => {
    setPhotoDataUris([]);
    setResult(null);
    setIsLoading(false);
  }

  return (
    <div className="container mx-auto max-w-4xl py-8">
      {!result ? (
        <>
            <header className="text-center">
                <h1 className="page-title">Bidding Tool</h1>
                <p className="page-subtitle">
                    Upload photos of a storage unit to get an AI-powered valuation.
                </p>
            </header>
            <MultiImageUploader onUpload={setPhotoDataUris} disabled={isLoading} />
            <div className="mt-6 flex justify-center">
                <Button onClick={handleAppraise} disabled={isLoading || photoDataUris.length === 0} size="lg" className="btn-primary">
                    {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Sparkles className="mr-2 h-4 w-4" />}
                    {isLoading ? 'Analyzing Lot...' : 'Appraise Lot'}
                </Button>
            </div>
        </>
      ) : (
        <div className="space-y-6">
            <Card>
                <CardHeader className="text-center">
                    <CardTitle className="text-3xl font-bold tracking-tight text-primary">Appraisal Complete</CardTitle>
                    <CardDescription>
                        Based on the photos provided, here is the estimated resale value.
                    </CardDescription>
                </CardHeader>
                <CardContent className="text-center">
                    <p className="text-muted-foreground">Estimated Lot Value</p>
                    <p className="text-4xl sm:text-5xl font-extrabold text-primary">
                        ${result.estimatedLotValueMin.toFixed(0)} - ${result.estimatedLotValueMax.toFixed(0)}
                    </p>
                </CardContent>
            </Card>
            
            <Alert>
                <Eye className="h-4 w-4" />
                <AlertTitle>AI Summary & Assumptions</AlertTitle>
                <AlertDescription>
                    {result.appraisalSummary}
                </AlertDescription>
            </Alert>
            
            {result.potentialHiddenGems && result.potentialHiddenGems.length > 0 && (
                 <Alert variant="default" className="border-amber-500/50 bg-amber-500/10 text-amber-900 dark:text-amber-200">
                    <EyeOff className="h-4 w-4" />
                    <AlertTitle className="text-amber-900 dark:text-amber-200">Potential Hidden Gems</AlertTitle>
                    <AlertDescription>
                        The AI suspects there might be other valuable items. Look for:
                        <ul className="list-disc pl-5 mt-2">
                           {result.potentialHiddenGems.map((gem, i) => (
                               <li key={i}>{gem}</li>
                           ))}
                        </ul>
                    </AlertDescription>
                </Alert>
            )}

            <Card>
                <CardHeader>
                    <CardTitle>Identified Items</CardTitle>
                    <CardDescription>Major items identified by the AI that contribute to the total value.</CardDescription>
                </CardHeader>
                <CardContent>
                    <ScrollArea className="h-[300px]">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Item</TableHead>
                                    <TableHead>Est. Value</TableHead>
                                    <TableHead>Confidence / Notes</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {result.identifiedItems.map((item, index) => (
                                    <TableRow key={index}>
                                        <TableCell className="font-medium">{item.itemName}</TableCell>
                                        <TableCell>${item.estimatedValue.toFixed(2)}</TableCell>
                                        <TableCell className="text-muted-foreground">{item.confidence}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </ScrollArea>
                </CardContent>
            </Card>
            <div className="flex justify-center">
                 <Button onClick={handleReset} variant="outline" className="w-full max-w-xs">
                    Appraise Another Lot
                </Button>
            </div>
        </div>
      )}
    </div>
  );
}
