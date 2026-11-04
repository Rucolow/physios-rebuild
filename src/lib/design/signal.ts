export type Signal = 'good' | 'watch' | 'act' | 'info' | 'none'

export const SIGNAL = {
  good: { dot: 'bg-emerald-400', face: 'bg-emerald-500/20', soft: 'bg-emerald-500/10', edge: 'border-emerald-500/30', text: 'text-emerald-400' },
  watch:{ dot: 'bg-amber-400',   face: 'bg-amber-500/20',   soft: 'bg-amber-500/10',   edge: 'border-amber-500/30',   text: 'text-amber-400'   },
  act:  { dot: 'bg-red-400',     face: 'bg-red-500/20',     soft: 'bg-red-500/10',     edge: 'border-red-500/30',     text: 'text-red-400'     },
  info: { dot: 'bg-blue-400',    face: 'bg-blue-500/20',    soft: 'bg-blue-500/10',    edge: 'border-blue-500/30',    text: 'text-blue-400'    },
  none: { dot: 'bg-navy-500', face: 'bg-layer-5', soft: 'bg-layer-3', edge: 'border-layer-10', text: 'text-navy-500' },
} as const
