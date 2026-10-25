export default function Container({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <div className={`w-full px-4 sm:px-7 lg:px-10 xl:px-14 ${className}`}>{children}</div>;
}
