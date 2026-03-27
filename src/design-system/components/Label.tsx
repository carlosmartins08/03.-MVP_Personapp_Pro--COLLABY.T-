import * as React from "react"

import { cn } from "@/lib/utils"
import { colors } from "../tokens"

interface LabelProps extends React.LabelHTMLAttributes<HTMLLabelElement> {
  required?: boolean
}

const Label = ({ children, required, className, ...props }: LabelProps) => {
  return (
    <label
      {...props}
      className={cn("text-xs font-medium uppercase tracking-wider", className)}
      style={{ color: colors.neutral[300] }}
    >
      {children}
      {required && <span className="ml-0.5 text-red-500">*</span>}
    </label>
  )
}

export { Label }
export type { LabelProps }
