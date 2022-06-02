<template>
  <div :class="classes">
    <slot />
  </div>
</template>

<script lang="ts">
export default {
  props: {
    max: {
      type: String,
      default: 'xl',
    },
  },
  data() {
    return {
      sizes: [
        { width: 'xl' },
        { breakpoint: 'sm' },
        { breakpoint: 'md', width: '4xl' },
        { breakpoint: 'lg' },
        { breakpoint: 'xl', width: '7xl' },
      ],
    }
  },
  computed: {
    activeSizes() {
      const maxIndex = this.sizes.findIndex(
        (size) => size.breakpoint === this.max
      )

      if (maxIndex > 0) {
        return this.sizes.slice(0, maxIndex + 1)
      }

      return this.sizes
    },
    classes() {
      const widths = this.activeSizes.map((size) => {
        const { breakpoint, width } = size

        if (width) {
          const prefix = breakpoint ? `${breakpoint}:` : ''

          return `${prefix}max-w-${width}`
        }

        //
        return null
      })

      // Return array of class strings.
      return ['w-full', ...widths, 'mx-auto']
    },
  },
}
</script>
