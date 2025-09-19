import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all duration-300 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
  {
    variants: {
      variant: {
        default:
          "bg-gradient-to-r from-violet-600 via-purple-600 to-pink-600 text-white shadow-lg hover:shadow-xl hover:shadow-violet-300/50 hover:from-violet-700 hover:via-purple-700 hover:to-pink-700 transform hover:scale-105",
        destructive:
          "bg-gradient-to-r from-red-500 to-pink-500 text-white shadow-lg hover:shadow-xl hover:shadow-red-300/50 hover:from-red-600 hover:to-pink-600 transform hover:scale-105",
        outline:
          "border-2 border-violet-300 bg-white/90 backdrop-blur-sm shadow-lg hover:bg-gradient-to-r hover:from-violet-50 hover:to-purple-50 hover:text-violet-700 hover:border-violet-400 hover:shadow-xl hover:shadow-violet-200/50",
        secondary:
          "bg-gradient-to-r from-slate-200 to-gray-200 text-slate-800 shadow-lg hover:from-slate-300 hover:to-gray-300 hover:shadow-xl hover:shadow-slate-300/50 transform hover:scale-105",
        ghost:
          "hover:bg-gradient-to-r hover:from-violet-100 hover:to-purple-100 hover:text-violet-700 hover:shadow-lg",
        link: "text-violet-600 underline-offset-4 hover:underline hover:text-violet-700",
        success:
          "bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-lg hover:shadow-xl hover:shadow-emerald-300/50 hover:from-emerald-600 hover:to-teal-600 transform hover:scale-105",
        warning:
          "bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-lg hover:shadow-xl hover:shadow-orange-300/50 hover:from-orange-600 hover:to-amber-600 transform hover:scale-105",
        info: "bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-lg hover:shadow-xl hover:shadow-blue-300/50 hover:from-blue-600 hover:to-cyan-600 transform hover:scale-105",
      },
      size: {
        default: "h-9 px-4 py-2 has-[>svg]:px-3",
        sm: "h-8 rounded-md gap-1.5 px-3 has-[>svg]:px-2.5",
        lg: "h-10 rounded-md px-6 has-[>svg]:px-4",
        icon: "size-9",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

function Button({ className, variant, size, asChild = false, ...props }) {
  const Comp = asChild ? Slot : "button";

  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  );
}

export { Button, buttonVariants };
