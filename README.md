# ckb-nft-extension

The extension of Nervos CKB NFT

## Quick Start

```
yarn add @painterpuppets/nft-extension-core
```

## Modules

The repo root which organized via monorepo mode, that composed of the following modules

- @painterpuppets/nft-extension-core - The core SDK used to interact with Nervos CKB NFT extension
- @painterpuppets/nft-extension-types - The TypeScript definitions

## Examples

- [parser.js](https://github.com/duanyytop/ckb-nft-extension/blob/main/example/parser.js) Parse class transaction witness and NFT cell ext_info data
- [extension.js](https://github.com/duanyytop/ckb-nft-extension/blob/main/example/extension.js) Use Extension Class to fetch NFT cells and transactions
