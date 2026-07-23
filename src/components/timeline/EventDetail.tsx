import { AnimatePresence, motion } from 'framer-motion'
import type { TimelineEvent } from '../../data/types'
import { FACTIONS, WARLORD_NAMES, getFactionColor, ERA_NAMES } from '../../data/factions'
import { getCharacter } from '../../data/characters'
import { EVENT_MAP, CONSEQUENCES_MAP } from '../../data/events'
import { SealStamp } from '../ui/SealStamp'

const TYPE_NAME: Record<TimelineEvent['type'], string> = {
  battle: '战役',
  politics: '政治',
  diplomacy: '外交',
  death: '人物',
  founding: '建国',
  strategy: '谋略',
}

interface EventDetailProps {
  event: TimelineEvent | null
  onClose: () => void
  onOpen: (id: string) => void
  onOpenCharacter: (id: string) => void
}

/** 事件详情侧滑面板 */
export function EventDetail({ event, onClose, onOpen, onOpenCharacter }: EventDetailProps) {
  return (
    <AnimatePresence>
      {event && (
        <>
          {/* 遮罩 */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-50 bg-ink-950/70 backdrop-blur-[2px]"
          />
          {/* 面板 */}
          <motion.aside
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="fixed right-0 top-0 z-50 h-full w-full max-w-md overflow-y-auto border-l border-ink-700/50 bg-ink-900/95 backdrop-blur-xl"
          >
            <div className="relative p-6 sm:p-8">
              {/* 关闭 */}
              <button
                onClick={onClose}
                className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full border border-ink-600/60 text-ink-300 transition-colors hover:border-cinnabar-500/60 hover:text-cinnabar-400"
                aria-label="关闭"
              >
                ✕
              </button>

              {/* 印章 */}
              <SealStamp
                text={FACTIONS[event.faction].shortName}
                color={getFactionColor(event.faction, event.warlord)}
                size="lg"
                animate
                className="mb-6"
              />

              {/* 时间 */}
              <p className="text-xs tracking-[0.25em] text-ink-400">
                公元 {event.year} 年{event.month ? ` · ${event.month} 月` : ''}
                {ERA_NAMES[event.year] && <span className="ml-2 text-ink-500">（{ERA_NAMES[event.year]}）</span>}
              </p>

              {/* 标题 */}
              <h2 className="mt-2 font-display text-3xl leading-tight text-paper">
                {event.title}
              </h2>

              {/* 标签 */}
              <div className="mt-3 flex flex-wrap items-center gap-2">
                <span
                  className="rounded-[2px] border px-2 py-0.5 text-[11px]"
                  style={{
                    color: getFactionColor(event.faction, event.warlord),
                    borderColor: `${getFactionColor(event.faction, event.warlord)}70`,
                  }}
                >
                  {event.faction === 'qunxiong' && event.warlord
                    ? WARLORD_NAMES[event.warlord]
                    : FACTIONS[event.faction].name}
                </span>
                <span className="rounded-[2px] border border-ink-600/60 px-2 py-0.5 text-[11px] text-ink-300">
                  {TYPE_NAME[event.type]}
                </span>
                {event.location && (
                  <span className="rounded-[2px] border border-ink-600/60 px-2 py-0.5 text-[11px] text-ink-300">
                    {event.location}
                  </span>
                )}
                <span className="rounded-[2px] border border-ink-600/60 px-2 py-0.5 text-[11px] text-ink-400">
                  第{event.chapter}回
                </span>
              </div>

              {/* 分隔 */}
              <div className="my-6 h-px bg-gradient-to-r from-cinnabar-500/50 via-ink-600/40 to-transparent" />

              {/* 详情 */}
              <p className="text-[15px] leading-[1.9] text-ink-200">{event.detail}</p>

              {/* 前情·后续 */}
              {(() => {
                const prereqs = (event.prerequisites ?? [])
                  .map((id) => EVENT_MAP.get(id))
                  .filter((e): e is TimelineEvent => !!e)
                const consequences = (CONSEQUENCES_MAP.get(event.id) ?? [])
                  .map((id) => EVENT_MAP.get(id))
                  .filter((e): e is TimelineEvent => !!e)
                if (prereqs.length === 0 && consequences.length === 0) return null
                return (
                  <div className="mt-8">
                    <h3 className="mb-3 font-display text-lg tracking-widest text-ink-300">前情·后续</h3>
                    <div className="space-y-2">
                      {prereqs.map((e) => (
                        <button
                          key={e.id}
                          onClick={() => onOpen(e.id)}
                          className="group flex w-full items-center gap-2.5 rounded-sm border border-ink-700/50 bg-ink-800/40 p-2.5 text-left transition-colors hover:border-cinnabar-500/50"
                        >
                          <span className="shrink-0 text-[11px] text-ink-500">前情</span>
                          <span className="min-w-0 flex-1 truncate text-sm text-paper group-hover:text-cinnabar-400 transition-colors">{e.title}</span>
                          <span className="shrink-0 text-[11px] text-ink-500">{e.year}年</span>
                        </button>
                      ))}
                      {consequences.map((e) => (
                        <button
                          key={e.id}
                          onClick={() => onOpen(e.id)}
                          className="group flex w-full items-center gap-2.5 rounded-sm border border-ink-700/50 bg-ink-800/40 p-2.5 text-left transition-colors hover:border-cinnabar-500/50"
                        >
                          <span className="shrink-0 text-[11px] text-ink-500">后续</span>
                          <span className="min-w-0 flex-1 truncate text-sm text-paper group-hover:text-cinnabar-400 transition-colors">{e.title}</span>
                          <span className="shrink-0 text-[11px] text-ink-500">{e.year}年</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )
              })()}

              {/* 关联人物 */}
              {event.characters.length > 0 && (
                <>
                  <h3 className="mt-8 mb-3 font-display text-lg text-ink-300 tracking-widest">相关人物</h3>
                  <div className="grid grid-cols-2 gap-2">
                    {event.characters.map((cid) => {
                      const ch = getCharacter(cid)
                      if (!ch) return null
                      return (
                        <button
                          key={cid}
                          onClick={() => onOpenCharacter(cid)}
                          className="group flex items-center gap-2.5 rounded-sm border border-ink-700/50 bg-ink-800/40 p-2.5 text-left transition-colors hover:border-cinnabar-500/50"
                        >
                          <span
                            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-[2px] border font-display text-sm"
                            style={{
                              color: getFactionColor(ch.faction, ch.warlord),
                              borderColor: `${getFactionColor(ch.faction, ch.warlord)}60`,
                            }}
                          >
                            {ch.name[0]}
                          </span>
                          <span className="min-w-0">
                            <span className="block truncate text-sm text-paper group-hover:text-cinnabar-400 transition-colors">
                              {ch.name}
                            </span>
                            <span className="block truncate text-[11px] text-ink-500">{ch.role}</span>
                          </span>
                        </button>
                      )
                    })}
                  </div>
                </>
              )}
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  )
}
