/** 势力标识 */
export type FactionId = 'wei' | 'shu' | 'wu' | 'han' | 'qunxiong'

/** 群雄子势力（用于着色） */
export type WarlordId =
  | 'dongzhuo' | 'yuanshao' | 'lvbu' | 'yuanshu'
  | 'gongsunzan' | 'liubiao' | 'liuzhang' | 'zhanglu'
  | 'taoqian' | 'kongrong' | 'other'

/** 事件类型 */
export type EventType = 'battle' | 'politics' | 'diplomacy' | 'death' | 'founding' | 'strategy'

/** 时间线事件 */
export interface TimelineEvent {
  id: string
  year: number
  month?: number
  title: string
  /** 1-2句概述，显示在卡片上 */
  summary: string
  /** 现代白话叙事+金句原文，显示在详情面板 */
  detail: string
  faction: FactionId
  /** 群雄事件的具体归属 */
  warlord?: WarlordId
  type: EventType
  /** 关联人物 id */
  characters: string[]
  location?: string
  /** 1=普通 2=重要 3=转折级 */
  significance: 1 | 2 | 3
  /** 演义回目 */
  chapter: number
  /** 所属叙事线，如"关羽降曹归刘" */
  arc?: string
  /** 前置事件 id：理解本事件所必需的前情 */
  prerequisites?: string[]
}

/** 人物 */
export interface Character {
  id: string
  name: string
  /** 字 */
  courtesyName?: string
  faction: FactionId
  warlord?: WarlordId
  birthYear?: number
  deathYear?: number
  deathCause?: string
  /** 如“军师”、“猛将”、“君主” */
  role: string
  /** 演义版小传 3-5句 */
  bio: string
  /** 名言 */
  quote?: string
  /** 关联事件 id */
  events: string[]
  /** 头像图片路径（如 /portraits/liubei.webp），缺省则 fallback 到印章 */
  portrait?: string
}

/** 时代（用于导航） */
export interface Era {
  id: string
  name: string
  startYear: number
  endYear: number
  /** 卷首语 */
  intro: string
}
