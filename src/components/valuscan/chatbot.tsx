
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Cpu, User, Send, Loader2 } from 'lucide-react';
import { Textarea } from '../ui/textarea';
import { generateChatResponse } from '@/ai/flows/generate-chat-response';
import { ScrollArea } from '../ui/scroll-area';

type ConversationTurn = {
  speaker: 'bot' | 'user';
  text: string;
};

const WELCOME_MESSAGE = "Hi, I am ReFURRM Assist. You can ask me anything about the app, such as 'How do I use the pricing tool?' or 'What is the LEAN Foundation?'";

export function Chatbot() {
  const [history, setHistory] = useState<ConversationTurn[]>([]);
  const [currentQuery, setCurrentQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentQuery.trim() || isLoading) return;

    const userMessage = currentQuery;
    const newHistory = [...history, { speaker: 'user' as const, text: userMessage }];
    setHistory(newHistory);
    setCurrentQuery('');
    setIsLoading(true);

    try {
      const response = await generateChatResponse({
        history: newHistory,
        question: userMessage,
      });
      setHistory(prev => [...prev, { speaker: 'bot', text: response }]);
    } catch (error) {
      console.error("Chatbot Error:", error);
      setHistory(prev => [...prev, { speaker: 'bot', text: "Sorry, I encountered an error. Please try again." }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full shadow-2xl flex flex-col h-[70vh]">
      <CardContent className="p-6 flex-grow overflow-hidden">
        <ScrollArea className="h-full">
            <div className="space-y-4 pr-4">
            {/* Welcome Message */}
            <div className="flex items-start gap-3">
                <Avatar>
                <AvatarFallback><Cpu /></AvatarFallback>
                </Avatar>
                <div className="bg-muted rounded-lg p-3 max-w-[85%]">
                <p className="text-sm whitespace-pre-wrap">{WELCOME_MESSAGE}</p>
                </div>
            </div>
            {/* Conversation History */}
            {history.map((turn, index) => (
                <div key={index} className={`flex items-start gap-3 ${turn.speaker === 'user' ? 'justify-end' : ''}`}>
                {turn.speaker === 'bot' && (
                    <Avatar>
                    <AvatarFallback><Cpu /></AvatarFallback>
                    </Avatar>
                )}
                <div className={`${turn.speaker === 'user' ? 'bg-primary text-primary-foreground' : 'bg-muted'} rounded-lg p-3 max-w-[85%]`}>
                    <p className="text-sm whitespace-pre-wrap">{turn.text}</p>
                </div>
                {turn.speaker === 'user' && (
                    <Avatar>
                    <AvatarFallback><User /></AvatarFallback>
                    </Avatar>
                )}
                </div>
            ))}
            {isLoading && (
                 <div className="flex items-start gap-3">
                    <Avatar>
                        <AvatarFallback><Cpu /></AvatarFallback>
                    </Avatar>
                     <div className="bg-muted rounded-lg p-3 max-w-[85%]">
                        <div className="flex items-center gap-2">
                           <Loader2 className="h-4 w-4 animate-spin" />
                           <p className="text-sm">Thinking...</p>
                        </div>
                    </div>
                 </div>
            )}
            </div>
        </ScrollArea>
      </CardContent>
      
      <CardFooter className="p-4 border-t">
        <form onSubmit={handleSendMessage} className="flex w-full items-center gap-2">
            <Textarea
                placeholder="Ask me a question..."
                value={currentQuery}
                onChange={(e) => setCurrentQuery(e.target.value)}
                onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        handleSendMessage(e);
                    }
                }}
                className="min-h-0 h-10 resize-none"
                rows={1}
                disabled={isLoading}
            />
            <Button type="submit" disabled={isLoading || !currentQuery.trim()}>
                <Send className="mr-2 h-4 w-4" />
                Send
            </Button>
        </form>
      </CardFooter>
    </Card>
  );
}
