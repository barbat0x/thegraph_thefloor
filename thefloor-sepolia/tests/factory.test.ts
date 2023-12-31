import {
  assert,
  describe,
  test,
  clearStore,
  beforeAll,
  afterAll
} from "matchstick-as/assembly/index"
import { Address } from "@graphprotocol/graph-ts"
import { VaultCreated } from "../generated/schema"
import { VaultCreated as VaultCreatedEvent } from "../generated/Factory/Factory"
import { handleVaultCreated } from "../src/factory"
import { createVaultCreatedEvent } from "./factory-utils"

// Tests structure (matchstick-as >=0.5.0)
// https://thegraph.com/docs/en/developer/matchstick/#tests-structure-0-5-0

describe("Describe entity assertions", () => {
  beforeAll(() => {
    let vault = Address.fromString("0x0000000000000000000000000000000000000001")
    let collection = Address.fromString(
      "0x0000000000000000000000000000000000000001"
    )
    let newVaultCreatedEvent = createVaultCreatedEvent(vault, collection)
    handleVaultCreated(newVaultCreatedEvent)
  })

  afterAll(() => {
    clearStore()
  })

  // For more test scenarios, see:
  // https://thegraph.com/docs/en/developer/matchstick/#write-a-unit-test

  test("VaultCreated created and stored", () => {
    assert.entityCount("VaultCreated", 1)

    // 0xa16081f360e3847006db660bae1c6d1b2e17ec2a is the default address used in newMockEvent() function
    assert.fieldEquals(
      "VaultCreated",
      "0xa16081f360e3847006db660bae1c6d1b2e17ec2a-1",
      "vault",
      "0x0000000000000000000000000000000000000001"
    )
    assert.fieldEquals(
      "VaultCreated",
      "0xa16081f360e3847006db660bae1c6d1b2e17ec2a-1",
      "collection",
      "0x0000000000000000000000000000000000000001"
    )

    // More assert options:
    // https://thegraph.com/docs/en/developer/matchstick/#asserts
  })
})
