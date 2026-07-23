import { useMemo, useState, useRef, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ALL_CHARACTERS } from '../../data/characters'
import type { FactionId } from '../../data/types'
import { FACTIONS, WARLORD_NAMES } from '../../data/factions'
import { CharacterCard } from './CharacterCard'
import { CharacterModal } from './CharacterModal'
import { cn } from '../../utils/cn'

const FILTERS: Array<{ id: FactionId | 'all'; label: string }> = [
  { id: 'all', label: '全部' },
  { id: 'wei', label: '曹魏' },
  { id: 'shu', label: '蜀汉' },
  { id: 'wu', label: '东吴' },
  { id: 'qunxiong', label: '群雄' },
  { id: 'han', label: '汉室' },
]

/** 构建单个人物的搜索索引字符串 */
function buildSearchIndex(c: (typeof ALL_CHARACTERS)[number]): string {
  const factionName = c.faction === 'qunxiong' && c.warlord
    ? WARLORD_NAMES[c.warlord]
    : FACTIONS[c.faction].name
  return [
    c.name,
    c.courtesyName ?? '',
    c.role,
    factionName,
    c.bio,
    c.id,
  ].join(' ').toLowerCase()
}

/** 预计算搜索索引 */
const SEARCH_INDEX: Map<string, string> = new Map(
  ALL_CHARACTERS.map((c) => [c.id, buildSearchIndex(c)])
)

/** 人物画廊页 */
export function CharacterGallery() {
  const [filter, setFilter] = useState<FactionId | 'all'>('all')
  const [query, setQuery] = useState('')
  const [selectedCharacter, setSelectedCharacter] = useState<string | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  // `/` 聚焦搜索框，Escape 清空
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === '/' && document.activeElement?.tagName !== 'INPUT') {
        e.preventDefault()
        inputRef.current?.focus()
      }
      if (e.key === 'Escape' && document.activeElement === inputRef.current) {
        setQuery('')
        inputRef.current?.blur()
      }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [])

  const characters = useMemo(() => {
    let list = filter === 'all' ? ALL_CHARACTERS : ALL_CHARACTERS.filter((c) => c.faction === filter)
    if (query.trim()) {
      const q = query.trim().toLowerCase()
      const terms = q.split(/\s+/)
      list = list.filter((c) => {
        const idx = SEARCH_INDEX.get(c.id)!
        return terms.every((t) => idx.includes(t))
      })
    }
    return [...list].sort((a, b) => (a.birthYear ?? 999) - (b.birthYear ?? 999))
  }, [filter, query])

  const handleClear = useCallback(() => {
    setQuery('')
    inputRef.current?.focus()
  }, [])

  return (
    <div className="mx-auto max-w-6xl px-4 pb-20 pt-28 sm:px-6">
      {/* 页头 */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="mb-10 text-center"
      >
        <p className="text-xs tracking-[0.5em] text-ink-400">滚滚长江东逝水 · 浪花淘尽英雄</p>
        <h1 className="mt-3 font-display text-5xl text-paper tracking-[0.25em]">人物志</h1>
        <p className="mt-3 text-sm text-ink-400">
          共收录 <span className="text-cinnabar-400 font-semibold">{ALL_CHARACTERS.length}</span> 位风云人物
        </p>
      </motion.div>

      {/* 搜索框 */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.15 }}
        className="mx-auto mb-8 max-w-md"
      >
        <div className="group relative">
          {/* 搜索图标 */}
          <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-500 transition-colors group-focus-within:text-cinnabar-400">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
          </span>
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="搜索姓名、字、角色…"
            className="w-full rounded-lg border border-ink-600/50 bg-ink-800/50 py-2.5 pl-10 pr-16 text-sm text-paper placeholder:text-ink-500 outline-none transition-all duration-300 focus:border-cinnabar-500/60 focus:bg-ink-800/80 focus:shadow-[0_0_0_3px_rgba(200,80,60,0.1)]"
          />
          {/* 右侧：快捷键提示 / 清空按钮 */}
          <div className="absolute right-3 top-1/2 -translate-y-1/2">
            {query ? (
              <button
                onClick={handleClear}
                className="flex h-6 w-6 items-center justify-center rounded-full text-ink-400 transition-colors hover:bg-ink-700/60 hover:text-paper"
                aria-label="清空搜索"
              >
                ✕
              </button>
            ) : (
              <kbd className="hidden rounded border border-ink-600/60 bg-ink-800/80 px-1.5 py-0.5 font-mono text-[10px] text-ink-500 sm:block">
                /
              </kbd>
            )}
          </div>
        </div>
      </motion.div>

      {/* 势力筛选 */}
      <div className="mb-6 flex flex-wrap items-center justify-center gap-2">
        {FILTERS.map((f) => (
          <button
            key={f.id}
            onClick={() => setFilter(f.id)}
            className={cn(
              'rounded-full border px-4 py-1.5 text-xs tracking-[0.2em] transition-all duration-300',
              filter === f.id
                ? 'border-cinnabar-500/70 bg-cinnabar-500/15 text-cinnabar-400'
                : 'border-ink-600/50 text-ink-400 hover:border-ink-400/60 hover:text-ink-200'
            )}
          >
            {f.label}
            {f.id !== 'all' && (
              <span className="ml-1.5 text-[10px] opacity-60">
                {ALL_CHARACTERS.filter((c) => c.faction === f.id).length}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* 结果计数 */}
      <AnimatePresence mode="wait">
        {query.trim() && (
          <motion.p
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mb-4 text-center text-xs text-ink-400"
          >
            找到 <span className="font-semibold text-cinnabar-400">{characters.length}</span> 人
            {characters.length === 0 && '，试试其他关键词？'}
          </motion.p>
        )}
      </AnimatePresence>

      {/* 人物网格 */}
      {characters.length > 0 ? (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {characters.map((c, i) => (
            <CharacterCard key={c.id} character={c} index={i} query={query.trim() || undefined} onSelect={(id) => setSelectedCharacter(id)} />
          ))}
        </div>
      ) : (
        /* 空状态 */
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex flex-col items-center justify-center py-24 text-center"
        >
          <span className="font-display text-6xl text-ink-700">无</span>
          <p className="mt-4 text-sm text-ink-400">
            未找到与「<span className="text-cinnabar-400">{query.trim()}</span>」匹配的人物
          </p>
          <button
            onClick={handleClear}
            className="mt-4 rounded-full border border-ink-600/50 px-4 py-1.5 text-xs text-ink-300 transition-colors hover:border-cinnabar-500/60 hover:text-cinnabar-400"
          >
            清空搜索
          </button>
        </motion.div>
      )}

      <CharacterModal characterId={selectedCharacter} onClose={() => setSelectedCharacter(null)} />
    </div>
  )
}
