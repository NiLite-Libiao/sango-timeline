import { cn } from '../../utils/cn'

interface SealStampProps {
  /** 印章文字（1-4字） */
  text: string
  /** 印章颜色 */
  color?: string
  size?: 'sm' | 'md' | 'lg'
  className?: string
  /** 是否带动画（盖印效果） */
  animate?: boolean
}

/** 朱砂印章 */
export function SealStamp({ text, color = '#c23a2b', size = 'md', className, animate }: SealStampProps) {
  const sizeCls = {
    sm: 'w-9 h-9 text-[11px]',
    md: 'w-13 h-13 text-sm',
    lg: 'w-20 h-20 text-xl',
  }[size]

  const chars = text.split('')
  const isTwo = chars.length === 2

  return (
    <span
      className={cn(
        'inline-flex items-center justify-center rounded-[3px] border-2 select-none shrink-0',
        'font-display leading-none',
        sizeCls,
        animate && 'animate-seal-stamp',
        className
      )}
      style={{
        color,
        borderColor: color,
        background: `${color}14`,
        boxShadow: `inset 0 0 0 1px ${color}30`,
      }}
    >
      {isTwo ? (
        <span className="flex flex-col items-center">
          {chars.map((c, i) => (
            <span key={i}>{c}</span>
          ))}
        </span>
      ) : (
        <span className="tracking-tight">{text}</span>
      )}
    </span>
  )
}
