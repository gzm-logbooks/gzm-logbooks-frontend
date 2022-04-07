import { clamp, defaults } from 'lodash-es'

export const growthInputDefaults = {
  padding: 0.05,
  minRadius: 0.1,
  maxDepth: 2,
}

export function validateMoodInput(value) {
  const { padding, minRadius } = growthInputDefaults

  // const max = { red: 0.05, amber: 0.33 }

  const amountGreen = clamp(value.amountGreen, minRadius, 1 - padding * 2)
  const amountAmber = clamp(
    value.amountAmber,
    amountGreen + padding,
    1 - padding
  )

  return {
    amountGreen,
    amountAmber,
    amountRed: 1,
  }
}
