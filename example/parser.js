const { dataFormatToJsonHex, utf8ToHex, u16ToBe, hexToHash, remove0x } = require('@nervina/extension-core')

const json = {
  type: {
    enum: [
      {
        name: 'Background',
        values: {
          YELLOW: 0,
          GREEN: 1,
          RED: 2,
        },
      },
      {
        name: 'Texture',
        values: {
          YELLOW: 0,
          GREEN: 1,
          RED: 2,
        },
      },
    ],
  },
  data: [
    {
      name: 'weight',
      type: 'UInt8',
      position: 0,
    },
    {
      name: 'background',
      type: 'Background',
      position: 8,
    },
    {
      name: 'texture',
      type: 'Texture',
      position: 16,
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
