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
  VaultERC20,
  Withdraw,
  WithdrawBatch,
} from "../generated/schema"

import { VaultCreated, VaultNFT } from "../generated/schema"

import { BigInt, Bytes, Entity, store } from "@graphprotocol/graph-ts"

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

  let nftId = vaultId + "-" + event.params.id.toString()
  let vaultNft = new VaultNFT(nftId)
  vaultNft.vault = vaultId // Assurez-vous que le champ 'vault' dans VaultNFT accepte un ID sous forme de chaîne
  vaultNft.tokenId = event.params.id
  vaultNft.amount = event.params.amounts
  vaultNft.save()
}

export function handleDepositBatch(event: DepositBatchEvent): void {
  let vaultId = event.address.toHex()

  for (let i = 0; i < event.params.ids.length; i++) {
    let nftId = vaultId + "-" + event.params.ids[i].toString()
    let vaultNft = VaultNFT.load(nftId)
    if (vaultNft == null) {
      vaultNft = new VaultNFT(nftId)
      vaultNft.vault = vaultId
      vaultNft.tokenId = event.params.ids[i]
      vaultNft.amount = event.params.amounts[i]
    } else {
      vaultNft.amount = vaultNft.amount.plus(event.params.amounts[i])
    }

    vaultNft.save()
  }
}

export function handleSwap(event: SwapEvent): void {
  let vaultId = event.address.toHex()
  // Remove withdrawn NFT from store
  let toNftId = vaultId + "-" + event.params.toId.toString()
  store.remove("VaultNFT", toNftId)
  // Create entry for deposited NFT
  let fromNftId = vaultId + "-" + event.params.fromId.toString()
  let toVaultNft = new VaultNFT(fromNftId)
  toVaultNft.vault = vaultId
  toVaultNft.tokenId = event.params.fromId
  toVaultNft.amount = new BigInt(1)
  toVaultNft.save()
}

export function handleTokenCreated(event: TokenCreatedEvent): void {
  let vaultId = event.address.toHex()

  let erc20 = new VaultERC20(event.params.token.toHex())
  erc20.vault = vaultId
  erc20.VaultId = event.params.id
  erc20.erc20 = event.params.token

  erc20.save()
}

export function handleWithdraw(event: WithdrawEvent): void {
  let vaultId = event.address.toHex()
  let nftId = vaultId + "-" + event.params.id.toString()

  store.remove("VaultNFT", nftId)
}

export function handleWithdrawBatch(event: WithdrawBatchEvent): void {
  let vaultId = event.address.toHex()
  for (let i = 0; i < event.params.ids.length; i++) {
    let nftId = vaultId + "-" + event.params.ids[i].toString()
    let vaultNft = VaultNFT.load(nftId)
    if (vaultNft != null) {
      if (vaultNft.amount == event.params.amounts[i]) {
        store.remove("VaultNFT", nftId)
      } else {
        vaultNft.amount = vaultNft.amount.minus(event.params.amounts[i])
        vaultNft.save()
      }
    }
  }
}
