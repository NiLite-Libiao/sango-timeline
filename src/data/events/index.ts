import type { TimelineEvent } from '../types'
import { period01 } from './period-01'
import { period02 } from './period-02'
import { period03 } from './period-03'
import { period04 } from './period-04'
import { period05 } from './period-05'
import { period06 } from './period-06'
import { period07 } from './period-07'
import { period08 } from './period-08'
import { period09 } from './period-09'

/** 排序比较器：year → month(缺省视为13排年末) → chapter(回目顺序) */
export function compareEvents(a: TimelineEvent, b: TimelineEvent): number {
  return a.year - b.year || (a.month ?? 13) - (b.month ?? 13) || a.chapter - b.chapter
}

/** 全部事件，按年份排序 */
export const ALL_EVENTS: TimelineEvent[] = [
  ...period01,
  ...period02,
  ...period03,
  ...period04,
  ...period05,
  ...period06,
  ...period07,
  ...period08,
  ...period09,
].sort(compareEvents)

/** 事件 id → 事件 映射 */
export const EVENT_MAP: Map<string, TimelineEvent> = new Map(
  ALL_EVENTS.map((e) => [e.id, e])
)

/** 后续反向索引：某事件 id → 以它为前情的事件 id 列表 */
export const CONSEQUENCES_MAP: Map<string, string[]> = (() => {
  const map = new Map<string, string[]>()
  for (const e of ALL_EVENTS) {
    if (e.prerequisites) {
      for (const preId of e.prerequisites) {
        const list = map.get(preId) ?? []
        list.push(e.id)
        map.set(preId, list)
      }
    }
  }
  return map
})()

/** 获取某年份的所有事件 */
export function getEventsByYear(year: number): TimelineEvent[] {
  return ALL_EVENTS.filter((e) => e.year === year)
}

/** 获取某势力在某年份区间的事件 */
export function getEventsByFaction(faction: string, from: number, to: number): TimelineEvent[] {
  return ALL_EVENTS.filter((e) => e.faction === faction && e.year >= from && e.year <= to)
}

/** 获取所有出现过的年份 */
export function getAllYears(): number[] {
  return [...new Set(ALL_EVENTS.map((e) => e.year))].sort((a, b) => a - b)
}
