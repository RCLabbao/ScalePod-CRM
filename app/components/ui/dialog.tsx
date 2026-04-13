import * as React from "react";
import { cn } from "~/lib/utils";

// Simplified Dialog component (no radix dependency for portability)
interface DialogProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  children: React.ReactNode;
  className?: string;
}

function Dialog({ open, onOpenChange, children, className }: DialogProps) {
  // Separate trigger children from content children
  const childArray = React.Children.toArray(children);
  const trigger = childArray.find(
    (c) => React.isValidElement(c) && c.type === DialogTrigger
  );
  const content = childArray.filter(
    (c) => !(React.isValidElement(c) && c.type === DialogTrigger)
  );

  return (
    <>
      {trigger}
      {open && (
        <div className="fixed inset-0 z-50">
          <div
            className="fixed inset-0 bg-black/90"
            onClick={() => onOpenChange?.(false)}
          />
          <div className={cn("fixed left-1/2 top-1/2 z-50 w-full max-w-lg -translate-x-1/2 -translate-y-1/2", className)}>
            {content}
          </div>
        </div>
      )}
    </>
  );
}

const DialogContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, children, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        "grid w-full gap-4 rounded-lg border bg-background p-6 shadow-lg animate-in",
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
);
DialogContent.displayName = "DialogContent";

function DialogHeader({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn("flex flex-col space-y-1.5 text-center sm:text-left", className)} {...props} />
  );
}

function DialogTitle({ className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h2
      className={cn("text-lg font-semibold leading-none tracking-tight", className)}
      {...props}
    />
  );
}

function DialogTrigger({ children, asChild, ...props }: React.ButtonHTMLAttributes<HTMLButtonElement> & { asChild?: boolean; children: React.ReactNode }) {
  return <button {...props}>{children}</button>;
}

export { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger };
