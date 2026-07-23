import { useMemo, useState, useEffect, useCallback } from 'react'
import { motion } from 'framer-motion'
import type { TimelineEvent, FactionId } from '../../data/types'
import { ALL_EVENTS, EVENT_MAP } from '../../data/events'
import { BRANCH_YEAR, ERAS, FACTIONS } from '../../data/factions'
import { EventCard } from './EventCard'
import { EventDetail } from './EventDetail'
import { CharacterModal } from '../characters/CharacterModal'
import { BranchPoint } from './BranchPoint'
import { YearMarker } from './YearMarker'
import { FactionFilter } from './FactionFilter'
import { EraNav } from './EraNav'
import { cn } from '../../utils/cn'

/** 卷首区 */
function Opening() {
  const verse = ['滚滚长江东逝水', '浪花淘尽英雄', '是非成败转头空', '青山依旧在', '几度夕阳红']
  return (
    <section className="relative flex min-h-[92vh] flex-col items-center justify-center overflow-hidden px-4 pt-16">
      {/* 顶部装饰横线 */}
      <motion.div
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ duration: 1.2, ease: 'easeOut' }}
        className="absolute top-24 h-px w-40 bg-gradient-to-r from-transparent via-cinnabar-500/60 to-transparent"
      />
      <motion.p
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.8 }}
        className="text-xs tracking-[0.5em] text-ink-400"
      >
        公元一八四 — 二八〇 · 据《三国演义》
      </motion.p>

      <motion.h1
        initial={{ opacity: 0, scale: 0.92, filter: 'blur(8px)' }}
        animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
        transition={{ delay: 0.35, duration: 1, ease: [0.22, 1, 0.36, 1] }}
        className="mt-6 font-display text-7xl sm:text-8xl md:text-9xl text-paper tracking-[0.15em]"
        style={{ textShadow: '0 0 60px rgba(194,58,43,0.25)' }}
      >
        三国<span className="text-cinnabar-500">·</span>演义
      </motion.h1>

      {/* 临江仙 逐句墨显 */}
      <div className="mt-10 space-y-2.5 text-center">
        {verse.map((line, i) => (
          <motion.p
            key={line}
            initial={{ opacity: 0, y: 14, filter: 'blur(4px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            transition={{ delay: 0.9 + i * 0.35, duration: 0.7 }}
            className={cn(
              'font-display tracking-[0.3em]',
              i === 0 ? 'text-xl text-ink-100' : 'text-base text-ink-300'
            )}
          >
            {line}
          </motion.p>
        ))}
      </div>

      {/* 下拉提示 */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.6, duration: 0.8 }}
        className="absolute bottom-10 flex flex-col items-center gap-2"
      >
        <span className="text-[11px] tracking-[0.4em] text-ink-500">向下滚动 · 入卷</span>
        <motion.span
          animate={{ y: [0, 8, 0] }}
          transition={{ repeat: Infinity, duration: 1.8, ease: 'easeInOut' }}
          className="block h-8 w-px bg-gradient-to-b from-cinnabar-500/70 to-transparent"
        />
      </motion.div>
    </section>
  )
}

/** 终章区 */
function Ending() {
  return (
    <motion.section
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 1 }}
      className="relative mx-auto max-w-2xl px-4 py-24 text-center"
    >
      <div className="mx-auto mb-8 h-px w-32 bg-gradient-to-r from-transparent via-cinnabar-500/60 to-transparent" />
      <h2 className="font-display text-4xl sm:text-5xl text-paper tracking-[0.2em]">
        天下大势
      </h2>
      <p className="mt-6 font-display text-2xl leading-relaxed text-ink-200 tracking-[0.25em]">
        合久必分，分久必合
      </p>
      <p className="mt-8 text-sm leading-loose text-ink-400">
        自公元一八四年黄巾起义，至二八〇年三分归晋，
        <br />
        九十六年间，英雄辈出，星汉灿烂。
        <br />
        是非成败转头空，青山依旧在，几度夕阳红。
      </p>
    </motion.section>
  )
}

