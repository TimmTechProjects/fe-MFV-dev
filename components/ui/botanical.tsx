import React from "react";
import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

// ============================================
// BOTANICAL DESIGN SYSTEM COMPONENTS
// ============================================

// Leaf SVG Icon for decorations
export const LeafIcon = ({ className, ...props }: React.SVGProps<SVGSVGElement>) => (
  <svg
    viewBox="0 0 24 24"
    fill="currentColor"
    className={cn("w-6 h-6", className)}
    {...props}
  >
    <path d="M17 8C8 10 5.9 16.17 3.82 21.34L5.71 22L6.66 19.7C7.14 19.87 7.64 20 8 20C19 20 22 3 22 3C21 5 14 5.25 9 6.25C4 7.25 2 11.5 2 13.5C2 15.5 3.75 17.25 3.75 17.25C7 8 17 8 17 8Z" />
  </svg>
);

// Sprout Icon
export const SproutIcon = ({ className, ...props }: React.SVGProps<SVGSVGElement>) => (
  <svg
    viewBox="0 0 24 24"
    fill="currentColor"
    className={cn("w-6 h-6", className)}
    {...props}
  >
    <path d="M12 22C12 17 14.5 14.5 14.5 14.5C14.5 14.5 12 13 12 9C12 5 15 2 15 2C15 2 9 4 9 9C9 12 10 14 10 14C10 14 8 16 8 18C8 20 9.5 21.5 12 22Z" />
    <path d="M12 22C12 17 9.5 14.5 9.5 14.5C9.5 14.5 12 13 12 9C12 5 9 2 9 2C9 2 15 4 15 9C15 12 14 14 14 14C14 14 16 16 16 18C16 20 14.5 21.5 12 22Z" opacity="0.6" />
  </svg>
);

// Botanical Card Component
interface BotanicalCardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "elevated" | "garden-bed";
  children: React.ReactNode;
}

export const BotanicalCard = ({
  variant = "default",
  className,
  children,
  ...props
}: BotanicalCardProps) => {
  const variants = {
    default: "garden-card",
    elevated: "garden-card shadow-lg shadow-[rgba(135,169,107,0.1)]",
    "garden-bed": "collection-bed",
  };

  return (
    <div className={cn(variants[variant], className)} {...props}>
      {children}
    </div>
  );
};

// Botanical Button
interface BotanicalButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "outline" | "ghost";
  size?: "sm" | "md" | "lg";
  icon?: LucideIcon;
}

export const BotanicalButton = ({
  variant = "primary",
  size = "md",
  icon: Icon,
  className,
  children,
  ...props
}: BotanicalButtonProps) => {
  const variants = {
    primary: "botanical-btn",
    outline: "botanical-btn botanical-btn-outline",
    ghost: "bg-transparent hover:bg-[rgba(135,169,107,0.1)] text-[var(--botanical-sage)] rounded-xl transition-all",
  };

  const sizes = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-4 py-2",
    lg: "px-6 py-3 text-lg",
  };

  return (
    <button
      className={cn(variants[variant], sizes[size], "inline-flex items-center gap-2", className)}
      {...props}
    >
      {Icon && <Icon className="w-4 h-4" />}
      {children}
    </button>
  );
};

// Botanical Input
interface BotanicalInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: LucideIcon;
}

export const BotanicalInput = React.forwardRef<HTMLInputElement, BotanicalInputProps>(
  ({ label, error, icon: Icon, className, ...props }, ref) => {
    return (
      <div className="space-y-2">
        {label && (
          <label className="block text-sm font-medium text-emerald-500">
            {label}
          </label>
        )}
        <div className="relative">
          {Icon && (
            <Icon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500" />
          )}
          <input
            ref={ref}
            className={cn(
              "botanical-input w-full",
              Icon && "pl-10",
              error && "border-red-500/50",
              className
            )}
            {...props}
          />
        </div>
        {error && <p className="text-sm text-red-400">{error}</p>}
      </div>
    );
  }
);
BotanicalInput.displayName = "BotanicalInput";

// Botanical Textarea
interface BotanicalTextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
}

export const BotanicalTextarea = React.forwardRef<HTMLTextAreaElement, BotanicalTextareaProps>(
  ({ label, error, className, ...props }, ref) => {
    return (
      <div className="space-y-2">
        {label && (
          <label className="block text-sm font-medium text-emerald-500">
            {label}
          </label>
        )}
        <textarea
          ref={ref}
          className={cn(
            "botanical-input w-full resize-none",
            error && "border-red-500/50",
            className
          )}
          {...props}
        />
        {error && <p className="text-sm text-red-400">{error}</p>}
      </div>
    );
  }
);
BotanicalTextarea.displayName = "BotanicalTextarea";

// Botanical Tag
interface BotanicalTagProps {
  children: React.ReactNode;
  onRemove?: () => void;
  variant?: "default" | "success" | "warning";
}

export const BotanicalTag = ({
  children,
  onRemove,
  variant = "default",
}: BotanicalTagProps) => {
  const variants = {
    default: "botanical-tag",
    success: "botanical-tag bg-emerald-600/20 border-emerald-600/30",
    warning: "botanical-tag bg-amber-500/15 border-amber-500/25 text-amber-500",
  };

  return (
    <span className={variants[variant]}>
      {children}
      {onRemove && (
        <button
          type="button"
          onClick={onRemove}
          className="ml-1 hover:text-red-400 transition-colors"
        >
          ×
        </button>
      )}
    </span>
  );
};

