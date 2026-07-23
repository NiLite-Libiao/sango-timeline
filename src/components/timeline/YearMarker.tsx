import { motion } from 'framer-motion'
import { ERA_NAMES } from '../../data/factions'

interface YearMarkerProps {
  year: number
  /** 是否为该时代起始年（更大更醒目） */
  major?: boolean
}

/** 年份节点：公元 + 年号双纪年 */
export function YearMarker({ year, major }: YearMarkerProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.4 }}
      className="relative z-10 flex items-center justify-center"
    >
      <div
        className={
          major
            ? 'flex items-center gap-3 rounded-full border border-cinnabar-500/60 bg-ink-900 px-5 py-2 shadow-[0_0_24px_-6px_rgba(194,58,43,0.4)]'
            : 'flex items-center gap-2.5 rounded-full border border-ink-600/60 bg-ink-900 px-4 py-1.5'
        }
      >
        <span className={major ? 'font-body text-2xl font-medium text-cinnabar-400' : 'font-body text-lg text-paper'}>
          {year}
        </span>
        <span className="h-3 w-px bg-ink-600" />
        <span className={major ? 'text-xs tracking-widest text-ink-200' : 'text-[11px] tracking-widest text-ink-400'}>
          {ERA_NAMES[year] ?? '—'}
        </span>
      </div>
    </motion.div>
  )
}
