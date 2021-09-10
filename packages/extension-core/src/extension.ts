import { hexToHash, parseCharacteristicFromNftData, parseExtInfoFromClassData, remove0x } from '.'
import {
  MAINNET_CLASS_TYPE_CODE_HASH,
  MAINNET_NFT_TYPE_CODE_HASH,
  TESTNET_CLASS_TYPE_CODE_HASH,
  TESTNET_NFT_TYPE_CODE_HASH,
} from './constants'
import { getCells, getLiveCell, getTimestampByBlockNumber, getTransactions, getTxByHash } from './rpc'

const parseClassId = (tokenId: HexString): HexString => remove0x(tokenId).substring(0, 48)
const parseTid = (tokenId: HexString): number => parseInt(remove0x(tokenId).substring(48), 16)

export class Extension {
  private ckbNode: string
  private ckbIndexer: string
  private network: Network
  private classId: HexString

  public constructor({ ckbNode, ckbIndexer, network, classId }: NFTComponents.ExtensionProps) {
    this.ckbNode = ckbNode
    this.ckbIndexer = ckbIndexer
    this.network = network
    this.classId = classId
  }

  public async init() {
    const codeHash = this.network === 'mainnet' ? MAINNET_CLASS_TYPE_CODE_HASH : TESTNET_CLASS_TYPE_CODE_HASH
    const txs = await getTransactions(
      this.ckbIndexer,
      {
        codeHash,
        hashType: 'type',
        args: this.classId,
      },
      'asc',
      1,
    )
    if (!txs || txs.length === 0) {
      throw new Error('The transaction of creating class cells not found')
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

  public async getNftCells(): Promise<NFTComponents.NftCell[]> {
    const cells = await getCells(this.ckbIndexer, this.getNftType())
    return cells.map(cell => {
      const characteristic = parseCharacteristicFromNftData(cell.outputData)
      return {
        tokenId: cell.output.type?.args,
        classId: parseClassId(cell.output.type?.args),
        tid: parseTid(cell.output.type?.args),
        lock: cell.output.lock,
        characteristic: {
          weight: characteristic[0],
          background: characteristic[1],
          texture: characteristic[2],
        },
      }
    })
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
      const timestamp = await getTimestampByBlockNumber(this.ckbNode, tx.blockNumber)
      nftTxs.push({
        tokenId: cell.output.type?.args,
        classId: parseClassId(cell.output.type?.args),
        tid: parseTid(cell.output.type?.args),
        txHash: tx.txHash,
        lock: cell.output.lock,
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
      codeHash: this.network === 'mainnet' ? MAINNET_NFT_TYPE_CODE_HASH : TESTNET_NFT_TYPE_CODE_HASH,
      hashType: 'type',
      args: this.classId,
    }
  }
}
