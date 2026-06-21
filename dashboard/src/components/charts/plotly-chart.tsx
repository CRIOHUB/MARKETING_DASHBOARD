'use client'
import { useEffect, useRef, useMemo } from 'react'
import { useTheme } from 'next-themes'

interface PlotlyChartProps {
  data: object[]
  layout?: object
  height?: number
  className?: string
}

export function PlotlyChart({ data, layout = {}, height = 300, className }: PlotlyChartProps) {
  const ref = useRef<HTMLDivElement>(null)
  const { resolvedTheme } = useTheme()
  const dark = resolvedTheme !== 'light'

  const baseLayout = useMemo(() => ({
    paper_bgcolor: 'rgba(0,0,0,0)',
    plot_bgcolor: dark ? 'rgba(255,255,255,.02)' : 'rgba(0,0,0,0)',
    font: {
      family: "'Inter', system-ui, sans-serif",
      size: 11,
      color: dark ? 'rgba(255,255,255,.5)' : 'rgba(0,0,0,.55)',
    },
    margin: { t: 18, b: 42, l: 52, r: 14 },
    xaxis: {
      showgrid: false, showline: false, zeroline: false,
      tickfont: { size: 10, color: dark ? 'rgba(255,255,255,.4)' : 'rgba(0,0,0,.4)' },
    },
    yaxis: {
      showgrid: true, showline: false, zeroline: false,
      gridcolor: dark ? 'rgba(255,255,255,.07)' : 'rgba(0,0,0,.06)',
      tickfont: { size: 10, color: dark ? 'rgba(255,255,255,.4)' : 'rgba(0,0,0,.4)' },
    },
    legend: {
      bgcolor: 'rgba(0,0,0,0)',
      font: { size: 10, color: dark ? 'rgba(255,255,255,.6)' : 'rgba(0,0,0,.6)' },
      orientation: 'h', y: -0.32, borderwidth: 0,
    },
    colorway: ['#5ED29C','#2563EB','#D97706','#EF4444','#7C3AED','#06B6D4','#16A34A','#F97316'],
    height,
    ...layout,
  }), [dark, height, JSON.stringify(layout)])

  const cfg = { responsive: true, displaylogo: false, displayModeBar: false }

  useEffect(() => {
    if (!ref.current) return
    let mounted = true
    import('plotly.js-dist-min').then((Plotly: any) => {
      if (!mounted || !ref.current) return
      Plotly.react(ref.current, data, baseLayout, cfg)
    })
    return () => {
      mounted = false
      import('plotly.js-dist-min').then((Plotly: any) => {
        try { if (ref.current) Plotly.purge(ref.current) } catch {}
      })
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(data), JSON.stringify(baseLayout)])

  return <div ref={ref} className={className} style={{ width: '100%', height }} />
}
