<template>
  <svg width="100%" height="100%" viewBox="0 0 100 50">
    <path
      d="M0,50 a1,1 0 0,1 100,0"
      transform-origin="bottom center"
      :transform="scaleRed"
      :fill="ratingColors.anxiety"
    />
    <path
      d="M0,50 a1,1 0 0,1 100,0"
      transform-origin="bottom center"
      :transform="scaleAmber"
      :fill="ratingColors.growth"
    />
    <path
      d="M0,50 a1,1 0 0,1 100,0"
      transform-origin="bottom center"
      :transform="scaleGreen"
      :fill="ratingColors.comfort"
    />
  </svg>
</template>

<script lang="ts">
import { useTheme } from '~/composables/useTheme'

export default {
  props: {
    state: {
      type: Object,
    },
  },
  setup() {
    const { ratingColors } = useTheme()

    return {
      ratingColors,
    }
  },
  computed: {
    scaleRed() {
      return `scale(${this.state.anxiety})`
    },
    scaleAmber() {
      return `scale(${this.state.growth})`
    },
    scaleGreen() {
      return `scale(${this.state.comfort})`
    },
  },
}
</script>
