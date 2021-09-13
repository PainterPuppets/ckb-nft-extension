const { Extension } = require('@nervina/nft-extension-core')

const run = async () => {
  const extension = new Extension({
    ckbNode: 'https://testnet.ckb.dev/rpc',
    ckbIndexer: 'https://testnet.ckb.dev/indexer',
    network: 'testnet',
    classId: '0x767023b5817307973f18a9a4f4a018fc5a03af5300000003',
  })
  await extension.init()

  const blockNumber = await extension.getTipBlockNumber()
  console.log(blockNumber)

  const cells = await extension.getNftCells()
  console.log(JSON.stringify(cells))

  const txs = await extension.getNftTransactions()
  console.log(JSON.stringify(txs))
}

run()
