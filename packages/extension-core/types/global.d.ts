/// <reference types="@nervosnetwork/ckb-types" />

type UInt8 = number
type UInt16 = number
type UInt32 = number

type HexString = string
type UInt64 = HexString

type Hash = HexString

type Enum = {
  name: string
  values: { [key: string]: UInt8 }
}

type EnumType = string
type BitType = string // BitN (n = 0~63)
type Types = 'UInt8' | 'UInt16' | 'UInt32' | 'UInt64' | EnumType | BitType

type Item = {
  name: string
  type: Types
  position: number
}

type DataFormat = {
  type: { enum: Enum[] }
  data: Item[]
}

type ExtensionFormat = {
  id: string
  hash: Hash
}

type Network = 'mainnet' | 'testnet'
type Order = 'asc' | 'desc'
type CellType = 'input' | 'output'

interface IndexerCell {
  blockNumber: CKBComponents.BlockNumber
  outPoint: CKBComponents.OutPoint
  output: CKBComponents.CellOutput
  outputData: HexString[]
  txIndex: HexString
}

type IndexerCells = {
  objects: IndexerCell[]
  lastCursor: HexString
}

interface IndexerTx {
  blockNumber: CKBComponents.BlockNumber
  ioIndex: HexString
  ioType: CellType
  txHash: HexString
  txIndex: HexString
}

type IndexerTxs = {
  objects: IndexerTx[]
  lastCursor: HexString
}
