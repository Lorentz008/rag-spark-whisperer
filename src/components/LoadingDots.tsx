
import React from 'react';
import { cn } from '@/lib/utils';

const LoadingDots: React.FC = () => {
  return (
    <div className="flex items-center space-x-2">
      <div className="h-3 w-3 rounded-full bg-gradient-to-r from-rag-blue to-rag-dark-blue animate-bounce [animation-delay:0ms] shadow-md" />
      <div className="h-3 w-3 rounded-full bg-gradient-to-r from-rag-blue to-rag-dark-blue animate-bounce [animation-delay:200ms] shadow-md" />
      <div className="h-3 w-3 rounded-full bg-gradient-to-r from-rag-blue to-rag-dark-blue animate-bounce [animation-delay:400ms] shadow-md" />
    </div>
  );
};

export default LoadingDots;
