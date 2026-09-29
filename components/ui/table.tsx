import { cn } from "@/lib/utils"

// ============================================
// Table
// ============================================

interface TableProps extends React.HTMLAttributes<HTMLTableElement> {
  children: React.ReactNode
}

function Table({ className, children, ...props }: TableProps) {
  return (
    <table
      className={cn("w-full caption-side-top border-collapse", className)}
      {...props}
    >
      {children}
    </table>
  )
}

// ============================================
// TableHeader
// ============================================

interface TableHeaderProps extends React.HTMLAttributes<HTMLTableSectionElement> {
  children: React.ReactNode
}

function TableHeader({ className, children, ...props }: TableHeaderProps) {
  return (
    <thead className={cn("", className)} {...props}>
      {children}
    </thead>
  )
}

// ============================================
// TableBody
// ============================================

interface TableBodyProps extends React.HTMLAttributes<HTMLTableSectionElement> {
  children: React.ReactNode
}

function TableBody({ className, children, ...props }: TableBodyProps) {
  return (
    <tbody className={cn("", className)} {...props}>
      {children}
    </tbody>
  )
}

// ============================================
// TableRow
// ============================================

interface TableRowProps extends React.HTMLAttributes<HTMLTableRowElement> {
  children: React.ReactNode
}

function TableRow({ className, children, ...props }: TableRowProps) {
  return (
    <tr
      className={cn(
        "border-b border-[var(--border-light)] transition-colors hover:bg-muted/50",
        className
      )}
      {...props}
    >
      {children}
    </tr>
  )
}

// ============================================
// TableHead
// ============================================

interface TableHeadProps extends React.ThHTMLAttributes<HTMLTableCellElement> {
  children: React.ReactNode
}

function TableHead({ className, children, ...props }: TableHeadProps) {
  return (
    <th
      className={cn(
        "text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wide py-3 px-4 text-left border-b border-[var(--border-light)] bg-background sticky top-0 z-10",
        className
      )}
      {...props}
    >
      {children}
    </th>
  )
}

// ============================================
// TableCell
// ============================================

interface TableCellProps extends React.TdHTMLAttributes<HTMLTableCellElement> {
  children: React.ReactNode
}

function TableCell({ className, children, ...props }: TableCellProps) {
  return (
    <td
      className={cn(
        "py-2.5 px-4 text-[13px] border-b border-[var(--border-light)]",
        className
      )}
      {...props}
    >
      {children}
    </td>
  )
}

// ============================================
// TableCaption
// ============================================

interface TableCaptionProps extends React.HTMLAttributes<HTMLTableCaptionElement> {
  children: React.ReactNode
}

function TableCaption({ className, children, ...props }: TableCaptionProps) {
  return (
    <caption className={cn("text-[12px] text-[var(--text-muted)] mt-2", className)} {...props}>
      {children}
    </caption>
  )
}

export {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
  TableCaption,
}
