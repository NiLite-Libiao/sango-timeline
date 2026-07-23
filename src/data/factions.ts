import type { FactionId, WarlordId, Era } from './types'

export interface FactionMeta {
  id: FactionId
  name: string
  shortName: string
  /** 主色 */
  color: string
  colorLight: string
  colorDim: string
  /** 存续年份 */
  start: number
  end: number
  founder: string
}

export const FACTIONS: Record<FactionId, FactionMeta> = {
  wei: {
    id: 'wei',
    name: '曹魏',
    shortName: '魏',
    color: '#c25450',
    colorLight: '#e0918d',
    colorDim: 'rgba(194, 84, 80, 0.15)',
    start: 184, // 曹操起兵
    end: 265,
    founder: '曹操',
  },
  shu: {
    id: 'shu',
    name: '蜀汉',
    shortName: '蜀',
    color: '#3d9b8b',
    colorLight: '#7cc4b5',
    colorDim: 'rgba(61, 155, 139, 0.15)',
    start: 184, // 刘备起兵
    end: 263,
    founder: '刘备',
  },
  wu: {
    id: 'wu',
    name: '东吴',
    shortName: '吴',
    color: '#4a7fb5',
    colorLight: '#8db8dd',
    colorDim: 'rgba(74, 127, 181, 0.15)',
    start: 184, // 孙坚起兵
    end: 280,
    founder: '孙权',
  },
  han: {
    id: 'han',
    name: '汉室',
    shortName: '汉',
    color: '#a8864d',
    colorLight: '#c4a265',
    colorDim: 'rgba(168, 134, 77, 0.15)',
    start: 184,
    end: 220,
    founder: '刘协',
  },
  qunxiong: {
    id: 'qunxiong',
    name: '群雄',
    shortName: '雄',
    color: '#7d8a6e',
    colorLight: '#a3b08f',
    colorDim: 'rgba(125, 138, 110, 0.15)',
    start: 184,
    end: 207,
    founder: '',
  },
}

/** 群雄子势力颜色 */
export const WARLORD_COLORS: Record<WarlordId, string> = {
  dongzhuo: '#8b6ba3',
  yuanshao: '#c9a043',
  lvbu: '#c4586e',
  yuanshu: '#9b7340',
  gongsunzan: '#5e8fa8',
  liubiao: '#6e9b8a',
  liuzhang: '#8a9b5e',
  zhanglu: '#7a8b9b',
  taoqian: '#9b8a6e',
  kongrong: '#6e7a9b',
  other: '#7d8a6e',
}

export const WARLORD_NAMES: Record<WarlordId, string> = {
  dongzhuo: '董卓',
  yuanshao: '袁绍',
  lvbu: '吕布',
  yuanshu: '袁术',
  gongsunzan: '公孙瓒',
  liubiao: '刘表',
  liuzhang: '刘璋',
  zhanglu: '张鲁',
  taoqian: '陶谦',
  kongrong: '孔融',
  other: '其他',
}

/** 获取事件显示颜色 */
export function getFactionColor(faction: FactionId, warlord?: WarlordId): string {
  if (faction === 'qunxiong' && warlord) {
    return WARLORD_COLORS[warlord]
  }
  return FACTIONS[faction].color
}

/** 时代划分 */
export const ERAS: Era[] = [
  { id: 'huangjin', name: '黄巾之乱', startYear: 184, endYear: 189, intro: '苍天已死，黄天当立' },
  { id: 'qunxiong', name: '群雄逐鹿', startYear: 190, endYear: 199, intro: '天下英雄，唯使君与操耳' },
  { id: 'guandu', name: '官渡之战', startYear: 200, endYear: 207, intro: '以少胜多，北方一统' },
  { id: 'chibi', name: '赤壁之战', startYear: 208, endYear: 214, intro: '东风不与周郎便' },
  { id: 'dingli', name: '三足鼎立', startYear: 215, endYear: 227, intro: '魏蜀吴，三分天下' },
  { id: 'beifa', name: '北伐中原', startYear: 228, endYear: 251, intro: '鞠躬尽瘁，死而后已' },
  { id: 'guijin', name: '天下归晋', startYear: 252, endYear: 280, intro: '分久必合，天下一统' },
]

/** 分叉年份：赤壁之战后，三家分立始于 209（刘备借荆州） */
export const BRANCH_YEAR = 209

/** 年号对照（主要年份） */
export const ERA_NAMES: Record<number, string> = {
  184: '中平元年', 185: '中平二年', 186: '中平三年', 187: '中平四年',
  188: '中平五年', 189: '中平六年', 190: '初平元年', 191: '初平二年',
  192: '初平三年', 193: '初平四年', 194: '兴平元年', 195: '兴平二年',
  196: '建安元年', 197: '建安二年', 198: '建安三年', 199: '建安四年',
  200: '建安五年', 201: '建安六年', 202: '建安七年', 203: '建安八年',
  204: '建安九年', 205: '建安十年', 206: '建安十一年', 207: '建安十二年',
  208: '建安十三年', 209: '建安十四年', 210: '建安十五年', 211: '建安十六年',
  212: '建安十七年', 213: '建安十八年', 214: '建安十九年', 215: '建安二十年',
  216: '建安二十一年', 217: '建安二十二年', 218: '建安二十三年', 219: '建安二十四年',
  220: '建安二十五年', 221: '章武元年', 222: '章武二年', 223: '章武三年',
  224: '建兴二年', 225: '建兴三年', 226: '建兴四年', 227: '建兴五年',
  228: '建兴六年', 229: '建兴七年', 230: '建兴八年', 231: '建兴九年',
  232: '建兴十年', 233: '建兴十一年', 234: '建兴十二年', 235: '建兴十三年',
  236: '建兴十四年', 237: '建兴十五年', 238: '延熙元年', 239: '延熙二年',
  240: '延熙三年', 241: '延熙四年', 242: '延熙五年', 243: '延熙六年',
  244: '延熙七年', 245: '延熙八年', 246: '延熙九年', 247: '延熙十年',
  248: '延熙十一年', 249: '延熙十二年', 250: '延熙十三年', 251: '延熙十四年',
  252: '延熙十五年', 253: '延熙十六年', 254: '延熙十七年', 255: '延熙十八年',
  256: '延熙十九年', 257: '延熙二十年', 258: '延熙二十一年', 259: '延熙二十二年',
  260: '延熙二十三年', 261: '延熙二十四年', 262: '景耀五年', 263: '炎兴元年',
  264: '咸熙元年', 265: '咸熙二年', 266: '泰始二年', 267: '泰始三年',
  268: '泰始四年', 269: '泰始五年', 270: '泰始六年', 271: '泰始七年',
  272: '泰始八年', 273: '泰始九年', 274: '泰始十年', 275: '咸宁元年',
  276: '咸宁二年', 277: '咸宁三年', 278: '咸宁四年', 279: '咸宁五年',
  280: '太康元年',
}
