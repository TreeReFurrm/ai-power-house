'use client';
import React, { useState, useEffect, useTransition } from 'react';
import { 
  PenTool, 
  Sparkles, 
  History, 
  Settings, 
  User, 
  Zap,
  Send,
  Type,
  Play,
  Copy
} from 'lucide-react';
import { refurrInk } from '@/ai/flows/refurr-ink-flow';
import { useToast } from '@/hooks/use-toast';

type HistoryItem = {
    id: number;
    text: string;
    prompt: string;
    timestamp: string;
}

export default function ReFURRMedInkPage() {
  const [showPricingModal, setShowPricingModal] = useState(false);
  const [inputText, setInputText] = useState('');
  const [outputContent, setOutputContent] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState('');
  const { toast } = useToast();
  
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [isPending, startTransition] = useTransition();


  const saveToHistory = (newText: string, promptLabel: string) => {
    const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const newHistoryItem: HistoryItem = {
      id: Date.now(),
      text: newText,
      prompt: promptLabel,
      timestamp: timestamp
    };
    const updatedHistory = [newHistoryItem, ...history];
    setHistory(updatedHistory);
    setHistoryIndex(0);
  };

  const handleGenerate = () => {
    if (!inputText.trim()) return;
    setIsGenerating(true);
    setLoadingMessage("Synthesizing...");

    startTransition(async () => {
        try {
            const result = await refurrInk({
                content: outputContent,
                instruction: inputText
            });
            setOutputContent(result.updatedContent);
            saveToHistory(result.updatedContent, inputText);
            setInputText('');
        } catch (e) {
            console.error(e);
            toast({ title: "Error", description: "Failed to generate content.", variant: "destructive" });
        } finally {
            setIsGenerating(false);
            setLoadingMessage('');
        }
    });
  };

  const handleAiAction = (actionType: 'reword' | 'enhance' | 'continue') => {
    if (!outputContent.trim()) return;

    let instruction = "";
    let label = "";

    if (actionType === 'reword') {
      setLoadingMessage("Rewording...");
      instruction = `Rewrite the following text to be more professional, concise, and impactful.`;
      label = "✨ Reword";
    } else if (actionType === 'enhance') {
      setLoadingMessage("Enhancing...");
      instruction = `Enhance the following text with more vivid vocabulary, better flow, and engaging tone. Fix any grammar issues.`;
      label = "✨ Enhance";
    } else if (actionType === 'continue') {
      setLoadingMessage("Continuing...");
      instruction = `Read the text and write the next logical section (2-3 paragraphs). Continue the style and tone perfectly. Return the original text followed by the new text.`;
      label = "✨ Continue";
    }
    
    setIsGenerating(true);
    startTransition(async () => {
        try {
            const result = await refurrInk({ content: outputContent, instruction });
            setOutputContent(result.updatedContent);
            saveToHistory(result.updatedContent, label);
        } catch (e) {
            console.error(e);
            toast({ title: "Error", description: `Failed to ${actionType} content.`, variant: "destructive" });
        } finally {
            setIsGenerating(false);
            setLoadingMessage('');
        }
    });
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
      } else if (historyIndex === history.length - 1 && history.length > 0) {
          setOutputContent('');
          setHistoryIndex(-1); 
      }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(outputContent);
    toast({ title: "Copied!", description: "Current output copied to clipboard." });
  };

  return (
    <div className="bg-obsidian-black text-off-white font-body selection:bg-aqua-pulse selection:text-obsidian-black flex flex-col h-[calc(100vh-4rem)] lg:h-[calc(100vh-5rem)] overflow-hidden -m-4 lg:-m-8">
      
      <nav className="border-b border-white/10 bg-obsidian-black/95 backdrop-blur-md px-6 py-4 flex items-center justify-between shrink-0 z-50">
        <div className="flex items-center gap-4">
          <div className="relative group cursor-pointer">
            <div className="absolute -inset-1 bg-aqua-pulse rounded-full opacity-20 group-hover:opacity-40 blur transition duration-500"></div>
            <PenTool className="relative w-8 h-8 text-aqua-pulse" fill="currentColor" />
          </div>
          <div className="flex flex-col">
            <h1 className="font-logo text-2xl font-extrabold tracking-tighter text-white uppercase leading-none">
              <span className="text-aqua-pulse">ReFURRMed</span> Ink
            </h1>
            <p className="font-body text-[10px] text-gray-400 italic tracking-widest uppercase mt-1">Ink with a pulse!</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10">
            <Zap className="w-3 h-3 text-yellow-400 fill-current" />
            <span className="text-xs font-mono text-gray-300">1,204 Credits</span>
          </div>
          <button
            onClick={() => setShowPricingModal(true)}
            className="px-4 py-1 text-xs font-bold rounded-full bg-aqua-pulse text-obsidian-black uppercase hover:shadow-[0_0_15px_rgba(0,240,255,0.5)] transition-all hover:scale-105 active:scale-95"
          >
            Upgrade
          </button>
          <button className="p-2 hover:bg-white/10 rounded-full transition-colors text-gray-400 hover:text-white">
            <User className="w-5 h-5" />
          </button>
        </div>
      </nav>

      <div className="flex-1 flex overflow-hidden">
        <aside className="w-16 border-r border-white/10 bg-obsidian-black flex flex-col items-center py-6 gap-6 shrink-0 z-40">
           <Tooltip text="✨ Reword">
            <button 
                onClick={() => handleAiAction('reword')}
                disabled={!outputContent || isGenerating}
                className="p-3 rounded-xl hover:bg-white/10 text-aqua-pulse transition-all hover:scale-110 disabled:opacity-30 disabled:cursor-not-allowed"
            >
               <Type className="w-6 h-6" />
            </button>
           </Tooltip>
           <Tooltip text="✨ Enhance">
            <button 
                onClick={() => handleAiAction('enhance')}
                disabled={!outputContent || isGenerating}
                className="p-3 rounded-xl hover:bg-white/10 text-gray-400 hover:text-aqua-pulse transition-all hover:scale-110 disabled:opacity-30 disabled:cursor-not-allowed"
            >
               <Sparkles className="w-6 h-6" />
            </button>
           </Tooltip>
           <Tooltip text="✨ Continue Writing">
            <button 
                onClick={() => handleAiAction('continue')}
                disabled={!outputContent || isGenerating}
                className="p-3 rounded-xl hover:bg-white/10 text-gray-400 hover:text-aqua-pulse transition-all hover:scale-110 disabled:opacity-30 disabled:cursor-not-allowed"
            >
               <Play className="w-6 h-6" />
            </button>
           </Tooltip>
           <div className="w-8 h-[1px] bg-white/10 my-2"></div>
           <Tooltip text="Undo / History">
            <button 
                onClick={handleUndo}
                disabled={history.length < 2 && historyIndex === -1}
                className="p-3 rounded-xl hover:bg-white/10 text-gray-400 hover:text-aqua-pulse transition-all hover:scale-110 disabled:opacity-30"
            >
               <History className="w-6 h-6" />
            </button>
           </Tooltip>
           <div className="flex-1" />
           <Tooltip text="Settings">
            <button className="p-3 rounded-xl hover:bg-white/10 text-gray-500 hover:text-white transition-all">
               <Settings className="w-6 h-6" />
            </button>
           </Tooltip>
        </aside>

        <main className="flex-1 relative bg-canvas-black flex flex-col">
          <div className="flex-1 overflow-y-auto p-8 md:p-12 custom-scrollbar">
            <div className="max-w-3xl mx-auto space-y-8">
              {!outputContent && historyIndex === -1 ? (
                <div className="flex flex-col items-center justify-center h-full text-center opacity-40 mt-20">
                  <div className="w-24 h-24 rounded-full bg-white/5 flex items-center justify-center mb-6 animate-pulse-slow">
                    <PenTool className="w-10 h-10 text-gray-500" />
                  </div>
                  <h3 className="text-xl font-logo uppercase tracking-widest text-gray-500 mb-2">Universal Ink</h3>
                  <p className="font-mono text-sm text-gray-600 max-w-md">
                    Your blank canvas. Ask ReFURRMed Ink to write, edit, or create anything.
                  </p>
                </div>
              ) : (
                <div className="prose prose-invert max-w-none relative">
                  {(isGenerating || isPending) && (
                    <div className="absolute inset-0 bg-black/50 backdrop-blur-sm z-10 flex items-center justify-center rounded-lg">
                        <div className="flex flex-col items-center gap-3">
                            <div className="w-8 h-8 border-2 border-aqua-pulse border-t-transparent rounded-full animate-spin" />
                            <span className="text-aqua-pulse font-mono text-xs animate-pulse">{loadingMessage || 'Processing...'}</span>
                        </div>
                    </div>
                  )}
                  <div className="whitespace-pre-wrap font-mono text-sm md:text-base leading-relaxed text-gray-200">
                    {outputContent}
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="p-6 bg-obsidian-black border-t border-white/10 shrink-0">
            <div className="max-w-3xl mx-auto relative group">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-aqua-pulse to-deep-teal-byte rounded-2xl opacity-20 group-hover:opacity-40 blur transition duration-500"></div>
              <div className="relative bg-input-black rounded-xl flex flex-col md:flex-row items-end p-2 gap-2">
                <textarea
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleGenerate();
                    }
                  }}
                  placeholder={outputContent ? "Ask for changes (e.g. 'Make it funnier')..." : "Tell ReFURRMed Ink what to write..."}
                  className="w-full bg-transparent text-white placeholder-gray-600 resize-none outline-none p-3 h-20 md:h-14 custom-scrollbar font-mono text-sm"
                />
                <div className="flex items-center gap-2 pr-2 pb-1 w-full md:w-auto justify-between md:justify-end">
                   <div className="md:hidden text-xs text-gray-600 font-mono">
                      {inputText.length} chars
                   </div>
                   <button 
                    onClick={handleGenerate}
                    disabled={!inputText.trim() || isGenerating || isPending}
                    className="p-3 rounded-lg bg-aqua-pulse text-obsidian-black hover:bg-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                   >
                     {(isGenerating || isPending) ? (
                       <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin" />
                     ) : (
                       <Send className="w-5 h-5" fill="currentColor" />
                     )}
                   </button>
                </div>
              </div>
            </div>
            <div className="max-w-3xl mx-auto mt-3 flex justify-between items-center text-xs text-gray-600 font-mono">
              <div className="flex gap-4">
                <span className="hover:text-aqua-pulse cursor-pointer transition-colors">cmd+enter to send</span>
                <span className="hover:text-aqua-pulse cursor-pointer transition-colors">/ for commands</span>
              </div>
              <span className="opacity-50">Powered by Genkit</span>
            </div>
          </div>
        </main>

        <aside className="w-72 border-l border-white/10 bg-obsidian-black hidden xl:flex flex-col z-40">
          <div className="p-4 border-b border-white/10 flex justify-between items-center">
            <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest">History Log</h3>
            <span className="text-[10px] text-aqua-pulse bg-aqua-pulse/10 px-2 py-0.5 rounded-full border border-aqua-pulse/20">
               Live
            </span>
          </div>
          <div className="flex-1 overflow-y-auto p-2 space-y-1 custom-scrollbar">
             {history.length === 0 && (
                <div className="p-4 text-center">
                    <p className="text-xs text-gray-600 italic">No history yet.<br/>Generate something!</p>
                </div>
             )}
             {history.map((item, index) => (
               <div 
                key={item.id} 
                onClick={() => loadHistoryItem(item, index)}
                className={`p-3 rounded-lg cursor-pointer group transition-colors border border-transparent ${historyIndex === index ? 'bg-white/10 border-white/10' : 'hover:bg-white/5'}`}
               >
                 <div className="flex items-center justify-between mb-1">
                   <span className={`text-xs font-bold transition-colors ${historyIndex === index ? 'text-aqua-pulse' : 'text-gray-300 group-hover:text-white'}`}>
                    Version {history.length - index}
                   </span>
                   <span className="text-[10px] text-gray-600">{item.timestamp}</span>
                 </div>
                 <p className="text-[11px] text-gray-500 line-clamp-2">
                   {item.prompt}
                 </p>
               </div>
             ))}
          </div>
          <div className="p-4 border-t border-white/10">
             <button 
                onClick={handleCopy}
                className="w-full py-2 border border-white/10 rounded-lg text-xs font-mono text-gray-400 hover:text-white hover:border-aqua-pulse transition-colors flex items-center justify-center gap-2"
             >
               <Copy className="w-3 h-3" />
               Copy Current Output
             </button>
          </div>
        </aside>
      </div>

      {showPricingModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <div className="bg-modal-black border border-white/10 rounded-2xl w-full max-w-md p-6 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-aqua-pulse to-deep-teal-byte"></div>
            <button 
              onClick={() => setShowPricingModal(false)}
              className="absolute top-4 right-4 text-gray-500 hover:text-white"
            >
              ✕
            </button>
            
            <div className="text-center mb-8 mt-4">
              <h2 className="text-2xl font-logo uppercase text-white mb-2">Upgrade Status</h2>
              <p className="text-gray-400 text-sm">Unlock the full potential of your neural canvas.</p>
            </div>

            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-white/5 border border-aqua-pulse/30 flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-white">Pro License</h3>
                  <p className="text-xs text-gray-400">Unlimited generations & high-speed mode</p>
                </div>
                <div className="text-aqua-pulse font-mono text-xl">$15</div>
              </div>
              <div className="p-4 rounded-xl bg-white/5 border border-white/5 flex items-center justify-between opacity-50">
                <div>
                  <h3 className="font-bold text-white">Enterprise</h3>
                  <p className="text-xs text-gray-400">Custom fine-tuning & API access</p>
                </div>
                <div className="text-gray-400 font-mono text-xl">$99</div>
              </div>
            </div>

            <button className="w-full mt-8 py-3 rounded-lg bg-aqua-pulse text-obsidian-black font-bold uppercase tracking-wider hover:bg-white transition-colors">
              Confirm Upgrade
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function Tooltip({ children, text }: { children: React.ReactNode, text: string }) {
    return (
        <div className="relative group">
            {children}
            <div className="absolute left-14 top-1/2 -translate-y-1/2 px-2 py-1 bg-gray-800 text-xs text-white rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-50 border border-white/10">
                {text}
            </div>
        </div>
    )
}
