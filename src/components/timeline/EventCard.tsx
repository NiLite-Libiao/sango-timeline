import { motion } from 'framer-motion'
import type { TimelineEvent } from '../../data/types'
import { getFactionColor } from '../../data/factions'
import { getCharacter } from '../../data/characters'
import { cn } from '../../utils/cn'

const TYPE_LABEL: Record<TimelineEvent['type'], string> = {
  battle: '战',
  politics: '政',
  diplomacy: '交',
  death: '殁',
  founding: '立',
  strategy: '谋',
}

interface EventCardProps {
  event: TimelineEvent
  onSelect: (event: TimelineEvent) => void
  onOpenCharacter?: (id: string) => void
  /** 布局方向（单轨区交替用） */
  align?: 'left' | 'right' | 'center'
  compact?: boolean
}

/** 事件卡片 */
export function EventCard({ event, onSelect, onOpenCharacter, align = 'center', compact }: EventCardProps) {
  const color = getFactionColor(event.faction, event.warlord)
  const isTurning = event.significance === 3

  return (
    <motion.article
      initial={{ opacity: 0, y: 24, filter: 'blur(4px)' }}
      whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
      onClick={() => onSelect(event)}
      className={cn(
        'group relative cursor-pointer ink-card rounded-sm p-4 transition-all duration-300',
        'hover:-translate-y-0.5 hover:bg-paper/[0.07]',
        'hover:shadow-[0_8px_30px_-12px_rgba(0,0,0,0.8)]',
        align === 'left' && 'text-right',
        compact && 'p-3'
      )}
      style={{ borderLeft: align !== 'left' ? `2px solid ${color}` : undefined, borderRight: align === 'left' ? `2px solid ${color}` : undefined }}
    >
      {/* 势力色光晕 */}
      <span
        className="pointer-events-none absolute inset-0 rounded-sm opacity-0 transition-opacity duration-500 group-hover:opacity-100"
        style={{ background: `radial-gradient(120px 60px at ${align === 'left' ? '100%' : '0%'} 0%, ${color}18, transparent)` }}
      />

      <div className={cn('flex items-start gap-3', align === 'left' && 'flex-row-reverse')}>
        {/* 事件类型印章 */}
        <span
          className={cn(
            'mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-[2px] border font-display text-xs transition-transform duration-300 group-hover:rotate-[-6deg]',
            isTurning && 'h-8 w-8 text-sm'
          )}
          style={{ color, borderColor: `${color}80`, background: `${color}12` }}
        >
          {TYPE_LABEL[event.type]}
        </span>

        <div className={cn('min-w-0 flex-1', align === 'left' && 'text-right')}>
          <div className={cn('flex items-baseline gap-2 flex-wrap', align === 'left' && 'flex-row-reverse')}>
            <h3
              className="font-display text-lg leading-snug text-paper transition-colors duration-300 group-hover:text-cinnabar-400"
            >
              {event.title}
            </h3>
            {event.location && !compact && (
              <span className="text-[11px] text-ink-400 tracking-wider">· {event.location}</span>
            )}
          </div>

          {!compact && (
            <p className="mt-1.5 text-left text-[13px] leading-relaxed text-ink-300 line-clamp-2">
              {event.summary}
            </p>
          )}

          {/* 关联人物 */}
          {!compact && event.characters.length > 0 && (
            <div className={cn('mt-2.5 flex flex-wrap gap-1.5', align === 'left' && 'justify-end')}>
              {event.characters.slice(0, 4).map((cid) => {
                const ch = getCharacter(cid)
                if (!ch) return null
                return (
                  <button
                    key={cid}
                    onClick={(e) => { e.stopPropagation(); onOpenCharacter?.(cid) }}
                    className="rounded-[2px] border border-ink-600/60 px-1.5 py-0.5 text-[11px] text-ink-300 transition-colors duration-200 hover:border-cinnabar-500/60 hover:text-cinnabar-400"
                  >
                    {ch.name}
                  </button>
                )
              })}
              {event.characters.length > 4 && (
                <span className="px-1 py-0.5 text-[11px] text-ink-500">+{event.characters.length - 4}</span>
              )}
            </div>
          )}
        </div>
      </div>

      {/* 回目 */}
      <span className="absolute bottom-1.5 right-2 text-[10px] text-ink-600 font-display">
        卷{event.chapter}
      </span>
    </motion.article>
  )
}
