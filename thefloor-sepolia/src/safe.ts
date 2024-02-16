import { BigInt, store } from '@graphprotocol/graph-ts'
import {
    Safe,
    Burn,
    Deposit,
    ExpiredBought,
    Withdraw,
} from '../generated/Safe/Safe'
import {
    SafeDeposit,
    SafeWithdraw,
    SafeUnderlying,
    SafeBurn,
    SafeContract,
    SafeExpiredBought,
} from '../generated/schema'

export function handleSafeBurn(event: Burn): void {
    let entity = new SafeBurn(
        event.transaction.hash.toHex() + '-' + event.logIndex.toString()
    )
    entity.collection = event.params.collection
    entity.tokenId = event.params.id
    entity.to = event.params.to
    entity.save()

    store.remove(
        'SafeUnderlying',
        event.params.collection.toHex() + '-' + event.params.id.toString()
    )
}

export function handleSafeDeposit(event: Deposit): void {
    let entity = new SafeDeposit(
        event.transaction.hash.toHex() + '-' + event.logIndex.toString()
    )
    entity.collection = event.params.collection
    entity.tokenId = event.params.tokenId
    entity.expiration = event.params.expiration
    entity.from = event.params.to
    entity.save()

    let safe = SafeContract.load(event.address.toHex())

    if (!safe) {
        safe = new SafeContract(event.address.toHex())
        safe.save()
    }

    let underlying = SafeUnderlying.load(
        event.params.collection.toHex() + '-' + event.params.tokenId.toString()
    )

    if (!underlying) {
        underlying = new SafeUnderlying(
            event.params.collection.toHex() +
                '-' +
                event.params.tokenId.toString()
        )
        underlying.collection = event.params.collection
        underlying.tokenId = event.params.tokenId
        underlying.expiration = event.params.expiration
        underlying.sender = event.params.to
        underlying.safe = event.address.toHex()
        underlying.save()
    }
}

export function handleExpiredBought(event: ExpiredBought): void {
    let entity = new SafeExpiredBought(
        event.transaction.hash.toHex() + '-' + event.logIndex.toString()
    )
    entity.collection = event.params.collection
    entity.tokenId = event.params.id
    entity.to = event.params.to
    entity.save()

    store.remove(
        'SafeUnderlying',
        event.params.collection.toHex() + '-' + event.params.id.toString()
    )
}

export function handleSafeWithdraw(event: Withdraw): void {
    let entity = new SafeWithdraw(
        event.transaction.hash.toHex() + '-' + event.logIndex.toString()
    )
    entity.collection = event.params.collection
    entity.tokenId = event.params.id
    entity.to = event.params.to
    entity.save()

    store.remove(
        'SafeUnderlying',
        event.params.collection.toHex() + '-' + event.params.id.toString()
    )
}
