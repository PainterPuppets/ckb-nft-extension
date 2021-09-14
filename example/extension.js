const { Extension } = require('@nervina/nft-extension-core')

const run = async () => {
  const extension = new Extension({
    ckbNode: 'https://testnet.ckb.dev/rpc',
    ckbIndexer: 'https://testnet.ckb.dev/indexer',
    network: 'testnet',
    classId: '0x3939ecec56db8161b6308c84d6f5f9f12d00d1f000000000',
  })
  await extension.init()

  const blockNumber = await extension.getTipBlockNumber()
  console.log(blockNumber)

  const cells = await extension.getNftCells(0)
  console.log(JSON.stringify(cells))

  console.log(JSON.stringify(await extension.getNftCells()))

  const txs = await extension.getNftTransactions(1)
  console.log(JSON.stringify(txs))

  console.log(JSON.stringify(await extension.getNftTransactions()))
}

run()
