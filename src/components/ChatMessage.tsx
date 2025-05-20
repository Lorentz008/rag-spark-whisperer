
import React, { useState } from 'react';
import { format } from 'date-fns';
import { Bot, User, Copy, CheckCheck } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Card } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';

interface ChatMessageProps {
  message: string;
  isBot: boolean;
  timestamp: Date;
}

const ChatMessage: React.FC<ChatMessageProps> = ({ message, isBot, timestamp }) => {
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();

  const handleCopyMessage = () => {
    navigator.clipboard.writeText(message);
    setCopied(true);
    toast({
      title: "Content copied to clipboard",
      description: "You can now paste it anywhere",
      duration: 2000,
    });
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div 
      className={cn(
        "flex items-start space-x-4 group transition-opacity mb-6 animate-fade-in",
        isBot ? "" : "flex-row-reverse space-x-reverse"
      )}
    >
      <div className={cn(
        "rounded-full h-10 w-10 flex items-center justify-center text-white transition-all shadow-md",
        isBot 
          ? "bg-gradient-to-br from-rag-blue to-rag-dark-blue ring-2 ring-rag-blue/20" 
          : "bg-gradient-to-br from-gray-600 to-gray-800 group-hover:from-gray-700 group-hover:to-gray-900"
      )}>
        {isBot ? <Bot className="h-5 w-5" /> : <User className="h-5 w-5" />}
      </div>
      <Card className={cn(
        "flex-1 p-5 max-w-[85%] transition-all border-0 relative group",
        isBot 
          ? "bg-white shadow-lg hover:shadow-xl" 
          : "bg-gradient-to-r from-blue-50 to-blue-100 hover:from-blue-100 hover:to-blue-200"
      )}>
        <div className="text-sm text-gray-800 whitespace-pre-wrap leading-relaxed">{message}</div>
        <div className="mt-3 text-xs text-gray-500 flex items-center justify-between">
          <span>{format(timestamp, 'h:mm a • MMM d, yyyy')}</span>
          
          {isBot && (
            <button 
              onClick={handleCopyMessage} 
              className="opacity-0 group-hover:opacity-100 transition-opacity text-gray-400 hover:text-rag-blue p-1 rounded-md"
              aria-label="Copy message"
            >
              {copied ? <CheckCheck className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
            </button>
          )}
        </div>
        {isBot && (
          <div className="absolute -left-1.5 top-5 h-3 w-3 bg-white rotate-45 shadow-sm"></div>
        )}
        {!isBot && (
          <div className="absolute -right-1.5 top-5 h-3 w-3 bg-blue-50 rotate-45 group-hover:bg-blue-100"></div>
        )}
      </Card>
    </div>
  );
};

export default ChatMessage;
