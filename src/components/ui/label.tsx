import { cn } from '@/utils/cn'

interface LabelProps extends React.LabelHTMLAttributes<HTMLLabelElement> {}

export function Label({ className, ...props }: LabelProps) {
  return (
    <label
      className={cn('block text-xs font-medium text-slate-600 mb-1', className)}
      {...props}
    />
  )
}
