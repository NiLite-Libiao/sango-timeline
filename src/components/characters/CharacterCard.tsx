import { motion } from 'framer-motion'
import type { Character } from '../../data/types'
import { getFactionColor, FACTIONS, WARLORD_NAMES } from '../../data/factions'

interface CharacterCardProps {
  character: Character
  index: number
  onSelect: (id: string) => void
  /** 搜索词，用于高亮匹配 */
  query?: string
}

/** 高亮匹配的子串 */
function Highlight({ text, query }: { text: string; query?: string }) {
  if (!query) return <>{text}</>
  const idx = text.toLowerCase().indexOf(query.toLowerCase())
  if (idx === -1) return <>{text}</>
  return (
    <>
      {text.slice(0, idx)}
      <mark className="rounded-[1px] bg-cinnabar-500/30 px-0.5 text-cinnabar-300">
        {text.slice(idx, idx + query.length)}
      </mark>
      {text.slice(idx + query.length)}
    </>
  )
}

/** 人物卡片：印章式头像 */
export function CharacterCard({ character, index, onSelect, query }: CharacterCardProps) {
  const color = getFactionColor(character.faction, character.warlord)
  const surname = character.name[0]

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.45, delay: (index % 8) * 0.05 }}
    >
      <button
        onClick={() => onSelect(character.id)}
        className="group ink-card block w-full rounded-sm p-4 text-left transition-all duration-300 hover:-translate-y-1 hover:bg-paper/[0.06] hover:shadow-[0_10px_30px_-12px_rgba(0,0,0,0.8)]"
      >
        <div className="flex items-center gap-4">
          {/* 头像：有 portrait 用图片，否则 fallback 印章 */}
          {character.portrait ? (
            <div
              className="relative h-14 w-14 shrink-0 overflow-hidden rounded-full border-2 transition-transform duration-300 group-hover:scale-105"
              style={{ borderColor: `${color}90`, boxShadow: `0 0 12px ${color}30` }}
            >
              <img
                src={character.portrait}
                alt={character.name}
                className="h-full w-full object-cover"
                loading="lazy"
              />
            </div>
          ) : (
            <span
              className="flex h-14 w-14 shrink-0 items-center justify-center rounded-[3px] border-2 font-display text-2xl transition-transform duration-300 group-hover:rotate-[-6deg] group-hover:scale-105"
              style={{
                color,
                borderColor: `${color}90`,
                background: `${color}10`,
                boxShadow: `inset 0 0 0 1px ${color}25`,
              }}
            >
              {surname}
            </span>
          )}

          <div className="min-w-0 flex-1">
            <div className="flex items-baseline gap-2">
              <h3 className="font-display text-xl text-paper transition-colors group-hover:text-cinnabar-400">
                <Highlight text={character.name} query={query} />
              </h3>
              {character.courtesyName && (
                <span className="text-xs text-ink-400">字<Highlight text={character.courtesyName} query={query} /></span>
              )}
            </div>
            <p className="mt-0.5 truncate text-[11px] text-ink-500">
              {character.faction === 'qunxiong' && character.warlord
                ? WARLORD_NAMES[character.warlord]
                : FACTIONS[character.faction].name}
              {' · '}{character.role}
              {character.deathYear && ` · 卒于${character.deathYear}年`}
            </p>
          </div>

          <span className="text-ink-600 transition-all duration-300 group-hover:translate-x-1 group-hover:text-cinnabar-400">
            →
          </span>
        </div>
      </button>
    </motion.div>
  )
}
