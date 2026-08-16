import React from 'react';
import { Skeleton } from './Skeleton';

export const MenuCardSkeleton: React.FC = () => {
  return (
    <div className="bg-surface rounded-2xl overflow-hidden border border-border shadow-sm flex flex-col h-full">
      <Skeleton className="w-full aspect-video rounded-none" />
      <div className="p-4 flex-1 flex flex-col">
        <Skeleton className="h-5 w-3/4 mb-2" />
        <Skeleton className="h-4 w-1/4 mb-4" />
        <div className="mt-auto flex justify-between items-end">
          <Skeleton className="h-6 w-1/2" />
          <Skeleton className="h-8 w-1/3 rounded-full" />
        </div>
      </div>
    </div>
  );
};
