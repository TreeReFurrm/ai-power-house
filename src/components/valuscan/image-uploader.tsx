'use client';
import { useState, useRef, ChangeEvent, useCallback, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Camera, X, Upload, Loader2, Sparkles } from 'lucide-react';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

interface ImageUploaderProps {
  onImageUpload: (dataUri: string | null) => void;
  disabled?: boolean;
}

export function ImageUploader({ onImageUpload, disabled = false }: ImageUploaderProps) {
  const [preview, setPreview] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const fileToDataUri = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          resolve(event.target.result as string);
        } else {
          reject(new Error('Failed to read file.'));
        }
      };
      reader.onerror = (error) => reject(error);
      reader.readAsDataURL(file);
    });
  };

  const handleFileProcessing = useCallback(async (file: File) => {
    if (file.type && !file.type.startsWith('image/')) {
        toast({
            title: 'Invalid File',
            description: 'Please upload an image file.',
            variant: 'destructive',
        });
        return;
    }
    if (file.size > 5 * 1024 * 1024) { // 5MB limit
        toast({
            title: 'File Too Large',
            description: 'Please upload an image smaller than 5MB.',
            variant: 'destructive',
        });
        return;
    }

    try {
        const dataUri = await fileToDataUri(file);
        setPreview(dataUri);
        onImageUpload(dataUri);
    } catch (error) {
        console.error(error);
        toast({
            title: 'Upload Failed',
            description: 'Could not process the image file.',
            variant: 'destructive',
        });
    }
  }, [onImageUpload, toast]);


  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      handleFileProcessing(file);
    }
  };

  const handleRemoveImage = () => {
    setPreview(null);
    onImageUpload(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const triggerFileInput = () => {
    if (!disabled) {
      fileInputRef.current?.click();
    }
  };

  const handleDragEnter = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if(!disabled) setIsDragging(true);
  }, [disabled]);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDrop = useCallback(async (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    
    if (disabled) return;

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      await handleFileProcessing(file);
      e.dataTransfer.clearData();
    }
  }, [disabled, handleFileProcessing]);

  const dropZoneClasses = cn(
    "flex flex-col items-center justify-center p-10 text-center border-2 border-dashed rounded-lg transition-colors",
    disabled ? "cursor-not-allowed opacity-60" : "cursor-pointer",
    isDragging ? "border-primary bg-accent" : "border-border hover:border-primary/80 hover:bg-accent/50",
  );

  return (
    <div className="w-full max-w-md mx-auto">
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        className="hidden"
        accept="image/*"
        disabled={disabled}
      />
      {!preview ? (
         <div
            className={dropZoneClasses}
            onClick={triggerFileInput}
            onDragEnter={handleDragEnter}
            onDragLeave={handleDragLeave}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
        >
            <div className="flex flex-col items-center space-y-3">
                {disabled ? (
                    <Loader2 className="w-8 h-8 animate-spin text-primary" />
                ) : (
                    <Upload className="w-8 h-8 text-muted-foreground" />
                )}

                <p className="font-semibold text-lg">
                    {disabled ? "Analyzing Item..." : "Drag & Drop or Click"}
                </p>
                <p className="text-sm text-muted-foreground">
                    Upload an image to get an AI appraisal.
                </p>
            </div>
        </div>
      ) : (
        <div className="relative w-full aspect-square max-w-sm mx-auto">
          <Image
            src={preview}
            alt="Item preview"
            fill
            className="object-cover rounded-lg shadow-md"
          />
          <Button
            variant="destructive"
            size="icon"
            className="absolute top-2 right-2 rounded-full h-8 w-8"
            onClick={handleRemoveImage}
            disabled={disabled}
            aria-label="Remove image"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  );
}
