import { DataSourceContext } from "@graphprotocol/graph-ts"
import { VaultCreated as VaultCreatedEvent } from "../generated/Factory/Factory"
import { VaultCreated } from "../generated/schema"
import { VaultTemplate } from "../generated/templates"

export function handleVaultCreated(event: VaultCreatedEvent): void {
  let entity = new VaultCreated(event.params.vault.toHex())
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
