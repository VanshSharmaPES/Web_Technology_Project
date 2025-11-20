interface BrowserFrameProps {
  children: React.ReactNode
  className?: string
}

export function BrowserFrame({ children, className = "" }: BrowserFrameProps) {
  return (
    <div className={`rounded-lg border bg-background shadow-lg  ${className}`}>
      <div className="border-b px-4 py-2 ">
        <div className="flex gap-1.5 ">
          <div className="h-3 w-3 rounded-full bg-red-500" />
          <div className="h-3 w-3 rounded-full bg-yellow-500" />
          <div className="h-3 w-3 rounded-full bg-green-500" />
        </div>
      </div>
      <div className="p-4">
        {children}
      </div>
    </div>
  )
}