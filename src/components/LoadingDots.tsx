
import React from 'react';

const LoadingDots: React.FC = () => {
  return (
    <div className="flex items-center space-x-1">
      <div className="h-2 w-2 rounded-full bg-rag-blue animate-pulse-slow" />
      <div className="h-2 w-2 rounded-full bg-rag-blue animate-pulse-slow [animation-delay:200ms]" />
      <div className="h-2 w-2 rounded-full bg-rag-blue animate-pulse-slow [animation-delay:400ms]" />
    </div>
  );
};

export default LoadingDots;
