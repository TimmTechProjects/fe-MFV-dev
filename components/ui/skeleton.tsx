import { cn } from "@/lib/utils";

function Skeleton({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      className={cn("animate-pulse rounded-md bg-gradient-to-r from-gray-800 via-gray-700 to-gray-800 bg-[length:200%_100%]", className)}
      style={{ animation: 'shimmer 1.5s ease-in-out infinite' }}
      {...props}
    />
  );
}

function SkeletonText({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <Skeleton
      className={cn("h-4 w-full rounded", className)}
      {...props}
    />
  );
}

function SkeletonAvatar({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <Skeleton
      className={cn("h-12 w-12 rounded-full", className)}
      {...props}
    />
  );
}

function SkeletonCard({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <Skeleton
      className={cn("h-48 w-full rounded-2xl", className)}
      {...props}
    />
  );
}

function SkeletonImage({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <Skeleton
      className={cn("h-48 w-full rounded-lg", className)}
      {...props}
    />
  );
}

export { Skeleton, SkeletonText, SkeletonAvatar, SkeletonCard, SkeletonImage };
