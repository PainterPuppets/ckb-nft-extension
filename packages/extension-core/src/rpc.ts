import fetch from 'node-fetch'
import CKB from '@nervosnetwork/ckb-sdk-core'
import { append0x, toCamelCase } from './utils'

export const getCells = async (
  ckbIndexer: string,
  type: CKBComponents.Script,
  order = 'asc',
  limit = 100,
): Promise<IndexerCell[]> => {
  let payload = {
    id: 1,
    jsonrpc: '2.0',
    method: 'get_cells',
    params: [
      {
        script: {
          code_hash: type.codeHash,
          hash_type: type.hashType,
          args: type.args,
        },
        script_type: 'type',
      },
      order,
      append0x(limit.toString(16)),
    ],
  }
  const body = JSON.stringify(payload, null, '  ')
  try {
    let res: any = await fetch(ckbIndexer, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body,
    })
    res = await res.json()
    return toCamelCase<IndexerCell[]>(res.result.objects)
  } catch (error) {
    console.error('error', error)
  }
}

export const getTransactions = async (
  ckbIndexer: string,
  type: CKBComponents.Script,
  order = 'asc',
  limit = 100,
): Promise<IndexerTx[]> => {
  let payload = {
    id: 1,
    jsonrpc: '2.0',
    method: 'get_cells',
    params: [
      {
        script: {
          code_hash: type.codeHash,
          hash_type: type.hashType,
          args: type.args,
        },
        script_type: 'type',
      },
      order,
      append0x(limit.toString(16)),
    ],
  }
  const body = JSON.stringify(payload, null, '  ')
  try {
    let res: any = await fetch(ckbIndexer, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body,
    })
    res = await res.json()
    return toCamelCase<IndexerTx[]>(res.result.objects)
  } catch (error) {
    console.error('error', error)
  }
}

export const getLiveCell = async (
  ckbNode: string,
  outPoint: CKBComponents.OutPoint,
): Promise<CKBComponents.LiveCell> => {
  const ckb = new CKB(ckbNode)
  const { cell } = await ckb.rpc.getLiveCell(outPoint, true)
  return cell
}

export const getTxLastWitnessByHash = async (ckbNode: string, txHash: HexString): Promise<HexString> => {
  const ckb = new CKB(ckbNode)
  const {
    transaction: { witnesses },
  } = await ckb.rpc.getTransaction(txHash)
  return witnesses[-1]
}

export const getTimestampByBlockNumber = async (ckbNode: string, blockNumber: HexString): Promise<number> => {
  const ckb = new CKB(ckbNode)
  const {
    header: { timestamp },
  } = await ckb.rpc.getBlockByNumber(blockNumber)
  return parseInt(timestamp)
}
