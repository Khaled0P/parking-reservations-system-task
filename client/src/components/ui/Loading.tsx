"use client";

import { Loader2 } from "lucide-react";

interface LoadingProps {
  title?: string;
}

export function Loading({ title }: LoadingProps) {
  return (
    <div className="flex flex-col items-center justify-center p-8 text-gray-700">
      <Loader2 className="h-8 w-8 animate-spin text-blue-600 mb-2" />
      {title && <p className="text-sm">{title}</p>}
    </div>
  );
}