function groupByYear(events: TimelineEvent[]): Map<number, TimelineEvent[]> {
  const map = new Map<number, TimelineEvent[]>()
  for (const e of events) {
    const arr = map.get(e.year) ?? []
    arr.push(e)
    map.set(e.year, arr)
  }
  return map
}

/** 主时间线视图 */
export function TimelineView() {
  const [selected, setSelected] = useState<TimelineEvent | null>(null)
  const [selectedCharacter, setSelectedCharacter] = useState<string | null>(null)
  const [activeFactions, setActiveFactions] = useState<Set<FactionId>>(
    () => new Set(['han', 'qunxiong', 'wei', 'shu', 'wu'])
  )
  const [activeEra, setActiveEra] = useState(ERAS[0].id)

  const toggleFaction = useCallback((id: FactionId) => {
    setActiveFactions((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }, [])

  const isVisible = useCallback(
    (e: TimelineEvent) => activeFactions.has(e.faction),
    [activeFactions]
  )

  const preByYear = useMemo(
    () => groupByYear(ALL_EVENTS.filter((e) => e.year < BRANCH_YEAR)),
    []
  )
  const postByYear = useMemo(
    () => groupByYear(ALL_EVENTS.filter((e) => e.year >= BRANCH_YEAR)),
    []
  )

  const preYears = useMemo(() => [...preByYear.keys()].sort((a, b) => a - b), [preByYear])
  const postYears = useMemo(() => [...postByYear.keys()].sort((a, b) => a - b), [postByYear])

  // 时代起始年集合（用于锚点）
  const eraStartYears = useMemo(() => new Map(ERAS.map((e) => [e.startYear, e.id])), [])

  // 滚动监听：检测当前时代
  useEffect(() => {
    const handler = () => {
      const probe = window.innerHeight * 0.4
      let current = ERAS[0].id
      for (const era of ERAS) {
        const el = document.getElementById(`era-${era.id}`)
        if (el && el.getBoundingClientRect().top <= probe) current = era.id
      }
      setActiveEra(current)
    }
    window.addEventListener('scroll', handler, { passive: true })
    handler()
    return () => window.removeEventListener('scroll', handler)
  }, [])

  const jumpToEra = useCallback((eraId: string) => {
    document.getElementById(`era-${eraId}`)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }, [])

  const threeTracks: FactionId[] = ['wei', 'shu', 'wu']

  return (
    <div className="relative">
      <Opening />

      {/* 势力筛选（吸顶） */}
      <div className="sticky top-16 z-30 border-y border-ink-700/40 bg-ink-950/80 py-3 backdrop-blur-md">
        <FactionFilter active={activeFactions} onToggle={toggleFaction} />
      </div>

      <EraNav activeEra={activeEra} onJump={jumpToEra} />

      {/* ===== 单轨区 184-207 ===== */}
      <section className="relative mx-auto max-w-3xl px-4 pb-8 pt-16 sm:px-6">
        {/* 中央墨线 */}
        <div className="absolute bottom-0 left-1/2 top-0 w-px -translate-x-1/2 bg-gradient-to-b from-transparent via-ink-600/60 to-ink-600/60" />

        {preYears.map((year) => {
          const events = (preByYear.get(year) ?? []).filter(isVisible)
          if (events.length === 0) return null
          const eraId = eraStartYears.get(year)
          return (
            <div key={year} id={eraId ? `era-${eraId}` : undefined} className={cn(eraId && 'scroll-mt-32')}>
              <div className="py-6">
                <YearMarker year={year} major={!!eraId} />
              </div>
              <div className="space-y-6">
                {events.map((e, ei) => (
                  <div
                    key={e.id}
                    className={cn(
                      'relative grid grid-cols-[1fr_auto_1fr] gap-4 sm:gap-6',
                    )}
                  >
                    {/* 左列 */}
                    <div className={cn('flex', ei % 2 === 0 ? 'justify-end' : 'invisible hidden sm:flex')}>
                      {ei % 2 === 0 && <EventCard event={e} onSelect={setSelected} onOpenCharacter={setSelectedCharacter} align="left" />}
                    </div>
                    {/* 中央节点 */}
                    <div className="relative flex w-4 justify-center">
                      <span
                        className="mt-6 block h-3 w-3 rounded-full border-2"
                        style={{
                          borderColor: '#63594c',
                          background: e.significance === 3 ? '#c23a2b' : '#221d16',
                          boxShadow: e.significance === 3 ? '0 0 12px rgba(194,58,43,0.6)' : undefined,
                        }}
                      />
                    </div>
                    {/* 右列 */}
                    <div className={cn('flex', ei % 2 === 1 ? '' : 'invisible hidden sm:flex')}>
                      {ei % 2 === 1 && <EventCard event={e} onSelect={setSelected} onOpenCharacter={setSelectedCharacter} align="right" />}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )
        })}
      </section>

      {/* ===== 分叉点 209 ===== */}
      <BranchPoint />

      {/* ===== 三轨区 209-280 ===== */}
      <section className="relative mx-auto max-w-6xl px-4 pb-8 sm:px-6">
        {/* 三轨表头 */}
        <div className="sticky top-16 z-20 hidden grid-cols-3 gap-4 border-b border-ink-700/40 bg-ink-950/80 py-3 backdrop-blur-md md:grid">
          {threeTracks.map((fid) => (
            <div key={fid} className="flex items-center justify-center gap-2">
              <span className="h-2 w-2 rounded-full" style={{ background: FACTIONS[fid].color }} />
              <span className="font-display text-lg tracking-[0.3em]" style={{ color: FACTIONS[fid].colorLight }}>
                {FACTIONS[fid].name}
              </span>
            </div>
          ))}
        </div>

        {postYears.map((year) => {
          const yearEvents = (postByYear.get(year) ?? []).filter(isVisible)
          if (yearEvents.length === 0) return null
          const eraId = eraStartYears.get(year)
          return (
            <div key={year} id={eraId ? `era-${eraId}` : undefined} className={cn(eraId && 'scroll-mt-32')}>
              <div className="py-6">
                <YearMarker year={year} major={!!eraId} />
              </div>

              {/* 移动端：全局顺序流式列表 */}
              <div className="space-y-3 md:hidden">
                {yearEvents.map((e) => (
                  <EventCard key={e.id} event={e} onSelect={setSelected} onOpenCharacter={setSelectedCharacter} compact />
                ))}
              </div>

              {/* 桌面端：CSS Grid 行号定位，跨轨时序对齐 */}
              <div
                className="hidden md:grid gap-x-4 gap-y-3"
                style={{
                  gridTemplateColumns: 'repeat(3, 1fr)',
                  gridTemplateRows: `repeat(${yearEvents.length}, auto)`,
                }}
              >
                {yearEvents.map((e, rowIndex) => {
                  const colIdx = threeTracks.indexOf(e.faction)
                  const gridColumn = colIdx >= 0 ? colIdx + 1 : 1
                  return (
                    <div
                      key={e.id}
                      style={{ gridRow: rowIndex + 1, gridColumn }}
                      className="relative pl-4"
                    >
                      {/* 轨道左边线 */}
                      <span
                        className="absolute left-0 top-0 h-full w-0.5 rounded-full"
                        style={{ background: `${FACTIONS[e.faction].color}30` }}
                      />
                      <EventCard event={e} onSelect={setSelected} onOpenCharacter={setSelectedCharacter} />
                    </div>
                  )
                })}
              </div>
            </div>
          )
        })}
      </section>

      <Ending />

      <EventDetail event={selected} onClose={() => setSelected(null)} onOpen={(id) => { const e = EVENT_MAP.get(id); if (e) setSelected(e) }} onOpenCharacter={(cid) => setSelectedCharacter(cid)} />
      <CharacterModal characterId={selectedCharacter} onClose={() => setSelectedCharacter(null)} />
    </div>
  )
}
