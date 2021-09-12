import { hexToBytes, blake160, bytesToHex } from '@nervosnetwork/ckb-sdk-utils'
import { append0x, hexToUtf8, remove0x, utf8ToHex } from './utils'

const CLASS_FIXED_LEN = 20 // The length of hex (10bytes)
const NFT_FIXED_LEN = 22 // The length of hex (11bytes)
const DYN_SIZE = 4 // The length of hex (2bytes)

export const dataFormatToJsonHex = (dataFormat: DataFormat): string => utf8ToHex(JSON.stringify(dataFormat))

export const hexToHash = (jsonHex: HexString): string => bytesToHex(blake160(hexToBytes(jsonHex)))

export const witnessJsonHexToDataFormat = (witness: HexString) => {
  try {
    return JSON.parse(hexToUtf8(witness)) as DataFormat
  } catch (error) {
    console.error(`Parse witness json error: ${error}`)
  }
}

export const parseExtInfoFromClassData = (classData: HexString): ExtensionFormat => {
  const data = remove0x(classData)
  if (data.length < CLASS_FIXED_LEN) {
    throw new Error('Class cell data length error')
  }
  let extInfo = ''
  try {
    let dynamic = data.substring(CLASS_FIXED_LEN)
    const nameDynLen = parseInt(dynamic.substring(0, DYN_SIZE), 16) * 2 + DYN_SIZE
    dynamic = dynamic.substring(nameDynLen)
    const descriptionDynLen = parseInt(dynamic.substring(0, DYN_SIZE), 16) * 2 + DYN_SIZE
    dynamic = dynamic.substring(descriptionDynLen)
    const rendererDynLen = parseInt(dynamic.substring(0, DYN_SIZE), 16) * 2 + DYN_SIZE
    dynamic = dynamic.substring(rendererDynLen)
    const extInfoLen = parseInt(dynamic.substring(0, DYN_SIZE), 16) * 2
    extInfo = dynamic.substring(DYN_SIZE, DYN_SIZE + extInfoLen)
  } catch (error) {
    throw new Error(`Parse class data error: ${error}`)
  }
  try {
    const extInfoJson = hexToUtf8(`0x${extInfo}`)
    return JSON.parse(extInfoJson) as ExtensionFormat
  } catch (error) {
    throw new Error(`Parse json to ExtensionFormat error: ${error}`)
  }
}

export const parseCharacteristicFromNftData = (nftData: HexString): Uint8Array => {
  const data = remove0x(nftData)
  if (data.length < NFT_FIXED_LEN) {
    throw new Error('nft cell data length error')
  }
  return hexToBytes(append0x(data.substring(2, 18)))
}
