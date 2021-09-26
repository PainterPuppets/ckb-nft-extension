/// <reference types="@nervosnetwork/ckb-types" />

declare namespace NFTComponents {
  export type NftCell = {
    tokenId: string
    classId: string
    tid: number
    characteristic: object
    lock: CKBComponents.Script
  }

  export type NftTx = {
    tokenId: string
    classId: string
    tid: number
    txHash: string
    timestamp: number
    blockNumber: string
    lock: CKBComponents.Script
    outPoint: CKBComponents.OutPoint
  }

  export type Network = 'mainnet' | 'testnet'

  export type ExtensionProps = {
    ckbNode: string
    ckbIndexer: string
    network: Network
    classIds: string[]
  }

  export type MethodProps = {
    order?: 'asc' | 'desc'
    limit?: number
    tid?: number
  }
}
