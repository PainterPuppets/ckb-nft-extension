import { hexToBytes, bytesToHex } from '@nervosnetwork/ckb-sdk-utils'
import { TextEncoder, TextDecoder } from 'util'
import camelcaseKeys from 'camelcase-keys'

export const toCamelCase = <T>(object: any): T | null => {
  try {
    return JSON.parse(
      JSON.stringify(
        camelcaseKeys(object, {
          deep: true,
        }),
      ),
    ) as T
  } catch (error) {
    console.error(error)
  }
  return null
}

export const remove0x = (hex?: string) => {
  if (hex?.startsWith('0x')) {
    return hex.substring(2)
  }
  return hex
}

export const append0x = (hex?: string) => {
  return hex?.startsWith('0x') ? hex : `0x${hex}`
}

export const utf8ToHex = (text: string) => {
  let result = text.trim()
  if (result.startsWith('0x')) {
    return result
  }
  result = bytesToHex(new TextEncoder().encode(result))
  return result
}

export const hexToUtf8 = (hex: string) => {
  let result = hex.trim()
  try {
    result = new TextDecoder().decode(hexToBytes(result))
  } catch (error) {
    console.error('hexToUtf8 error:', error)
  }
  return result
}
