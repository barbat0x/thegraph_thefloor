import {
  Deposit as DepositEvent,
  DepositBatch as DepositBatchEvent,
  Initialized as InitializedEvent,
  Swap as SwapEvent,
  TokenCreated as TokenCreatedEvent,
  Withdraw as WithdrawEvent,
  WithdrawBatch as WithdrawBatchEvent,
} from "../generated/Vault/Vault"
import {
  Deposit,
  DepositBatch,
  Initialized,
  Swap,
  TokenCreated,
  Withdraw,
  WithdrawBatch,
} from "../generated/schema"

import { VaultNFT } from "../generated/schema"

import { store } from "@graphprotocol/graph-ts"

export function handleInitialized(event: InitializedEvent): void {
  let entity = new Initialized(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.version = event.params.version

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleDeposit(event: DepositEvent): void {
  let nftId = event.params.id.toString()
  let nft = VaultNFT.load(nftId)

  if (nft == null) {
    nft = new VaultNFT(nftId)
    nft.tokenId = event.params.id
  }

  nft.vault = event.address
  nft.save()
}

export function handleDepositBatch(event: DepositBatchEvent): void {
  for (let i = 0; i < event.params.ids.length; i++) {
    let nftId = event.params.ids[i].toString()
    let nft = VaultNFT.load(nftId)

    if (nft == null) {
      nft = new VaultNFT(nftId)
      nft.tokenId = event.params.ids[i]
      nft.vault = event.address
    }

    nft.save()
  }
}

export function handleSwap(event: SwapEvent): void {
  // Traitement du VaultNFT envoyé au Vault (fromId)
  let fromNftId = event.params.fromId.toString()
  let fromNft = VaultNFT.load(fromNftId)

  if (fromNft == null) {
    fromNft = new VaultNFT(fromNftId)
    fromNft.tokenId = event.params.fromId
    // Initialiser d'autres champs pertinents ici
  }

  fromNft.vault = event.address // L'adresse du Vault
  fromNft.save()

  // Traitement du VaultNFT retiré du Vault (toId)
  let toNftId = event.params.toId.toString()
  let toNft = VaultNFT.load(toNftId)

  if (toNft != null) {
    store.remove("VaultNFT", toNftId)
  }
}

export function handleTokenCreated(event: TokenCreatedEvent): void {
  let entity = new TokenCreated(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.token = event.params.token
  entity.Vault_id = event.params.id

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleWithdraw(event: WithdrawEvent): void {
  let nftId = event.params.id.toString()
  let nft = VaultNFT.load(nftId)

  if (nft != null) {
    store.remove("VaultNFT", nftId)
  }
}

export function handleWithdrawBatch(event: WithdrawBatchEvent): void {
  for (let i = 0; i < event.params.ids.length; i++) {
    let nftId = event.params.ids[i].toString()
    store.remove("VaultNFT", nftId)
  }
}
