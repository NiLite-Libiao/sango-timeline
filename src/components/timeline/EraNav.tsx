import { ERAS } from '../../data/factions'
import { cn } from '../../utils/cn'

interface EraNavProps {
  activeEra: string
  onJump: (eraId: string) => void
}

/** 右侧时代快速导航 */
export function EraNav({ activeEra, onJump }: EraNavProps) {
  return (
    <nav className="fixed right-4 top-1/2 z-30 hidden -translate-y-1/2 xl:block" aria-label="时代导航">
      <div className="flex flex-col items-end gap-1 border-r border-ink-700/50 pr-3">
        {ERAS.map((era) => (
          <button
            key={era.id}
            onClick={() => onJump(era.id)}
            className={cn(
              'group flex items-center gap-2 py-1.5 transition-all duration-300',
              activeEra === era.id ? 'opacity-100' : 'opacity-45 hover:opacity-90'
            )}
            title={`${era.startYear}—${era.endYear} ${era.intro}`}
          >
            <span
              className={cn(
                'text-xs tracking-[0.2em] transition-colors',
                activeEra === era.id ? 'text-cinnabar-400 font-semibold' : 'text-ink-300 group-hover:text-ink-100'
              )}
            >
              {era.name}
            </span>
            <span
              className={cn(
                'h-1.5 w-1.5 rounded-full transition-all duration-300',
                activeEra === era.id ? 'bg-cinnabar-500 scale-125' : 'bg-ink-600 group-hover:bg-ink-400'
              )}
            />
          </button>
        ))}
      </div>
    </nav>
  )
}
