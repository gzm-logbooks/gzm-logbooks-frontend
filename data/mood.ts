export const growthInputDefaults = {
  padding: 0.05,
  minRadius: 0.1,
  maxDepth: 2,
}

export const analysisSectionPrompts = [
  'Zone not found', // Zone 0 (null)
  'You were in the best zone for learning, good job! What do you think helped you stay in the growth zone?',
  'Looks like you have found your growth zone, what could you do to spend more time there?',
  'Looks like you have found your growth zone, what could you do to spend more time there?',
  'Looks like you stayed in the comfort zone a lot of the time. What could you do to challenge yourself?',
  'Looks like you need to develop a growth zone, where you feel safe to take risks and can cope with manageable challenges. What could help you feel safe enough to take a risk?',
  'Looks like you felt out of your depth a lot of the time. What could you have done to calm down?',
]

export const defaultState: MoodRating = {
  amountAnxiety: 3 / 3,
  amountGrowth: 2 / 3,
  amountComfort: 1 / 3,
}

export type MoodRating = {
  amountAnxiety: number
  amountGrowth: number
  amountComfort: number
}
