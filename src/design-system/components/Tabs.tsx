import * as React from "react"
import * as TabsPrimitive from "@radix-ui/react-tabs"

import { cn } from "@/lib/utils"
import { colors } from "../tokens"

const Tabs = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Root>
>(({ className, style, ...props }, ref) => {
  return (
    <TabsPrimitive.Root
      ref={ref}
      className={cn("w-full", className)}
      style={
        {
          "--ds-tabs-active": colors.primary[400],
          "--ds-tabs-inactive": colors.neutral[300],
          ...style,
        } as React.CSSProperties
      }
      {...props}
    />
  )
})
Tabs.displayName = TabsPrimitive.Root.displayName

const TabsList = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.List>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.List>
>(({ className, style, ...props }, ref) => {
  return (
    <TabsPrimitive.List
      ref={ref}
      className={cn("flex items-center gap-4 border-b", className)}
      style={{ borderBottomColor: colors.neutral[100], ...style }}
      {...props}
    />
  )
})
TabsList.displayName = TabsPrimitive.List.displayName

const TabsTrigger = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Trigger>
>(({ className, ...props }, ref) => {
  return (
    <TabsPrimitive.Trigger
      ref={ref}
      className={cn(
        "border-b-2 border-transparent pb-2 text-sm font-medium font-roboto text-[color:var(--ds-tabs-inactive)] transition-colors hover:text-[color:var(--ds-tabs-active)] data-[state=active]:border-[color:var(--ds-tabs-active)] data-[state=active]:text-[color:var(--ds-tabs-active)]",
        className
      )}
      {...props}
    />
  )
})
TabsTrigger.displayName = TabsPrimitive.Trigger.displayName

const TabsContent = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Content>
>(({ className, ...props }, ref) => {
  return (
    <TabsPrimitive.Content
      ref={ref}
      className={cn("pt-4", className)}
      {...props}
    />
  )
})
TabsContent.displayName = TabsPrimitive.Content.displayName

export { Tabs, TabsList, TabsTrigger, TabsContent }
