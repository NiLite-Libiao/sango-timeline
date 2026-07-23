/**
 * 叙事完整性校验脚本
 * 运行：npx tsx scripts/validate-narrative.ts
 *
 * 检查项：
 * 1. 悬空引用：prerequisites 指向不存在的 id
 * 2. 叙事线分组：按 arc 列出事件，人工扫缺环
 * 3. 可疑断点：同一条 arc 里非最早、却没有 prerequisites 的事件
 * 4. 覆盖率：未归入任何 arc 的事件
 */
import { ALL_EVENTS, compareEvents } from '../src/data/events'
import type { TimelineEvent } from '../src/data/types'

const eventIds = new Set(ALL_EVENTS.map((e) => e.id))
let errors = 0

// ── 1. 悬空引用 ──
console.log('\n═══ 1. 悬空引用检查 ═══')
for (const e of ALL_EVENTS) {
  for (const preId of e.prerequisites ?? []) {
    if (!eventIds.has(preId)) {
      console.error(`  ✗ [${e.id}] "${e.title}" 的前因 "${preId}" 不存在`)
      errors++
    }
  }
}
if (errors === 0) console.log('  ✓ 无悬空引用')

// ── 2. 叙事线分组 ──
console.log('\n═══ 2. 叙事线分组 ═══')
const arcs = new Map<string, TimelineEvent[]>()
for (const e of ALL_EVENTS) {
  if (e.arc) {
    const list = arcs.get(e.arc) ?? []
    list.push(e)
    arcs.set(e.arc, list)
  }
}
for (const [arc, events] of [...arcs.entries()].sort((a, b) => a[0].localeCompare(b[0]))) {
  const sorted = [...events].sort(compareEvents)
  console.log(`\n  【${arc}】(${sorted.length} 条)`)
  for (const e of sorted) {
    const pre = e.prerequisites?.length ? ` ← [${e.prerequisites.join(', ')}]` : ' ← ∅'
    console.log(`    ${e.year}年 ${e.title}${pre}`)
  }
}

// ── 3. 可疑断点 ──
console.log('\n═══ 3. 可疑断点（arc 内非最早却无前因）═══')
let suspicious = 0
for (const [, events] of arcs) {
  const sorted = [...events].sort(compareEvents)
  for (let i = 1; i < sorted.length; i++) {
    const e = sorted[i]
    if (!e.prerequisites || e.prerequisites.length === 0) {
      console.warn(`  ⚠ [${e.id}] "${e.title}" (${e.year}年) 在 arc「${e.arc}」中非首条，却无 prerequisites`)
      suspicious++
    }
  }
}
if (suspicious === 0) console.log('  ✓ 无可疑断点')

// ── 4. 覆盖率 ──
console.log('\n═══ 4. arc 覆盖率 ═══')
const noArc = ALL_EVENTS.filter((e) => !e.arc)
console.log(`  已归线：${ALL_EVENTS.length - noArc.length} / ${ALL_EVENTS.length}`)
if (noArc.length > 0) {
  console.log(`  未归线 (${noArc.length} 条)：`)
  for (const e of noArc) {
    console.log(`    [${e.id}] ${e.year}年 ${e.title}`)
  }
}

// ── 5. 时序倒挂：prerequisites 必须排在当前事件之前 ──
console.log('\n═══ 5. 时序倒挂检查 ═══')
const posMap = new Map<string, number>()
ALL_EVENTS.forEach((e, i) => posMap.set(e.id, i))
let inversions = 0
for (const e of ALL_EVENTS) {
  for (const preId of e.prerequisites ?? []) {
    const prePos = posMap.get(preId)
    const curPos = posMap.get(e.id)!
    if (prePos !== undefined && prePos > curPos) {
      const preEvent = ALL_EVENTS[prePos]
      console.warn(`  ⚠ [${e.id}] "${e.title}" (${e.year}年) 的前因 [${preId}] "${preEvent.title}" (${preEvent.year}年) 排在它后面 → 时序倒挂`)
      inversions++
    }
  }
}
if (inversions === 0) console.log('  ✓ 无时序倒挂')

// ── 6. 同年同月同回目组（依赖文件序，人工确认）──
console.log('\n═══ 6. 同年同月同回目组（顺序依赖文件序）═══')
const groupMap = new Map<string, TimelineEvent[]>()
for (const e of ALL_EVENTS) {
  const key = `${e.year}-${e.month ?? 13}-${e.chapter}`
  const list = groupMap.get(key) ?? []
  list.push(e)
  groupMap.set(key, list)
}
let ambiguousGroups = 0
for (const [, group] of groupMap) {
  if (group.length >= 2) {
    ambiguousGroups++
    console.log(`  [${group[0].year}年 ${group[0].month ?? '-'}月 ch${group[0].chapter}]`)
    group.forEach((e, i) => console.log(`    ${i + 1}. ${e.title} (${e.id})`))
  }
}
if (ambiguousGroups === 0) console.log('  ✓ 无同组事件')
else console.log(`  ℹ ${ambiguousGroups} 组事件的顺序依赖文件内排列，请人工确认`)

// ── 汇总 ──
console.log('\n═══ 汇总 ═══')
console.log(`  事件总数：${ALL_EVENTS.length}`)
console.log(`  叙事线数：${arcs.size}`)
console.log(`  悬空引用：${errors}`)
console.log(`  可疑断点：${suspicious}`)
console.log(`  未归线：${noArc.length}`)
console.log(`  时序倒挂：${inversions}`)
if (errors > 0 || inversions > 0) {
  console.error('\n  ✗ 存在悬空引用或时序倒挂，请修复！')
  process.exit(1)
}
