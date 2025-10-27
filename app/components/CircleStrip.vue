<template>
  <svg width="100%" height="100%">
    <rect
      width="100%"
      height="100%"
      transform-origin="center"
      :transform="scaleRed"
      :fill="ratingColors.anxiety"
    />

    <rect
      width="100%"
      height="100%"
      transform-origin="center"
      :transform="scaleAmber"
      :fill="ratingColors.growth"
    />

    <rect
      width="100%"
      height="100%"
      transform-origin="center"
      :transform="scaleGreen"
      :fill="ratingColors.comfort"
    />
  </svg>
</template>

<script lang="ts">
import tailwindConfig from '#tailwind-config'
import { useTheme } from '~/composables/useTheme'
import { useRatingStore } from '~/store/rating'

export default {
  props: {
    state: {},
  },
  setup() {
    const { ratingColors } = useTheme()

    return {
      ratingColors,
    }
  },
  computed: {
    scaleRed() {
      return `scale(${this.state.anxiety},1)`
    },
    scaleAmber() {
      return `scale(${this.state.growth},1)`
    },
    scaleGreen() {
      return `scale(${this.state.comfort},1)`
    },
  },
}
</script>