// Botanical Stat
interface BotanicalStatProps {
  value: string | number;
  label: string;
  icon?: LucideIcon;
}

export const BotanicalStat = ({ value, label, icon: Icon }: BotanicalStatProps) => (
  <div className="botanical-stat">
    {Icon && <Icon className="w-5 h-5 text-emerald-500 mb-1" />}
    <span className="botanical-stat-value">{value}</span>
    <span className="botanical-stat-label">{label}</span>
  </div>
);

// Botanical Section Header
interface BotanicalSectionHeaderProps {
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
}

export const BotanicalSectionHeader = ({
  title,
  subtitle,
  action,
}: BotanicalSectionHeaderProps) => (
  <div className="flex items-center justify-between mb-6">
    <div>
      <h2 className="text-xl font-semibold text-zinc-100 flex items-center gap-2">
        <LeafIcon className="w-5 h-5 text-emerald-500" />
        {title}
      </h2>
      {subtitle && (
        <p className="text-sm text-zinc-400 mt-1">{subtitle}</p>
      )}
    </div>
    {action}
  </div>
);

// Botanical Divider
export const BotanicalDivider = ({ children }: { children?: React.ReactNode }) => (
  <div className="botanical-divider my-6">
    {children && <LeafIcon className="w-4 h-4" />}
  </div>
);

// Botanical Progress Steps (for wizard)
interface Step {
  id: string;
  label: string;
}

interface BotanicalStepsProps {
  steps: Step[];
  currentStep: number;
}

export const BotanicalSteps = ({ steps, currentStep }: BotanicalStepsProps) => (
  <div className="flex items-center gap-2 flex-wrap">
    {steps.map((step, index) => {
      const isActive = index === currentStep;
      const isCompleted = index < currentStep;
      
      return (
        <React.Fragment key={step.id}>
          <div
            className={cn(
              "wizard-step",
              isActive && "active",
              isCompleted && "completed"
            )}
          >
            <span className="wizard-step-number">
              {isCompleted ? "✓" : index + 1}
            </span>
            <span className="text-sm font-medium">{step.label}</span>
          </div>
          {index < steps.length - 1 && (
            <div className="w-8 h-px bg-zinc-700" />
          )}
        </React.Fragment>
      );
    })}
  </div>
);

// Botanical Empty State
interface BotanicalEmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description: string;
  action?: React.ReactNode;
}

export const BotanicalEmptyState = ({
  icon,
  title,
  description,
  action,
}: BotanicalEmptyStateProps) => (
  <div className="flex flex-col items-center justify-center py-16 text-center">
    <div className="w-20 h-20 rounded-full bg-emerald-500/10 flex items-center justify-center mb-4">
      {icon || <SproutIcon className="w-10 h-10 text-emerald-500" />}
    </div>
    <h3 className="text-lg font-semibold text-zinc-100 mb-2">
      {title}
    </h3>
    <p className="text-zinc-400 max-w-sm mb-6">{description}</p>
    {action}
  </div>
);

// Botanical Avatar
interface BotanicalAvatarProps {
  src?: string;
  alt: string;
  fallback: string;
  size?: "sm" | "md" | "lg" | "xl";
}

export const BotanicalAvatar = ({
  src,
  alt,
  fallback,
  size = "md",
}: BotanicalAvatarProps) => {
  const sizes = {
    sm: "w-8 h-8 text-xs",
    md: "w-12 h-12 text-sm",
    lg: "w-16 h-16 text-base",
    xl: "w-24 h-24 text-xl",
  };

  return (
    <div
      className={cn(
        "rounded-full overflow-hidden border-2 border-emerald-600 flex items-center justify-center bg-zinc-900",
        sizes[size]
      )}
    >
      {src ? (
        <img src={src} alt={alt} className="w-full h-full object-cover" />
      ) : (
        <span className="font-semibold text-emerald-500">{fallback}</span>
      )}
    </div>
  );
};

// Leaf Decoration Component
interface LeafDecorationProps {
  position: "top-left" | "top-right" | "bottom-left" | "bottom-right";
  size?: "sm" | "md" | "lg";
}

export const LeafDecoration = ({ position, size = "md" }: LeafDecorationProps) => {
  const positions = {
    "top-left": "top-0 left-0 -translate-x-1/4 -translate-y-1/4 rotate-[-45deg]",
    "top-right": "top-0 right-0 translate-x-1/4 -translate-y-1/4 rotate-45deg",
    "bottom-left": "bottom-0 left-0 -translate-x-1/4 translate-y-1/4 rotate-[-135deg]",
    "bottom-right": "bottom-0 right-0 translate-x-1/4 translate-y-1/4 rotate-[135deg]",
  };

  const sizes = {
    sm: "w-16 h-16",
    md: "w-24 h-24",
    lg: "w-32 h-32",
  };

  return (
    <LeafIcon
      className={cn(
        "absolute opacity-[0.03] text-emerald-500 pointer-events-none",
        positions[position],
        sizes[size]
      )}
    />
  );
};
