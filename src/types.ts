export type UInt8 = number
export type UInt16 = number
export type UInt32 = number

type HexString = string
export type UInt64 = HexString

export type Enum = {
  name: string
  values: { [key: string]: UInt8 }
}

export type EnumType = string
export type BitType = string // BitN (n = 0~63)
export type Types = 'UInt8' | 'UInt16' | 'UInt32' | 'UInt64' | EnumType | BitType

export interface Item {
  name: string
  type: Types
  position: number
}

export interface DataFormat {
  type: { enum: Enum[] }
  data: Item[]
}