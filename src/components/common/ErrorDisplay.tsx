import React from 'react';
import { AlertTriangle } from 'lucide-react';

interface ErrorDisplayProps {
  error: string;
}

export const ErrorDisplay: React.FC<ErrorDisplayProps> = ({ error }) => {
  if (!error) return null;

  return (
    <div className="p-3 bg-red-900/20 text-red-200 text-xs rounded border border-red-900/50 flex items-start gap-2">
      <AlertTriangle size={16} className="shrink-0 mt-0.5" />
      <div className="whitespace-pre-wrap">{error}</div>
    </div>
  );
};
