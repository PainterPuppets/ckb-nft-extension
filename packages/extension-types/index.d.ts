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
    timestamp: string
    blockNumber: string
    outPoint: CKBComponents.OutPoint
  }
}
