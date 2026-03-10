import { CSSProperties } from "react"

interface ShineBorderProps {
  shineColor?: string | string[]
  duration?: number
  borderWidth?: number
  className?: string
  style?: CSSProperties
}

export function ShineBorder({
  shineColor = "#5ba3c9",
  duration = 14,
  borderWidth = 1,
  className,
  style,
}: ShineBorderProps) {
  const colors = Array.isArray(shineColor) 
    ? shineColor.join(", ") 
    : shineColor

  return (
    <>
      <style>{`
        @keyframes shine-rotate {
          0%   { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
      <div
        className={className}
        style={{
          position: "absolute",
          inset: 0,
          borderRadius: "inherit",
          padding: `${borderWidth}px`,
          overflow: "hidden",
          pointerEvents: "none",
          zIndex: -1,
          
          ...style,
        }}
      >
        
        <div
          style={{
            position: "absolute",
            inset: "-1000%",
            background: ` conic-gradient(${colors},transparent, ${colors})`,
            
            animation: `shine-rotate ${duration}s linear infinite`,
          }}
        />
        
        <div
          style={{
            position: "absolute",
            inset: `${borderWidth}px`,
            borderRadius: "inherit",
            background: "var(--page-background, #0d1117)",
            
            //background: "var(--transparent)",
          }}
        />
        
        </div>
        
    </>
  )
}

