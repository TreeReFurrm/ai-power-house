'use client';

import React, { useState, useEffect, useRef } from 'react';
import {
  PenTool,
  Sparkles,
  Play,
  Copy,
  History,
  Send,
  Type,
  Loader2,
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { novelCoWriter, NovelCoWriterInput } from '@/ai/flows/novel-co-writer-flow';
import { MarkdownDisplay } from '@/components/markdown-display';
import { cn } from '@/lib/utils';


type HistoryItem = {
  id: number;
  text: string;
  prompt: string;
  timestamp: string;
};

export default function NovelCoWriterPage() {
  const [inputText, setInputText] = useState('');
  const [outputContent, setOutputContent] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState('');
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const { toast } = useToast();
  const outputRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (outputRef.current) {
        outputRef.current.scrollTop = outputRef.current.scrollHeight;
    }
  }, [outputContent]);

  const saveToHistory = (newText: string, promptLabel: string) => {
    const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const newHistoryItem: HistoryItem = {
      id: Date.now(),
      text: newText,
      prompt: promptLabel,
      timestamp: timestamp,
    };
    // If we are in the middle of history, truncate the future
    const newHistory = historyIndex > -1 ? history.slice(historyIndex) : history;
    const updatedHistory = [newHistoryItem, ...newHistory];
    setHistory(updatedHistory);
    setHistoryIndex(0); // Reset index to the latest item
  };

  const handleAiAction = async (task: NovelCoWriterInput['task'], instruction?: string) => {
    if (task !== 'generate' && !outputContent.trim()) {
        toast({ title: "Content Required", description: "There is no content to perform this action on.", variant: 'destructive'});
        return;
    };
    if (task === 'generate' && !instruction) return;

    setIsGenerating(true);

    const taskLabels: Record<NovelCoWriterInput['task'], string> = {
        generate: 'New Content',
        continue: 'Continue Writing',
        reword: 'Reword',
        enhance: 'Enhance'
    };
    
    setLoadingMessage(taskLabels[task] + '...');

    try {
      const result = await novelCoWriter({
        task,
        currentContent: outputContent,
        instruction: instruction || outputContent,
      });
      setOutputContent(result.generatedText);
      saveToHistory(result.generatedText, instruction || taskLabels[task]);
      if (task === 'generate') setInputText('');

    } catch (e: any) {
      console.error(e);
      toast({ title: "Error", description: e.message || 'An unexpected error occurred.', variant: 'destructive'});
    } finally {
      setIsGenerating(false);
      setLoadingMessage('');
    }
  };
  
  const loadHistoryItem = (item: HistoryItem, index: number) => {
      setOutputContent(item.text);
      setHistoryIndex(index);
  };

  const handleUndo = () => {
    if (history.length > 1 && historyIndex < history.length - 1) {
      const newIndex = historyIndex + 1;
      setHistoryIndex(newIndex);
      setOutputContent(history[newIndex].text);
    } else {
        toast({ title: "No more history", description: "You've reached the beginning of your session."})
    }
  };

  const handleCopy = () => {
    if (outputContent) {
      navigator.clipboard.writeText(outputContent);
      toast({ title: 'Copied!', description: 'Novel content copied to clipboard.' });
    }
  };

  const TooltipButton = ({
    onClick,
    disabled,
    tooltip,
    children,
    }: {
    onClick: () => void;
    disabled?: boolean;
    tooltip: string;
    children: React.ReactNode;
    }) => (
        <div className="relative group">
            <Button
                variant="ghost"
                size="icon"
                onClick={onClick}
                disabled={disabled}
                className="p-3 rounded-xl text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-all hover:scale-110 disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:scale-100"
            >
                {children}
            </Button>
            <div className="absolute left-14 top-1/2 -translate-y-1/2 px-2 py-1 bg-popover text-popover-foreground text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-50 border">
                {tooltip}
            </div>
        </div>
    );

  return (
    <div className="h-[calc(100vh-120px)] flex">
        {/* Sidebar Tools */}
        <aside className="w-16 border-r flex flex-col items-center py-6 gap-6 shrink-0 z-40">
           <TooltipButton tooltip="Reword" onClick={() => handleAiAction('reword')} disabled={isGenerating || !outputContent}>
               <Type className="w-6 h-6" />
           </TooltipButton>
           <TooltipButton tooltip="Enhance" onClick={() => handleAiAction('enhance')} disabled={isGenerating || !outputContent}>
               <Sparkles className="w-6 h-6" />
           </TooltipButton>
           <TooltipButton tooltip="Continue Writing" onClick={() => handleAiAction('continue')} disabled={isGenerating || !outputContent}>
               <Play className="w-6 h-6" />
           </TooltipButton>
           <div className="w-8 h-[1px] bg-border my-2"></div>
           <TooltipButton tooltip="Undo" onClick={handleUndo} disabled={history.length < 2 || historyIndex >= history.length - 1}>
               <History className="w-6 h-6" />
           </TooltipButton>
        </aside>

        {/* Central Canvas */}
        <main className="flex-1 relative flex flex-col">
          {/* Output / Editor Area */}
          <div ref={outputRef} className="flex-1 overflow-y-auto p-8 md:p-12 custom-scrollbar relative">
            <div className="max-w-3xl mx-auto min-h-full flex flex-col">
              {!outputContent ? (
                <div className="flex flex-col items-center justify-center text-center text-muted-foreground m-auto">
                  <div className="w-24 h-24 rounded-full bg-muted flex items-center justify-center mb-6 animate-pulse-slow">
                    <PenTool className="w-10 h-10" />
                  </div>
                  <h3 className="text-xl font-headline uppercase tracking-widest mb-2">Novel Co-writer</h3>
                  <p className="text-sm max-w-md">
                    Your blank canvas. Ask the AI to write, edit, or create anything for your story.
                  </p>
                </div>
              ) : (
                <div className="relative flex-1">
                  {isGenerating && (
                    <div className="absolute inset-0 bg-background/50 backdrop-blur-sm z-10 flex items-center justify-center rounded-lg">
                        <div className="flex flex-col items-center gap-3">
                            <Loader2 className="w-8 h-8 text-primary animate-spin" />
                            <span className="text-primary text-xs animate-pulse">{loadingMessage || 'Processing...'}</span>
                        </div>
                    </div>
                  )}
                  <MarkdownDisplay content={outputContent} className="prose prose-sm md:prose-base dark:prose-invert max-w-none" />
                </div>
              )}
            </div>
          </div>

          {/* Input Area */}
          <div className="p-6 bg-background border-t shrink-0">
            <div className="max-w-3xl mx-auto relative group">
              <div className="relative bg-background border rounded-xl flex flex-col md:flex-row items-end p-2 gap-2 focus-within:ring-2 focus-within:ring-ring">
                <Textarea
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleAiAction('generate', inputText);
                    }
                  }}
                  placeholder={outputContent ? "Ask for changes (e.g. 'Make the dialogue funnier')..." : "Tell the AI what to write..."}
                  className="w-full bg-transparent resize-none outline-none p-3 h-20 md:h-14 custom-scrollbar border-0 focus-visible:ring-0 focus-visible:ring-offset-0"
                />
                <div className="flex items-center gap-2 pr-2 pb-1 w-full md:w-auto justify-between md:justify-end">
                   <div className="md:hidden text-xs text-muted-foreground">
                      {inputText.length} chars
                   </div>
                   <Button 
                    onClick={() => handleAiAction('generate', inputText)}
                    disabled={!inputText.trim() || isGenerating}
                    size="icon"
                   >
                     {isGenerating ? (
                       <Loader2 className="w-5 h-5 animate-spin" />
                     ) : (
                       <Send className="w-5 h-5" />
                     )}
                   </Button>
                </div>
              </div>
            </div>
            <div className="max-w-3xl mx-auto mt-3 flex justify-between items-center text-xs text-muted-foreground">
                <span>Press <kbd className="px-2 py-1.5 text-xs font-semibold text-gray-800 bg-gray-100 border border-gray-200 rounded-lg">Cmd+Enter</kbd> to send</span>
                <span className="opacity-50">Powered by Genkit</span>
            </div>
          </div>
        </main>

        {/* Right Panel (History) */}
        <aside className="w-72 border-l bg-background hidden xl:flex flex-col z-40">
          <div className="p-4 border-b flex justify-between items-center">
            <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-widest">History Log</h3>
          </div>
          <div className="flex-1 overflow-y-auto p-2 space-y-1 custom-scrollbar">
             {history.length === 0 && (
                <div className="p-4 text-center">
                    <p className="text-xs text-muted-foreground italic">No history yet.<br/>Generate something!</p>
                </div>
             )}
             {history.map((item, index) => (
               <div 
                key={item.id} 
                onClick={() => loadHistoryItem(item, index)}
                className={cn("p-3 rounded-lg cursor-pointer group transition-colors border", 
                    historyIndex === index ? 'bg-muted border-border' : 'border-transparent hover:bg-muted/50'
                )}
               >
                 <div className="flex items-center justify-between mb-1">
                   <span className={cn(`text-xs font-bold transition-colors`, historyIndex === index ? 'text-primary' : 'text-foreground group-hover:text-foreground')}>
                    Version {history.length - index}
                   </span>
                   <span className="text-[10px] text-muted-foreground">{item.timestamp}</span>
                 </div>
                 <p className="text-[11px] text-muted-foreground line-clamp-2">
                   {item.prompt}
                 </p>
               </div>
             ))}
          </div>
          <div className="p-4 border-t">
             <Button
                variant="outline"
                onClick={handleCopy}
                className="w-full"
                disabled={!outputContent}
             >
               <Copy className="w-3 h-3 mr-2" />
               Copy Current Output
             </Button>
          </div>
        </aside>
    </div>
  );
}
