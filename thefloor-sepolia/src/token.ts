// src/erc20-token-template.ts

import { Transfer as TransferEvent } from "../generated/templates/TokenTemplate/Token"
import { UserBalance, VaultERC20 } from "../generated/schema"
import { Address, BigInt, store } from "@graphprotocol/graph-ts"

export function handleTransfer(event: TransferEvent): void {
  let tokenAddress = event.address.toHex()
  let fromAddress = event.params.from
  let toAddress = event.params.to
  let value = event.params.value

  // update sender balance
  if (!fromAddress.equals(Address.zero())) {
    updateBalance(tokenAddress, fromAddress, value.times(BigInt.fromI32(-1))) // multiply value by -1
  }

  if (!toAddress.equals(Address.zero())) {
    updateBalance(tokenAddress, toAddress, value)
  }
}

function updateBalance(
  tokenAddress: string,
  userAddress: Address,
  amount: BigInt
): void {
  let id = tokenAddress + "-" + userAddress.toHex()
  let balance = UserBalance.load(id)

  if (balance == null && amount > BigInt.fromI32(0)) {
    balance = new UserBalance(id)
    balance.user = userAddress
    balance.vaultERC20 = tokenAddress
    balance.balance = BigInt.fromI32(0)
  }

  if (balance != null) {
    balance.balance = balance.balance.plus(amount)

    // if balance == 0 delete entity
    if (balance.balance == BigInt.fromI32(0)) {
      store.remove("UserBalance", id)
    } else {
      balance.save()
    }
  }
}
