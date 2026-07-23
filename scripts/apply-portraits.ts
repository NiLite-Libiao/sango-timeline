/**
 * 自动扫描 public/portraits/ 目录，给匹配的人物数据加 portrait 字段
 * 运行：npx tsx scripts/apply-portraits.ts
 *
 * 幂等：已有 portrait 字段的事件会被更新为新路径（支持换格式）。
 */
import { readdirSync, readFileSync, writeFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join, parse } from 'node:path'

const __dirname = dirname(fileURLToPath(import.meta.url))
const root = join(__dirname, '..')
const portraitsDir = join(root, 'public', 'portraits')
const charactersDir = join(root, 'src', 'data', 'characters')

// 1. 扫描 portraits 目录，收集 id → 路径
const portraitMap = new Map<string, string>()
try {
  const files = readdirSync(portraitsDir)
  for (const f of files) {
    const ext = parse(f).ext.toLowerCase()
    if (!['.webp', '.png', '.jpg', '.jpeg', '.avif'].includes(ext)) continue
    const id = parse(f).name
    portraitMap.set(id, `/portraits/${f}`)
  }
} catch {
  console.log('public/portraits/ 目录不存在或为空，无需操作。')
  process.exit(0)
}

if (portraitMap.size === 0) {
  console.log('public/portraits/ 目录下没有图片文件，无需操作。')
  process.exit(0)
}

console.log(`发现 ${portraitMap.size} 张头像图片：`)
for (const [id, path] of portraitMap) {
  console.log(`  ${id} → ${path}`)
}

// 2. 处理每个人物数据文件
const charFiles = ['wei.ts', 'shu.ts', 'wu.ts', 'others.ts']
let totalAdded = 0
let totalUpdated = 0

for (const file of charFiles) {
  const filePath = join(charactersDir, file)
  const src = readFileSync(filePath, 'utf8')
  const eol = src.includes('\r\n') ? '\r\n' : '\n'
  const lines = src.split(/\r?\n/)
  const out: string[] = []

  let currentId: string | null = null
  let blockHasPortrait = false

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]

    // 检测 id
    const idMatch = line.match(/id:\s*'([^']+)'/)
    if (idMatch) {
      currentId = idMatch[1]
      blockHasPortrait = false
    }

    // 检测已有 portrait 行
    if (/^\s*portrait:/.test(line)) {
      blockHasPortrait = true
      const portraitPath = currentId ? portraitMap.get(currentId) : undefined
      if (portraitPath) {
        // 更新路径
        const indent = line.match(/^\s*/)![0]
        out.push(`${indent}portrait: '${portraitPath}',`)
        totalUpdated++
        continue
      } else {
        // 图片已删除，移除 portrait 行
        continue
      }
    }

    out.push(line)

    // 在 events 行后插入 portrait（如果该人物有图片且尚未有 portrait 字段）
    if (currentId && !blockHasPortrait && /^\s*events:/.test(line)) {
      const portraitPath = portraitMap.get(currentId)
      if (portraitPath) {
        const indent = line.match(/^\s*/)![0]
        out.push(`${indent}portrait: '${portraitPath}',`)
        totalAdded++
      }
    }
  }

  writeFileSync(filePath, out.join(eol), 'utf8')
  console.log(`  ✓ ${file}`)
}

console.log(`\n新增 portrait：${totalAdded} 条`)
console.log(`更新 portrait：${totalUpdated} 条`)
if (totalAdded === 0 && totalUpdated === 0) {
  console.log('（没有匹配的人物 id，请检查图片文件名是否与人物 id 一致）')
}
