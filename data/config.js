import { clamp, defaults } from 'lodash-es'

export const growthInputDefaults = {
  padding: 0.05,
  minRadius: 0.1,
  maxDepth: 2,
}

/**
 *
 */
export function validateMoodInput(value) {
  const { padding, minRadius } = growthInputDefaults

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

/**
 *
 */
export function scaledModeInput({ amountRed, amountAmber, amountGreen }) {
  return {
    amountRed: (amountRed - amountAmber - 0.05) / 0.8,
    amountAmber: (amountAmber - amountGreen - 0.05) / 0.8,
    amountGreen: (amountGreen - 0.1) / 0.8,
  }
}
