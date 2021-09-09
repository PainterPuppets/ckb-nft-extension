import { hexToBytes, blake160, bytesToHex } from '@nervosnetwork/ckb-sdk-utils'
import { hexToUtf8, remove0x, utf8ToHex } from './utils'

const CLASS_FIXED_LEN = 16
const NFT_FIXED_LEN = 11
const DYN_SIZE = 2

export const parseExtInfoFromClassData = (classData: HexString): ExtensionFormat => {
  const data = remove0x(classData)
  if (data.length < CLASS_FIXED_LEN) {
    throw new Error('Class cell data length error')
  }
  let extInfo = ''
  try {
    const dynamic = data.substring(CLASS_FIXED_LEN)
    const nameDynLen = parseInt(dynamic.substring(0, DYN_SIZE), 16) + DYN_SIZE
    const descriptionDynLen = parseInt(dynamic.substring(nameDynLen, nameDynLen + DYN_SIZE), 16) + DYN_SIZE
    const rendererDynLen = parseInt(dynamic.substring(descriptionDynLen, descriptionDynLen + DYN_SIZE), 16) + DYN_SIZE
    const extInfoLen = parseInt(dynamic.substring(rendererDynLen, rendererDynLen + DYN_SIZE), 16)
    extInfo = dynamic.substring(extInfoLen + DYN_SIZE, extInfoLen + DYN_SIZE + extInfoLen)
  } catch (error) {
    throw new Error(`Parse class data error: ${error}`)
  }
  try {
    return JSON.parse(extInfo) as ExtensionFormat
  } catch (error) {
    throw new Error(`Parse json to DataFormat error: ${error}`)
  }
}

export const dataFormatToJsonHash = (dataFormat: DataFormat): string => {
  const jsonHex = utf8ToHex(JSON.stringify(dataFormat))
  return bytesToHex(blake160(hexToBytes(jsonHex)))
}

export const witnessJsonToDataFormat = (witness: HexString) => {
  try {
    return JSON.parse(hexToUtf8(witness)) as DataFormat
  } catch (error) {
    console.error(`Parse witness json error: ${error}`)
  }
}

export const parseCharacteristicFromNftData = (nftData: HexString): Uint8Array => {
  const data = remove0x(nftData)
  if (data.length < NFT_FIXED_LEN) {
    throw new Error('nft cell data length error')
  }
  return hexToBytes(data.substring(1, 9))
}
