import type { Migration } from './types'
import { p01 } from './p01'
import { p02 } from './p02'
import { p03 } from './p03'
import { p04 } from './p04'
import { p05 } from './p05'
import { p06 } from './p06'
import { p07 } from './p07'
import { p08 } from './p08'
import { p09 } from './p09'
import { s01 } from './s01'
import { s02 } from './s02'
import { s03 } from './s03'
import { s04 } from './s04'
import { s05 } from './s05'
import { s06 } from './s06'
import { s07 } from './s07'
import { s08 } from './s08'
import { s09 } from './s09'

/** 深度合并：同 id 的字段叠加，不覆盖 */
function merge(...sources: Record<string, Migration>[]): Record<string, Migration> {
  const result: Record<string, Migration> = {}
  for (const src of sources) {
    for (const [id, mig] of Object.entries(src)) {
      result[id] = { ...result[id], ...mig }
    }
  }
  return result
}

/** 全部迁移数据：事件 id → 迁移内容 */
export const MIGRATIONS: Record<string, Migration> = merge(
  p01, p02, p03, p04, p05, p06, p07, p08, p09,
  s01, s02, s03, s04, s05, s06, s07, s08, s09,
)
