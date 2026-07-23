/** 单条事件的迁移数据 */
export interface Migration {
  /** 新 detail（现代白话） */
  d?: string
  /** 新 summary（现代白话，1-2句） */
  s?: string
  /** 所属叙事线 */
  a?: string
  /** 前置事件 id 列表 */
  p?: string[]
}
