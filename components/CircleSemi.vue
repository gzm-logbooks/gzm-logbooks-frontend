<template>
  <svg width="100%" height="100%" viewBox="0 0 100 50">
    <path
      d="M0,50 a1,1 0 0,1 100,0"
      transform-origin="bottom center"
      :transform="scaleRed"
      :fill="red"
    />
    <path
      d="M0,50 a1,1 0 0,1 100,0"
      transform-origin="bottom center"
      :transform="scaleAmber"
      :fill="amber"
    />
    <path
      d="M0,50 a1,1 0 0,1 100,0"
      transform-origin="bottom center"
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
      return `scale(${this.state.red})`
    },
    scaleAmber() {
      return `scale(${this.state.amber})`
    },
    scaleGreen() {
      return `scale(${this.state.green})`
    },
  },
}
</script>
