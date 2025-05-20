
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
      "flex items-start space-x-4 group transition-opacity",
      isBot ? "" : "flex-row-reverse space-x-reverse"
    )}>
      <div className={cn(
        "rounded-full h-8 w-8 flex items-center justify-center text-white transition-all shadow-sm",
        isBot ? "bg-rag-blue" : "bg-gray-600 group-hover:bg-gray-700"
      )}>
        {isBot ? <Bot className="h-4 w-4" /> : <User className="h-4 w-4" />}
      </div>
      <Card className={cn(
        "flex-1 p-4 max-w-[85%] transition-all",
        isBot ? "bg-white hover:shadow-md" : "bg-blue-50 hover:bg-blue-100"
      )}>
        <div className="text-sm text-gray-800 whitespace-pre-wrap leading-relaxed">{message}</div>
        <div className="mt-2 text-xs text-gray-400 flex items-center">
          {format(timestamp, 'h:mm a')}
        </div>
      </Card>
    </div>
  );
};

export default ChatMessage;
