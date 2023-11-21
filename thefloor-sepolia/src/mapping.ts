import { DataSourceContext } from "@graphprotocol/graph-ts"

import { VaultCreated as VaultCreatedEvent } from "../generated/Factory/Factory"
import { VaultCreated } from "../generated/schema"

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

import { VaultTemplate } from "../generated/templates" // Assurez-vous que le chemin est correct

export function handleVaultCreated(event: VaultCreatedEvent): void {
  let entity = new VaultCreated(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.vault = event.params.vault
  entity.collection = event.params.collection

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()

  // Initialisation de la source de données dynamique pour la nouvelle instance de Vault
  let context = new DataSourceContext()
  context.setBytes("vaultAddress", event.params.vault)
  VaultTemplate.createWithContext(event.params.vault, context)
}

export function handleDeposit(event: DepositEvent): void {
  let entity = new Deposit(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.to = event.params.to
  entity.Vault_id = event.params.id
  entity.amounts = event.params.amounts

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleDepositBatch(event: DepositBatchEvent): void {
  let entity = new DepositBatch(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.to = event.params.to
  entity.ids = event.params.ids
  entity.amounts = event.params.amounts

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

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

export function handleSwap(event: SwapEvent): void {
  let entity = new Swap(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.to = event.params.to
  entity.fromId = event.params.fromId
  entity.toId = event.params.toId

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
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
  let entity = new Withdraw(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.to = event.params.to
  entity.Vault_id = event.params.id
  entity.amounts = event.params.amounts

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleWithdrawBatch(event: WithdrawBatchEvent): void {
  let entity = new WithdrawBatch(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.to = event.params.to
  entity.ids = event.params.ids
  entity.amounts = event.params.amounts

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}
