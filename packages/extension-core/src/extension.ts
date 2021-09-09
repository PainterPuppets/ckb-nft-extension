import { remove0x } from '.'
import { MAINNET_CLASS_TYPE_CODE_HASH, TESTNET_CLASS_TYPE_CODE_HASH } from './constants'
import { getCells, getLiveCell, getTimestampByHash, getTransactions } from './rpc'

const parseClassId = (tokenId: HexString): HexString => remove0x(tokenId).substring(0, 48)
const parseTid = (tokenId: HexString): number => parseInt(remove0x(tokenId).substring(48), 16)

export class Extension {
  private ckbNode: string
  private ckbIndexer: string
  private network: Network
  private classId: HexString

  public constructor(ckbNode: string, ckbIndexer: string, network: Network, classId: HexString) {
    this.ckbNode = ckbNode
    this.ckbIndexer = ckbIndexer
    this.network = network
    this.classId = classId
  }

  public async getNftCells(): Promise<NFTComponents.NftCell[]> {
    const cells = await getCells(this.ckbIndexer, this.getNftType())
    return cells.map(cell => ({
      tokenId: cell.output.type?.args,
      classId: parseClassId(cell.output.type?.args),
      tid: parseTid(cell.output.type?.args),
      lock: cell.output.lock,
      characteristic: null,
    }))
  }

  public async getNftTransactions(): Promise<NFTComponents.NftTx[]> {
    let txs = await getTransactions(this.ckbIndexer, this.getNftType())
    txs = txs.filter(tx => tx.ioType === 'output')
    let nftTxs: NFTComponents.NftTx[] = []
    for (const tx of txs) {
      const outPoint = {
        txHash: tx.txHash,
        index: tx.ioIndex,
      }
      const cell = await getLiveCell(this.ckbNode, outPoint)
      const timestamp = await getTimestampByHash(this.ckbNode, tx.txHash)
      nftTxs.push({
        tokenId: cell.output.type?.args,
        classId: parseClassId(cell.output.type?.args),
        tid: parseTid(cell.output.type?.args),
        txHash: tx.txHash,
        timestamp,
        blockNumber: tx.blockNumber,
        outPoint,
      })
    }
    return nftTxs
  }

  // Filter nft cells and txs by type script prefix
  private getNftType(): CKBComponents.Script {
    return {
      codeHash: this.network === 'mainnet' ? MAINNET_CLASS_TYPE_CODE_HASH : TESTNET_CLASS_TYPE_CODE_HASH,
      hashType: 'type',
      args: this.classId,
    }
  }
}
