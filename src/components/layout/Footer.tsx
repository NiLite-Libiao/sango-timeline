/** 页脚 */
export function Footer() {
  return (
    <footer className="border-t border-ink-700/40 py-10 mt-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 text-center space-y-3">
        <p className="font-display text-lg text-ink-300 tracking-[0.3em]">
          滚滚长江东逝水，浪花淘尽英雄
        </p>
        <p className="text-xs text-ink-500 tracking-widest">
          是非成败转头空 · 青山依旧在 · 几度夕阳红
        </p>
        <p className="text-[11px] text-ink-600 pt-2">
          据《三国演义》整理 · 公元 184 — 280
        </p>
      </div>
    </footer>
  )
}
