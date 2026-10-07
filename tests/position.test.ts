import { describe, expect, it } from "vitest"
import { positionBetween } from "@/lib/position"

describe("positionBetween", () => {
  it("starts an empty column at 1000", () => expect(positionBetween()).toBe(1000))
  it("puts a card at the top", () => expect(positionBetween(undefined, 1000)).toBe(0))
  it("puts a card at the bottom", () => expect(positionBetween(1000)).toBe(2000))
  it("puts a card between two others", () => expect(positionBetween(1000, 2000)).toBe(1500))
})
