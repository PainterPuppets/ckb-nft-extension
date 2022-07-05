const { dataFormatToJsonHex, utf8ToHex, u16ToBe, hexToHash, remove0x } = require('@painterpuppets/nft-extension-core')

const json = {
  type: {
    enum: [],
  },
  data: [
    {
      name: 'rarity',
      type: 'UInt8',
      position: 0,
    },
  ],
}

const witnessJsonHex = dataFormatToJsonHex(json)
console.log(`witnessJsonHex: ${witnessJsonHex}`)

const extInfoJson = {
  id: 'po',
  hash: hexToHash(witnessJsonHex),
}
const extInfoContent = remove0x(utf8ToHex(JSON.stringify(extInfoJson)))
console.log(`extInfoContent: ${extInfoContent}`)
const extInfo = `${u16ToBe(extInfoContent.length)}${extInfoContent}`
console.log(`extInfo: ${extInfo}`)
