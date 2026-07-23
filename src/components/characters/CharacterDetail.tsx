import { useMemo } from 'react'
import { motion } from 'framer-motion'
import { Link, useParams } from 'react-router-dom'
import { getCharacter } from '../../data/characters'
import { EVENT_MAP } from '../../data/events'
import { FACTIONS, WARLORD_NAMES, getFactionColor, ERA_NAMES } from '../../data/factions'
import { SealStamp } from '../ui/SealStamp'

const TYPE_LABEL: Record<string, string> = {
  battle: '战', politics: '政', diplomacy: '交', death: '殁', founding: '立', strategy: '谋',
}

/** 人物详情页 */
export function CharacterDetail() {
  const { id } = useParams<{ id: string }>()
  const character = id ? getCharacter(id) : undefined

  const events = useMemo(() => {
    if (!character) return []
    return character.events
      .map((eid) => EVENT_MAP.get(eid))
      .filter((e): e is NonNullable<typeof e> => !!e)
      .sort((a, b) => a.year - b.year || (a.month ?? 13) - (b.month ?? 13) || a.chapter - b.chapter)
  }, [character])

  if (!character) {
    return (
      <div className="flex min-h-[70vh] flex-col items-center justify-center gap-4 pt-16">
        <p className="font-display text-3xl text-ink-300">查无此人</p>
        <Link to="/characters" className="text-sm text-cinnabar-400 hover:underline">
          ← 返回人物志
        </Link>
      </div>
    )
  }

  const color = getFactionColor(character.faction, character.warlord)
  const factionName =
    character.faction === 'qunxiong' && character.warlord
      ? WARLORD_NAMES[character.warlord]
      : FACTIONS[character.faction].name

  return (
    <div className="mx-auto max-w-3xl px-4 pb-20 pt-28 sm:px-6">
      <Link
        to="/characters"
        className="inline-flex items-center gap-1 text-xs tracking-[0.2em] text-ink-400 transition-colors hover:text-cinnabar-400"
      >
        ← 人物志
      </Link>

      {/* 头部 */}
      <motion.header
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="mt-8 flex flex-col items-center text-center sm:flex-row sm:items-start sm:gap-8 sm:text-left"
      >
        {/* 头像：有 portrait 用图片，否则 fallback 大印章 */}
        {character.portrait ? (
          <div
            className="relative h-28 w-28 shrink-0 overflow-hidden rounded-full border-2"
            style={{ borderColor: `${color}80`, boxShadow: `0 0 24px ${color}25` }}
          >
            <img
              src={character.portrait}
              alt={character.name}
              className="h-full w-full object-cover"
            />
            {/* 水墨晕染边缘 */}
            <div
              className="pointer-events-none absolute inset-0 rounded-full"
              style={{ boxShadow: `inset 0 0 20px 6px ${color}18` }}
            />
          </div>
        ) : (
          <SealStamp text={character.name} color={color} size="lg" className="!w-28 !h-28 !text-3xl shrink-0" />
        )}

        <div className="mt-6 sm:mt-0">
          <div className="flex flex-wrap items-baseline justify-center gap-3 sm:justify-start">
            <h1 className="font-display text-5xl text-paper">{character.name}</h1>
            {character.courtesyName && (
              <span className="font-display text-xl text-ink-300">字{character.courtesyName}</span>
            )}
          </div>

          <div className="mt-3 flex flex-wrap items-center justify-center gap-2 sm:justify-start">
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
      </motion.header>

      {/* 名言 */}
      {character.quote && (
        <motion.blockquote
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.7 }}
          className="relative mt-10 border-l-2 py-2 pl-6"
          style={{ borderColor: color }}
        >
          <p className="font-display text-2xl leading-relaxed text-ink-100 tracking-wider">
            「{character.quote}」
          </p>
        </motion.blockquote>
      )}

      {/* 小传 */}
      <motion.section
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.6 }}
        className="mt-10"
      >
        <h2 className="mb-4 font-display text-2xl text-ink-200 tracking-[0.3em]">小传</h2>
        <p className="text-[15px] leading-[2] text-ink-200">{character.bio}</p>
      </motion.section>

      {/* 个人事件串 */}
      {events.length > 0 && (
        <section className="mt-12">
          <h2 className="mb-6 font-display text-2xl text-ink-200 tracking-[0.3em]">
            生平大事 <span className="text-sm text-ink-500">（{events.length}）</span>
          </h2>
          <div className="relative ml-2 border-l border-ink-600/50 pl-6">
            {events.map((e, i) => (
              <motion.div
                key={e.id}
                initial={{ opacity: 0, x: -12 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ duration: 0.4, delay: (i % 6) * 0.05 }}
                className="relative pb-7 last:pb-0"
              >
                {/* 节点 */}
                <span
                  className="absolute -left-[31px] top-1.5 block h-2.5 w-2.5 rounded-full border-2"
                  style={{
                    borderColor: getFactionColor(e.faction, e.warlord),
                    background: e.significance === 3 ? getFactionColor(e.faction, e.warlord) : '#221d16',
                  }}
                />
                <p className="text-[11px] tracking-[0.2em] text-ink-500">
                  {e.year} 年{ERA_NAMES[e.year] ? ` · ${ERA_NAMES[e.year]}` : ''}
                </p>
                <div className="mt-1 flex items-center gap-2">
                  <span
                    className="flex h-5 w-5 items-center justify-center rounded-[2px] border font-display text-[10px]"
                    style={{
                      color: getFactionColor(e.faction, e.warlord),
                      borderColor: `${getFactionColor(e.faction, e.warlord)}60`,
                    }}
                  >
                    {TYPE_LABEL[e.type]}
                  </span>
                  <h3 className="font-display text-base text-paper">
                    {e.title}
                  </h3>
                </div>
                <p className="mt-1 text-[13px] leading-relaxed text-ink-400 line-clamp-2">{e.summary}</p>
              </motion.div>
            ))}
          </div>
        </section>
      )}
    </div>
  )
}
