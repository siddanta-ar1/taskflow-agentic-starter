// Fractional ordering: a card dropped between two neighbours gets the midpoint,
// so a move only ever updates ONE row.
export function positionBetween(before?: number, after?: number): number {
  if (before === undefined && after === undefined) return 1000
  if (before === undefined) return after! - 1000
  if (after === undefined) return before + 1000
  return (before + after) / 2
}
