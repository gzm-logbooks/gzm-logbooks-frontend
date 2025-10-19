import { defineStore } from 'pinia'
import { ref, watchEffect, watch, computed, readonly, toRaw } from 'vue'

import { analysisSectionPrompts, growthInputDefaults } from '~/data/mood'

class UniqueID {
  static idCounter = 0

  static generateID(): number {
    return this.idCounter++
  }
}

export type MoodRating = {
  anxiety: number
  growth: number
  comfort: number
}

export function useRatingStore(initialState?: MoodRating, key?: number) {
  const storeKey = key || UniqueID.generateID()

  return defineStore(`rating[${storeKey}]`, () => {
    const state = ref<MoodRating>(initialState)

    // const updateAnxietyScale = function () {}

    const updateGrowthScale = function (circle, scale) {
      const { padding, minRadius } = growthInputDefaults

      //
      state.value.growth = clamp(
        scale - this.dragDiff,
        minRadius + padding,
        1 - padding,
      )

      if (this.model.growth - this.model.comfort < padding) {
        state.value.comfort = this.model.growth - padding
      }
    }

    const updateComfortScale = function (circle, scale) {
      const { padding, minRadius } = growthInputDefaults

      //
      state.value.comfort = clamp(
        scale - this.dragDiff,
        minRadius,
        1 - padding * 2,
      )

      if (this.model.growth - this.model.comfort < padding) {
        state.value.growth = this.model.comfort + padding
      }
    }

    /**
     *
     */
    function scaledMoodInput() {
      const { amountAnxiety, amountGrowth, amountComfort } = state.value
      return {
        amountAnxiety: (amountAnxiety - amountGrowth - 0.05) / 0.8,
        amountGrowth: (amountGrowth - amountComfort - 0.05) / 0.8,
        amountComfort: (amountComfort - 0.1) / 0.8,
      }
    }

    /**
     *
     */
    const section = computed(() => {
      const { amountAnxiety, amountGrowth, amountComfort } = state.value

      if (amountAnxiety < 1 / 3 && amountComfort < 1 / 3) {
        return 1
      } else if (amountAnxiety < 1 / 3 && amountComfort < 2 / 3) {
        return 2
      } else if (amountAnxiety < 2 / 3 && amountComfort < 1 / 3) {
        return 3
      } else if (amountComfort > 2 / 3) {
        return 4
      } else if (amountAnxiety > 1 / 3 && amountComfort > 1 / 3) {
        return 5
      } else if (amountAnxiety > 2 / 3) {
        return 6
      }

      return null
    })

    const questionPrompt = computed(() => {
      const section = section.value

      if (section) {
        return analysisSectionPrompts[section] ?? null
      }

      //
      return null
    })

    return {
      state,

      scaledMoodInput,

      updateGrowthScale,
      updateComfortScale,

      section,
      questionPrompt,
    }
  })()
}
