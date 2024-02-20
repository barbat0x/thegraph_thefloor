import { Address, BigInt, store } from '@graphprotocol/graph-ts'
import {
    Safe,
    Burn,
    Deposit,
    ExpiredBought,
    Withdraw,
    Transfer,
} from '../generated/Safe/Safe'
import {
    SafeDeposit,
    SafeWithdrawal,
    SafeNFT,
    SafeBurn,
    SafeContract,
    SafeExpiredBought,
    SafeUnderlyingNFT,
} from '../generated/schema'

export function handleSafeBurn(event: Burn): void {
    let entity = new SafeBurn(
        event.transaction.hash.toHex() + '-' + event.logIndex.toString()
    )
    entity.collection = event.params.collection
    entity.tokenId = event.params.tokenId
    entity.to = event.params.to
    entity.save()

    store.remove(
        'SafeNFT',
        event.params.collection.toHex() + '-' + event.params.tokenId.toString()
    )

    store.remove('SafeUnderlyingNFT', event.params.id.toString())
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

    let underlying = new SafeUnderlyingNFT(event.params.id.toString())
    underlying.collection = event.params.collection
    underlying.tokenId = event.params.tokenId
    underlying.expiration = event.params.expiration
    underlying.owner = event.params.to
    underlying.withdrawn = false
    underlying.save()

    let nft = SafeNFT.load(
        event.params.collection.toHex() + '-' + event.params.tokenId.toString()
    )

    if (!nft) {
        nft = new SafeNFT(
            event.params.collection.toHex() +
                '-' +
                event.params.tokenId.toString()
        )
        nft.safe = event.address.toHex()
        nft.underlying = underlying.id
        nft.save()
    }
}

export function handleSafeWithdraw(event: Withdraw): void {
    let entity = new SafeWithdrawal(
        event.transaction.hash.toHex() + '-' + event.logIndex.toString()
    )
    entity.collection = event.params.collection
    entity.tokenId = event.params.tokenId
    entity.to = event.params.to
    entity.save()

    store.remove(
        'SafeNFT',
        event.params.collection.toHex() + '-' + event.params.tokenId.toString()
    )
    store.remove('SafeUnderlyingNFT', event.params.id.toString())
}

export function handleExpiredBought(event: ExpiredBought): void {
    let entity = new SafeExpiredBought(
        event.transaction.hash.toHex() + '-' + event.logIndex.toString()
    )
    entity.collection = event.params.collection
    entity.tokenId = event.params.tokenId
    entity.to = event.params.to
    entity.save()

    store.remove(
        'SafeNFT',
        event.params.collection.toHex() + '-' + event.params.tokenId.toString()
    )

    let safeUnderlying = SafeUnderlyingNFT.load(event.params.id.toString())

    if (safeUnderlying) {
        safeUnderlying.withdrawn = true
        safeUnderlying.save()
    }
}

export function handleTransfer(event: Transfer): void {
    let fromAddress = event.params.from
    let toAddress = event.params.to

    // Mint && Burn already handled by the Safe events
    if (
        fromAddress.equals(Address.zero()) ||
        toAddress.equals(Address.zero())
    ) {
        return
    }

    let entity = SafeUnderlyingNFT.load(event.params.tokenId.toString())

    if (entity) {
        if (entity.owner == fromAddress) {
            entity.owner = toAddress
            entity.save()
        }
    }
}
