export function drawNumber(total: number, drawn: number[]): number | null {
  if (drawn.length >= total) return null

  const available: number[] = []
  for (let i = 1; i <= total; i++) {
    if (!drawn.includes(i)) available.push(i)
  }

  const randomIndex = Math.floor(Math.random() * available.length)
  return available[randomIndex]
}

export function getAllNumbers(total: number): number[] {
  return Array.from({ length: total }, (_, i) => i + 1)
}

export function getRemainingNumbers(total: number, drawn: number[]): number[] {
  return getAllNumbers(total).filter((n) => !drawn.includes(n))
}
