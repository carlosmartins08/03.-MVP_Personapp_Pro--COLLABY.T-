import * as React from "react"

import { cn } from "@/lib/utils"

const Skeleton = ({ className }: { className?: string }) => (
  <div className={cn("animate-pulse bg-neutral-100 rounded-lg", className)} />
)

const SkeletonText = ({ className }: { className?: string }) => (
  <Skeleton className={cn("h-4 w-full rounded-md", className)} />
)

const SkeletonCard = ({ className }: { className?: string }) => (
  <Skeleton className={cn("h-24 w-full rounded-lg", className)} />
)

const SkeletonAvatar = ({ className }: { className?: string }) => (
  <Skeleton className={cn("h-10 w-10 rounded-full", className)} />
)

export { Skeleton, SkeletonText, SkeletonCard, SkeletonAvatar }
