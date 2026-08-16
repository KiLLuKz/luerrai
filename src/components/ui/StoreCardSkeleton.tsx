import React from 'react';
import { Skeleton } from './Skeleton';

export const StoreCardSkeleton: React.FC = () => {
  return (
    <div className="bg-surface rounded-2xl p-5 border border-border shadow-sm flex justify-between items-center min-h-[90px]">
      <div className="flex-1 pr-4">
        <Skeleton className="h-6 sm:h-7 w-2/3 max-w-[200px] mb-3" />
        <Skeleton className="h-4 w-1/3 max-w-[100px]" />
      </div>
      <div className="shrink-0">
        <Skeleton className="h-8 w-8 rounded-full" />
      </div>
    </div>
  );
};
