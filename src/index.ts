import { DataFormat } from './types'

const dataFormatToJson = (dataFormat: DataFormat) => JSON.stringify(dataFormat)

const run = () => {
  const dataFormat: DataFormat = {
    type: {
      enum: [
        {
          name: 'Color',
          values: {
            red: 0,
            yellow: 1,
            blue: 2,
          },
        },
        {
          name: 'Size',
          values: {
            small: 0,
            medium: 1,
            big: 2,
          },
        },
      ],
    },
    data: [
      {
        name: 'Header',
        type: 'Color',
        position: 0,
      },
      {
        name: 'Footer',
        type: 'Size',
        position: 8,
      },
      {
        name: 'Body',
        type: 'UInt8',
        position: 16,
      },
    ],
  }
  const json = dataFormatToJson(dataFormat)
  console.log(json)
}

run()
