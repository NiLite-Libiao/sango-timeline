import type { Character } from '../types'
import { weiCharacters } from './wei'
import { shuCharacters } from './shu'
import { wuCharacters } from './wu'
import { othersCharacters } from './others'

/** 全部人物 */
export const ALL_CHARACTERS: Character[] = [
  ...weiCharacters,
  ...shuCharacters,
  ...wuCharacters,
  ...othersCharacters,
]

/** 人物 id → 人物 映射 */
export const CHARACTER_MAP: Map<string, Character> = new Map(
  ALL_CHARACTERS.map((c) => [c.id, c])
)

/** 根据 id 获取人物 */
export function getCharacter(id: string): Character | undefined {
  return CHARACTER_MAP.get(id)
}

/** 根据势力获取人物 */
export function getCharactersByFaction(faction: string): Character[] {
  return ALL_CHARACTERS.filter((c) => c.faction === faction)
}
