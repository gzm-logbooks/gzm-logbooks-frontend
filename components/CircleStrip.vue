<template>
  <svg width="100%" height="100%">
    <rect
      width="100%"
      height="100%"
      transform-origin="center"
      :transform="scaleRed"
      :fill="red"
    />

    <rect
      width="100%"
      height="100%"
      transform-origin="center"
      :transform="scaleAmber"
      :fill="amber"
    />

    <rect
      width="100%"
      height="100%"
      transform-origin="center"
      :transform="scaleGreen"
      :fill="green"
    />
  </svg>
</template>

<script>
import tailwindConfig from '#tailwind-config'

export default {
  props: {
    state: {
      type: Object,
      default() {
        return {
          red: 3 / 3,
          amber: 2 / 3,
          green: 1 / 3,
        }
      },
    },
  },
  data() {
    const {
      'light-comfort': comfort,
      'light-growth': growth,
      'light-anxiety': anxiety,
    } = tailwindConfig.theme.colors
    return {
      red: anxiety,
      amber: growth,
      green: comfort,
    }
  },
  computed: {
    scaleRed() {
      return `scale(${this.state.red},1)`
    },
    scaleAmber() {
      return `scale(${this.state.amber},1)`
    },
    scaleGreen() {
      return `scale(${this.state.green},1)`
    },
  },
}
</script>
