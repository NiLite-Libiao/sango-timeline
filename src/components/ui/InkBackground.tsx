import { useMemo } from 'react'

interface InkParticle {
  left: string
  top: string
  size: number
  delay: string
  duration: string
  opacity: number
}

/** 深墨氛围背景：地图底图 + 暗遮罩 + 纸纹 + 远山剪影 + 漂浮墨点 */
export function InkBackground() {
  const particles = useMemo<InkParticle[]>(
    () =>
      Array.from({ length: 18 }, (_, i) => ({
        left: `${(i * 53 + 7) % 100}%`,
        top: `${(i * 37 + 13) % 100}%`,
        size: 3 + ((i * 7) % 9),
        delay: `${(i * 1.3) % 10}s`,
        duration: `${10 + (i % 6) * 3}s`,
        opacity: 0.04 + (i % 5) * 0.02,
      })),
    []
  )

  return (
    <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none" aria-hidden>
      {/* 东汉末年地图底图 */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: `url(${import.meta.env.BASE_URL}image/map.webp)`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          filter: 'saturate(0.65) brightness(0.42)',
        }}
      />
      {/* 深色遮罩：让地图若隐若现 */}
      <div
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse 120% 80% at 50% -10%, rgba(25,21,16,0.66) 0%, rgba(25,21,16,0.76) 45%, rgba(25,21,16,0.85) 100%)',
        }}
      />
      {/* 宣纸纹理 */}
      <div className="absolute inset-0 paper-texture" />
      {/* 顶部微光 */}
      <div
        className="absolute inset-x-0 top-0 h-[40vh]"
        style={{
          background:
            'radial-gradient(ellipse 60% 100% at 50% 0%, rgba(196,162,101,0.06) 0%, transparent 70%)',
        }}
      />
      {/* 远山剪影 - 三层视差 */}
      <svg
        className="absolute bottom-0 left-0 w-full opacity-[0.14]"
        viewBox="0 0 1440 320"
        preserveAspectRatio="none"
        style={{ height: '38vh' }}
      >
        <path
          fill="#2d2822"
          d="M0,224 C120,180 200,120 320,140 C440,160 500,90 620,110 C740,130 820,60 940,90 C1060,120 1140,70 1260,100 C1340,120 1400,150 1440,140 L1440,320 L0,320 Z"
        />
      </svg>
      <svg
        className="absolute bottom-0 left-0 w-full opacity-[0.10]"
        viewBox="0 0 1440 320"
        preserveAspectRatio="none"
        style={{ height: '28vh' }}
      >
        <path
          fill="#332d26"
          d="M0,260 C160,220 260,160 400,190 C540,220 620,140 760,170 C900,200 1000,130 1140,160 C1260,185 1360,200 1440,190 L1440,320 L0,320 Z"
        />
      </svg>
      {/* 漂浮墨点 */}
      {particles.map((p, i) => (
        <span
          key={i}
          className="absolute rounded-full animate-float-slow"
          style={{
            left: p.left,
            top: p.top,
            width: p.size,
            height: p.size,
            background: '#e8dfd2',
            opacity: p.opacity,
            animationDelay: p.delay,
            animationDuration: p.duration,
            filter: 'blur(1px)',
          }}
        />
      ))}
    </div>
  )
}
