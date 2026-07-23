import { FACTIONS } from '../../data/factions'
import type { FactionId } from '../../data/types'
import { cn } from '../../utils/cn'

interface FactionFilterProps {
  active: Set<FactionId>
  onToggle: (id: FactionId) => void
}

const ORDER: FactionId[] = ['han', 'qunxiong', 'wei', 'shu', 'wu']

/** 势力筛选条 */
export function FactionFilter({ active, onToggle }: FactionFilterProps) {
  return (
    <div className="flex flex-wrap items-center justify-center gap-2">
      {ORDER.map((id) => {
        const f = FACTIONS[id]
        const isOn = active.has(id)
        return (
          <button
            key={id}
            onClick={() => onToggle(id)}
            className={cn(
              'flex items-center gap-2 rounded-full border px-3.5 py-1.5 text-xs tracking-widest transition-all duration-300',
              isOn
                ? 'border-transparent text-ink-950'
                : 'border-ink-600/50 text-ink-400 hover:border-ink-400/60 hover:text-ink-200'
            )}
            style={isOn ? { background: f.color } : undefined}
          >
            <span
              className={cn('h-2 w-2 rounded-full transition-colors', !isOn && 'opacity-40')}
              style={{ background: isOn ? '#191510' : f.color }}
            />
            {f.name}
          </button>
        )
      })}
    </div>
  )
}
