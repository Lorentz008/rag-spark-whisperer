
import React from 'react';
import { cn } from '@/lib/utils';

const LoadingDots: React.FC = () => {
  return (
    <div className="flex items-center space-x-1.5">
      <div className="h-2.5 w-2.5 rounded-full bg-rag-blue animate-bounce [animation-delay:0ms] shadow-sm" />
      <div className="h-2.5 w-2.5 rounded-full bg-rag-blue animate-bounce [animation-delay:200ms] shadow-sm" />
      <div className="h-2.5 w-2.5 rounded-full bg-rag-blue animate-bounce [animation-delay:400ms] shadow-sm" />
    </div>
  );
};

export default LoadingDots;
