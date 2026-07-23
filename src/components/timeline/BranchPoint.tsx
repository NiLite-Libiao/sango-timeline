import { motion } from 'framer-motion'
import { FACTIONS } from '../../data/factions'
import { SealStamp } from '../ui/SealStamp'

/** 分叉点：赤壁之战后，一轨裂为魏蜀吴三轨 */
export function BranchPoint() {
  const tracks = [
    { id: 'wei' as const, label: '曹魏', desc: '曹操 · 挟天子以令诸侯' },
    { id: 'shu' as const, label: '蜀汉', desc: '刘备 · 兴复汉室' },
    { id: 'wu' as const, label: '东吴', desc: '孙权 · 据有江东' },
  ]

  return (
    <motion.div
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, margin: '-100px' }}
      transition={{ duration: 0.8 }}
      className="relative py-16"
    >
      {/* 分叉墨线 SVG */}
      <svg
        className="absolute inset-x-0 top-0 mx-auto h-24 w-full max-w-2xl"
        viewBox="0 0 600 96"
        preserveAspectRatio="none"
        aria-hidden
      >
        {/* 主线到底 */}
        <motion.line
          x1="300" y1="0" x2="300" y2="40"
          stroke="#63594c" strokeWidth="2"
          initial={{ pathLength: 0 }}
          whileInView={{ pathLength: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        />
        {/* 分出三线 */}
        <motion.path
          d="M300 40 C 300 70, 110 60, 110 96"
          stroke={FACTIONS.wei.color} strokeWidth="2" fill="none"
          initial={{ pathLength: 0, opacity: 0 }}
          whileInView={{ pathLength: 1, opacity: 0.7 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.3 }}
        />
        <motion.path
          d="M300 40 C 300 70, 300 60, 300 96"
          stroke={FACTIONS.shu.color} strokeWidth="2" fill="none"
          initial={{ pathLength: 0, opacity: 0 }}
          whileInView={{ pathLength: 1, opacity: 0.7 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.45 }}
        />
        <motion.path
          d="M300 40 C 300 70, 490 60, 490 96"
          stroke={FACTIONS.wu.color} strokeWidth="2" fill="none"
          initial={{ pathLength: 0, opacity: 0 }}
          whileInView={{ pathLength: 1, opacity: 0.7 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.6 }}
        />
      </svg>

      {/* 文字 */}
      <div className="relative mx-auto max-w-2xl px-4 pt-28 text-center">
        <p className="text-xs tracking-[0.4em] text-ink-400">建安十四年 · 公元二〇九年</p>
        <h2 className="mt-2 font-display text-4xl text-paper">赤壁一战，天下三分</h2>
        <p className="mt-3 text-sm leading-relaxed text-ink-300">
          烈火张天照云海，周郎于此破曹公。自此魏、蜀、吴三足鼎立，各据一方。
        </p>

        {/* 三势力印章 */}
        <div className="mt-8 flex items-center justify-center gap-8 sm:gap-14">
          {tracks.map((t, i) => (
            <motion.div
              key={t.id}
              initial={{ opacity: 0, scale: 1.4, rotate: -8 }}
              whileInView={{ opacity: 1, scale: 1, rotate: -3 }}
              viewport={{ once: true }}
              transition={{ delay: 0.5 + i * 0.2, type: 'spring', stiffness: 260, damping: 18 }}
              className="flex flex-col items-center gap-2"
            >
              <SealStamp text={FACTIONS[t.id].shortName} color={FACTIONS[t.id].color} size="lg" />
              <span className="font-display text-sm" style={{ color: FACTIONS[t.id].colorLight }}>
                {t.label}
              </span>
              <span className="text-[10px] text-ink-500 tracking-wider">{t.desc}</span>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  )
}
