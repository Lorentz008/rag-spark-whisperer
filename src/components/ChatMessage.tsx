
import React from 'react';
import { format } from 'date-fns';
import { Bot, User } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Card } from '@/components/ui/card';

interface ChatMessageProps {
  message: string;
  isBot: boolean;
  timestamp: Date;
}

const ChatMessage: React.FC<ChatMessageProps> = ({ message, isBot, timestamp }) => {
  return (
    <div className={cn(
      "flex items-start space-x-4 group transition-opacity mb-6",
      isBot ? "" : "flex-row-reverse space-x-reverse"
    )}>
      <div className={cn(
        "rounded-full h-10 w-10 flex items-center justify-center text-white transition-all shadow-md",
        isBot ? "bg-gradient-to-br from-rag-blue to-rag-dark-blue" : "bg-gradient-to-br from-gray-600 to-gray-700 group-hover:from-gray-700 group-hover:to-gray-800"
      )}>
        {isBot ? <Bot className="h-5 w-5" /> : <User className="h-5 w-5" />}
      </div>
      <Card className={cn(
        "flex-1 p-5 max-w-[85%] transition-all border-0",
        isBot 
          ? "bg-white shadow-md hover:shadow-lg" 
          : "bg-gradient-to-r from-blue-50 to-blue-100 hover:from-blue-100 hover:to-blue-200"
      )}>
        <div className="text-sm text-gray-800 whitespace-pre-wrap leading-relaxed">{message}</div>
        <div className="mt-3 text-xs text-gray-500 flex items-center">
          {format(timestamp, 'h:mm a • MMM d, yyyy')}
        </div>
      </Card>
    </div>
  );
};

export default ChatMessage;
