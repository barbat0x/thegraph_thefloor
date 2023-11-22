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

import { VaultCreated, VaultNFT } from "../generated/schema"

import { Bytes, store } from "@graphprotocol/graph-ts"

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
  let vaultId = event.address.toHex()

  let nftId = event.params.id.toString()
  let vaultNft = new VaultNFT(nftId)
  vaultNft.tokenId = event.params.id
  vaultNft.vault = vaultId // Assurez-vous que le champ 'vault' dans VaultNFT accepte un ID sous forme de chaîne
  vaultNft.save()
}

export function handleDepositBatch(event: DepositBatchEvent): void {
  let vaultId = event.address.toHex()

  for (let i = 0; i < event.params.ids.length; i++) {
    let nftId = event.params.ids[i].toString()
    let vaultNft = new VaultNFT(nftId)
    vaultNft.tokenId = event.params.ids[i]
    vaultNft.vault = vaultId
    vaultNft.save()
  }
}

export function handleSwap(event: SwapEvent): void {
  let vaultId = event.address.toHex()
  // Traitement du NFT sortant
  let fromNftId = event.params.fromId.toString()
  store.remove("VaultNFT", fromNftId)

  // Traitement du NFT entrant
  let toNftId = event.params.toId.toString()
  let toVaultNft = new VaultNFT(toNftId)
  toVaultNft.tokenId = event.params.toId
  toVaultNft.vault = vaultId
  toVaultNft.save()
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

  store.remove("VaultNFT", nftId)
}

export function handleWithdrawBatch(event: WithdrawBatchEvent): void {
  for (let i = 0; i < event.params.ids.length; i++) {
    let nftId = event.params.ids[i].toString()

    store.remove("VaultNFT", nftId)
  }
}
