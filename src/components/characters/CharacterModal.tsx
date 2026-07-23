import { useMemo } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { getCharacter } from '../../data/characters'
import { EVENT_MAP } from '../../data/events'
import { FACTIONS, WARLORD_NAMES, getFactionColor, ERA_NAMES } from '../../data/factions'
import { SealStamp } from '../ui/SealStamp'
import { cn } from '../../utils/cn'

const TYPE_LABEL: Record<string, string> = {
  battle: '战', politics: '政', diplomacy: '交', death: '殁', founding: '立', strategy: '谋',
}

interface CharacterModalProps {
  characterId: string | null
  onClose: () => void
}

/** 人物详情弹窗（居中 modal） */
export function CharacterModal({ characterId, onClose }: CharacterModalProps) {
  const character = characterId ? getCharacter(characterId) : undefined

  const events = useMemo(() => {
    if (!character) return []
    return character.events
      .map((eid) => EVENT_MAP.get(eid))
      .filter((e): e is NonNullable<typeof e> => !!e)
      .sort((a, b) => a.year - b.year || (a.month ?? 13) - (b.month ?? 13) || a.chapter - b.chapter)
  }, [character])

  if (!character) return null

  const color = getFactionColor(character.faction, character.warlord)
  const factionName =
    character.faction === 'qunxiong' && character.warlord
      ? WARLORD_NAMES[character.warlord]
      : FACTIONS[character.faction].name

  return (
    <AnimatePresence>
      {characterId && (
        <>
          {/* 遮罩 */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-[70] bg-ink-950/80 backdrop-blur-sm"
          />
          {/* 弹窗 */}
          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: 24 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 12 }}
            transition={{ type: 'spring', damping: 28, stiffness: 350 }}
            className="fixed inset-x-4 top-[5vh] z-[71] mx-auto flex max-h-[90vh] max-w-2xl flex-col rounded-lg border border-ink-700/60 bg-ink-900/98 shadow-[0_24px_80px_-12px_rgba(0,0,0,0.9)] backdrop-blur-xl sm:inset-x-auto sm:left-1/2 sm:w-full sm:-translate-x-1/2"
          >
            {/* 关闭按钮：固定在弹窗右上角，不随内容滚动 */}
            <button
              onClick={onClose}
              className="absolute right-4 top-4 z-10 flex h-9 w-9 items-center justify-center rounded-full border border-ink-600/60 bg-ink-900/90 text-ink-300 transition-colors hover:border-cinnabar-500/60 hover:text-cinnabar-400"
              aria-label="关闭"
            >
              ✕
            </button>

            {/* 可滚动内容区 */}
            <div className="overflow-y-auto p-6 sm:p-8">

              {/* 头部 */}
              <div className="flex flex-col items-center text-center sm:flex-row sm:items-start sm:gap-6 sm:text-left">
                {character.portrait ? (
                  <div
                    className="relative h-24 w-24 shrink-0 overflow-hidden rounded-full border-2"
                    style={{ borderColor: `${color}80`, boxShadow: `0 0 20px ${color}25` }}
                  >
                    <img src={character.portrait} alt={character.name} className="h-full w-full object-cover" />
                    <div
                      className="pointer-events-none absolute inset-0 rounded-full"
                      style={{ boxShadow: `inset 0 0 16px 4px ${color}18` }}
                    />
                  </div>
                ) : (
                  <SealStamp text={character.name} color={color} size="lg" className="!w-24 !h-24 !text-2xl shrink-0" />
                )}

                <div className="mt-4 sm:mt-0">
                  <div className="flex flex-wrap items-baseline justify-center gap-3 sm:justify-start">
                    <h2 className="font-display text-4xl text-paper">{character.name}</h2>
                    {character.courtesyName && (
                      <span className="font-display text-lg text-ink-300">字{character.courtesyName}</span>
                    )}
                  </div>

                  <div className="mt-2.5 flex flex-wrap items-center justify-center gap-2 sm:justify-start">
                    <span
                      className="rounded-[2px] border px-2.5 py-0.5 text-xs"
                      style={{ color, borderColor: `${color}70`, background: `${color}10` }}
                    >
                      {factionName}
                    </span>
                    <span className="rounded-[2px] border border-ink-600/60 px-2.5 py-0.5 text-xs text-ink-300">
                      {character.role}
                    </span>
                    {(character.birthYear || character.deathYear) && (
                      <span className="text-xs text-ink-400">
                        {character.birthYear ? `${character.birthYear} — ` : '？ — '}
                        {character.deathYear ? `${character.deathYear}` : '？'}
                      </span>
                    )}
                  </div>

                  {character.deathCause && (
                    <p className="mt-2 text-xs text-ink-500">终：{character.deathCause}</p>
                  )}
                </div>
              </div>

              {/* 名言 */}
              {character.quote && (
                <blockquote
                  className="relative mt-6 border-l-2 py-1.5 pl-5"
                  style={{ borderColor: color }}
                >
                  <p className="font-display text-xl leading-relaxed text-ink-100 tracking-wider">
                    「{character.quote}」
                  </p>
                </blockquote>
              )}

              {/* 小传 */}
              <div className="mt-6">
                <h3 className="mb-3 font-display text-xl text-ink-200 tracking-[0.3em]">小传</h3>
                <p className="text-[14px] leading-[1.9] text-ink-200">{character.bio}</p>
              </div>

              {/* 生平大事 */}
              {events.length > 0 && (
                <div className="mt-8">
                  <h3 className="mb-4 font-display text-xl text-ink-200 tracking-[0.3em]">
                    生平大事 <span className="text-sm text-ink-500">（{events.length}）</span>
                  </h3>
                  <div className="relative ml-2 border-l border-ink-600/50 pl-5">
                    {events.map((e) => (
                      <div key={e.id} className="relative pb-5 last:pb-0">
                        <span
                          className="absolute -left-[27px] top-1.5 block h-2 w-2 rounded-full border-2"
                          style={{
                            borderColor: getFactionColor(e.faction, e.warlord),
                            background: e.significance === 3 ? getFactionColor(e.faction, e.warlord) : '#221d16',
                          }}
                        />
                        <p className="text-[11px] tracking-[0.15em] text-ink-500">
                          {e.year} 年{ERA_NAMES[e.year] ? ` · ${ERA_NAMES[e.year]}` : ''}
                        </p>
                        <div className="mt-0.5 flex items-center gap-2">
                          <span
                            className="flex h-4.5 w-4.5 items-center justify-center rounded-[2px] border font-display text-[10px]"
                            style={{
                              color: getFactionColor(e.faction, e.warlord),
                              borderColor: `${getFactionColor(e.faction, e.warlord)}60`,
                            }}
                          >
                            {TYPE_LABEL[e.type]}
                          </span>
                          <h4 className={cn('font-display text-paper', e.significance === 3 ? 'text-base' : 'text-sm')}>
                            {e.title}
                          </h4>
                        </div>
                        <p className="mt-0.5 text-[12px] leading-relaxed text-ink-400 line-clamp-2">{e.summary}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
