import { CSSProperties, ReactNode } from "react"

interface AuroraTextProps {
  children: ReactNode
  colors?: string[]
  speed?: number
  className?: string
  style?: CSSProperties
}

export function AuroraText({
  children,
  colors = ["#FF0080", "#7928CA", "#0070F3", "#38bdf8"],
  
  speed = 1,
  className,
  style,
}: AuroraTextProps) {
  const gradientColors = [...colors, colors[0]].join(", ")
  const duration = 6 / speed

  return (
    <>
      <style>{`
        @keyframes aurora-shift {
          0%   { background-position: 0% 50%; }
          50%  { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
      `}</style>
      <span
        className={className}
        style={{
          backgroundImage: `linear-gradient(135deg, ${gradientColors})`,
          backgroundSize: "300% 300%",
          backgroundClip: "text",
          WebkitBackgroundClip: "text",
          color: "transparent",
          animation: `aurora-shift ${duration}s ease infinite`,
          display: "inline",
          ...style,
        }}
      >
        {children}
      </span>
    </>
  )
}