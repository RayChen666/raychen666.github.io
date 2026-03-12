'use client'
import { SynthwaveCanyonShader } from "@/components/SynthwaveCanyonShader"
import { useEffect, useState } from 'react'

export function HeroShaderBackground() {
  const [show, setShow] = useState(false)

  useEffect(() => {
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent)
    if (!isMobile) setShow(true)
  }, [])

  if (!show) return null

  return (
    <div style={{
      position: 'fixed',   // ← fixed instead of absolute
      inset: 0,            // ← covers full viewport
      //top: '-20%',
      //height: '150%',
      zIndex: 0,
      pointerEvents: 'none',
      //transform: 'translateY(10%) scale(1.2)',
      //transformOrigin: 'center center',
    }}>
      <SynthwaveCanyonShader 
        speed={0.3} 
        opacity={0.3}
        flightHeight={1.0}
        terrainDepth={24.0}
      />
    </div>
  )
}