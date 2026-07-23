import { NavLink } from 'react-router-dom'
import { SealStamp } from '../ui/SealStamp'
import { cn } from '../../utils/cn'

/** 顶部导航 */
export function Header() {
  const linkCls = ({ isActive }: { isActive: boolean }) =>
    cn(
      'relative px-1 py-2 text-sm tracking-[0.2em] transition-colors duration-300',
      'after:absolute after:left-0 after:-bottom-0.5 after:h-px after:bg-cinnabar-500 after:transition-all after:duration-300',
      isActive
        ? 'text-paper after:w-full'
        : 'text-ink-300 hover:text-ink-100 after:w-0 hover:after:w-full'
    )

  return (
    <header className="fixed top-0 inset-x-0 z-40 border-b border-ink-700/40 bg-ink-950/70 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        <NavLink to="/" className="flex items-center gap-3 group">
          <SealStamp text="汉" size="sm" className="transition-transform duration-300 group-hover:rotate-[-6deg]" />
          <span className="font-display text-2xl text-paper tracking-[0.3em] group-hover:text-cinnabar-400 transition-colors duration-300">
            三国·演义
          </span>
        </NavLink>

        <nav className="flex items-center gap-6 sm:gap-8">
          <NavLink to="/" className={linkCls} end>
            时间线
          </NavLink>
          <NavLink to="/characters" className={linkCls}>
            人物志
          </NavLink>
        </nav>
      </div>
    </header>
  )
}
