import { remove0x } from './utils'
import { hexToHash, parseCharacteristicFromNftData, parseExtInfoFromClassData } from './parser'
import {
  MAINNET_CLASS_TYPE_CODE_HASH,
  MAINNET_NFT_TYPE_CODE_HASH,
  TESTNET_CLASS_TYPE_CODE_HASH,
  TESTNET_NFT_TYPE_CODE_HASH,
} from './constants'
import { getCells, getTimestampByBlockNumber, getTipBlockHeight, getTransactions, getTxByHash } from './rpc'
import { u32ToBe } from '.'

const parseClassId = (tokenId: HexString): HexString => remove0x(tokenId).substring(0, 48)
const parseTid = (tokenId: HexString): number => parseInt(remove0x(tokenId).substring(48), 16)

export class Extension {
  private ckbNode: string
  private ckbIndexer: string
  private network: Network
  private classIds: HexString[]

  public constructor({ ckbNode, ckbIndexer, network, classIds }: NFTComponents.ExtensionProps) {
    this.ckbNode = ckbNode
    this.ckbIndexer = ckbIndexer
    this.network = network
    this.classIds = classIds
  }

  public async init() {
    const codeHash = this.network === 'mainnet' ? MAINNET_CLASS_TYPE_CODE_HASH : TESTNET_CLASS_TYPE_CODE_HASH
    for (const classId of this.classIds) {
      const txs = await getTransactions(
        this.ckbIndexer,
        {
          codeHash,
          hashType: 'type',
          args: classId,
        },
        'asc',
        1,
      )
      if (!txs || txs.length === 0) {
        throw new Error(`The transaction of creating class cell(classId:${classId}) not found`)
      }
      const transaction = await getTxByHash(this.ckbNode, txs[0].txHash)
      const witness = transaction.witnesses[transaction.witnesses.length - 1]
      const outputsData = transaction.outputsData[parseInt(txs[0].txIndex, 16)]
      const jsonHash = hexToHash(witness)
      const extensionFormat = parseExtInfoFromClassData(outputsData)
      if (extensionFormat.hash !== jsonHash) {
        throw new Error('The hash of class ext info is not same as witness json hash')
      }
    }
  }

  public async getNftCells(tid = undefined, order = 'asc', limit = 10): Promise<NFTComponents.NftCell[]> {
    const nftTypeScripts = this.getNftTypeScripts(tid)
    let nftCells: NFTComponents.NftCell[] = []
    for (const nftType of nftTypeScripts) {
      const cells = await getCells(this.ckbIndexer, nftType, order, limit)
      nftCells = nftCells.concat(
        cells.map(cell => {
          const characteristic = parseCharacteristicFromNftData(cell.outputData)
          return {
            tokenId: cell.output.type?.args,
            classId: parseClassId(cell.output.type?.args),
            tid: parseTid(cell.output.type?.args),
            lock: cell.output.lock,
            characteristic: {
              rarity: characteristic[0],
            },
          }
        }),
      )
    }
    return nftCells
  }

  public async getNftTransactions(tid = undefined, order = 'asc', limit = 10): Promise<NFTComponents.NftTx[]> {
    const nftTypeScripts = this.getNftTypeScripts(tid)
    let nftTxs: NFTComponents.NftTx[] = []
    for (const nftType of nftTypeScripts) {
      let txs = await getTransactions(this.ckbIndexer, nftType, order, limit)
      txs = txs.filter(tx => tx.ioType === 'output')
      for (const tx of txs) {
        const transaction = await getTxByHash(this.ckbNode, tx.txHash)
        const timestamp = await getTimestampByBlockNumber(this.ckbNode, tx.blockNumber)
        const output = transaction.outputs[parseInt(tx.ioIndex, 16)]
        nftTxs.push({
          tokenId: output?.type.args,
          classId: parseClassId(output?.type.args),
          tid: parseTid(output?.type.args),
          txHash: tx.txHash,
          lock: output.lock,
          timestamp,
          blockNumber: tx.blockNumber,
          outPoint: {
            txHash: tx.txHash,
            index: tx.ioIndex,
          },
        })
      }
    }
    return nftTxs
  }

  public async getTipBlockNumber(): Promise<number> {
    return await getTipBlockHeight(this.ckbNode)
  }

  // Filter nft cells and txs by type script prefix
  private getNftTypeScripts(tid?: number): CKBComponents.Script[] {
    return this.classIds.map(classId => ({
      codeHash: this.network === 'mainnet' ? MAINNET_NFT_TYPE_CODE_HASH : TESTNET_NFT_TYPE_CODE_HASH,
      hashType: 'type',
      args: tid !== undefined ? `${classId}${u32ToBe(tid)}` : classId,
    }))
  }
}
