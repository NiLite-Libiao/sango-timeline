/**
 * 事件迁移处理器
 * 运行：npx tsx scripts/apply-migrations.ts
 *
 * 按事件 id 对 period-XX.ts 做行级改写：
 * 1. 替换 detail 行为迁移数据中的新 detail（白话版）
 * 2. 在 chapter 行后插入 arc / prerequisites（若迁移数据提供且尚未存在）
 *
 * 幂等：重复运行只会用相同内容覆盖，arc/prerequisites 不会重复插入。
 */
import { readFileSync, writeFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'
import { MIGRATIONS } from './migrations/index'

const __dirname = dirname(fileURLToPath(import.meta.url))
const eventsDir = join(__dirname, '..', 'src', 'data', 'events')

interface Migration {
  d?: string
  s?: string
  a?: string
  p?: string[]
}

const files = [
  'period-01.ts', 'period-02.ts', 'period-03.ts', 'period-04.ts', 'period-05.ts',
  'period-06.ts', 'period-07.ts', 'period-08.ts', 'period-09.ts',
]

let totalDetail = 0
let totalSummary = 0
let totalArc = 0

for (const file of files) {
  const path = join(eventsDir, file)
  const src = readFileSync(path, 'utf8')
  const eol = src.includes('\r\n') ? '\r\n' : '\n'
  const lines = src.split(/\r?\n/)
  const out: string[] = []

  let currentId: string | null = null

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]

    const idMatch = line.match(/id:\s*'([^']+)'/)
    if (idMatch) currentId = idMatch[1]

    const mig: Migration | undefined = currentId ? MIGRATIONS[currentId] : undefined

    // 已迁移事件：丢弃旧 arc / prerequisites，稍后按迁移数据重新插入（保证幂等、可自愈重复）
    if (mig && (/^\s*arc:/.test(line) || /^\s*prerequisites:/.test(line))) {
      continue
    }

    // 替换 detail 行
    if (mig?.d !== undefined && /^\s*detail:/.test(line)) {
      const indent = line.match(/^\s*/)![0]
      out.push(`${indent}detail: '${mig.d}',`)
      totalDetail++
      continue
    }

    // 替换 summary 行
    if (mig?.s !== undefined && /^\s*summary:/.test(line)) {
      const indent = line.match(/^\s*/)![0]
      out.push(`${indent}summary: '${mig.s}',`)
      totalSummary++
      continue
    }

    out.push(line)

    // 在 chapter 行后插入 arc / prerequisites
    if (mig && /^\s*chapter:\s*\d+,/.test(line)) {
      const indent = line.match(/^\s*/)![0]
      if (mig.a !== undefined) {
        out.push(`${indent}arc: '${mig.a}',`)
        totalArc++
      }
      if (mig.p !== undefined) {
        out.push(`${indent}prerequisites: [${mig.p.map((x) => `'${x}'`).join(', ')}],`)
      }
    }
  }

  writeFileSync(path, out.join(eol), 'utf8')
  console.log(`  ✓ ${file}`)
}

console.log(`\n替换 detail：${totalDetail} 条`)
console.log(`替换 summary：${totalSummary} 条`)
console.log(`新增 arc：${totalArc} 条`)
