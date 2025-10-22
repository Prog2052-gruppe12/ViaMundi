import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva } from "class-variance-authority";

import { cn } from "@/utils/cn"

const buttonVariants = cva(
  "cursor-pointer inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full text-sm font-semibold transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] dark:aria-invalid:ring-destructive/40",
  {
    variants: {
      variant: {
        default:
          "bg-gradient-primary hover:brightness-110 text-primary-foreground",
        destructive:
          "bg-destructive text-white shadow-xs hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/60",
        outline:
          "rounded-full bg-transparent border border-accent text-accent hover:brightness-110",
        secondary:
          "bg-gradient-secondary text-primary-foreground hover:brightness-140",
        ghost:
            "rounded-md hover:bg-accent",
        fake:
            "dark:hover:bg-accent/50 cursor-pointer font-medium",
        menu:
            "text-xl !h-8 !w-8 hover:bg-accent/20",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        fake: "h-10 px-7 py-2.5 has-[>svg]:px-3",
        default: "h-10 px-7 py-2.5 has-[>svg]:px-5",
        sm: "h-8 gap-1.5 px-4 has-[>svg]:px-2.5",
        lg: "h-10 rounded-md px-6 has-[>svg]:px-4",
        icon: "size-9",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}) {
  const Comp = asChild ? Slot : "button"

  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props} />
  );
}

export { Button, buttonVariants }
