import React from "react";

interface SkeletonProps {
  className?: string;
}

export const Skeleton: React.FC<SkeletonProps> = ({ className = "" }) => (
  <div className={`animate-pulse bg-gray-200/80 rounded-md ${className}`} />
);

export const ProductCardSkeleton: React.FC = () => (
  <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
    <Skeleton className="aspect-square rounded-none" />
    <div className="p-3.5 border-t border-gray-100">
      <Skeleton className="h-4 w-3/4" />
    </div>
  </div>
);

export const ProductGridSkeleton: React.FC<{ count?: number }> = ({ count = 8 }) => (
  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 md:gap-7 w-full">
    {Array.from({ length: count }).map((_, i) => (
      <ProductCardSkeleton key={i} />
    ))}
  </div>
);
