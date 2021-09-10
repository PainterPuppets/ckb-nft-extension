import axios, { AxiosPromise } from 'axios'
import CKB from '@nervosnetwork/ckb-sdk-core'
import { append0x, toCamelCase } from './utils'

const fetch = (url: string, data: any): AxiosPromise => {
  return axios({
    method: 'POST',
    headers: {
      'content-type': 'application/json',
    },
    data,
    url,
  })
}

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
    let res: any = await fetch(ckbIndexer, body)
    return toCamelCase<IndexerCell[]>(res.data.result.objects)
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
    method: 'get_transactions',
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
    let res: any = await fetch(ckbIndexer, body)
    return toCamelCase<IndexerTx[]>(res.data.result.objects)
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

export const getTxByHash = async (ckbNode: string, txHash: HexString): Promise<CKBComponents.Transaction> => {
  const ckb = new CKB(ckbNode)
  const { transaction } = await ckb.rpc.getTransaction(txHash)
  return transaction
}

export const getTimestampByBlockNumber = async (ckbNode: string, blockNumber: HexString): Promise<number> => {
  const ckb = new CKB(ckbNode)
  const {
    header: { timestamp },
  } = await ckb.rpc.getBlockByNumber(blockNumber)
  return parseInt(timestamp)
}
