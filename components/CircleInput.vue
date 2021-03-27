<template>
  <div class="raginput">
    <div class="raginput__inner">
      <svg
        viewBox="0 0 1 1"
        class="raginput__inner__svg"
        @mousemove="update"
        @mousedown="mousedown"
        @mouseup="mouseup"
        @mouseleave="mouseup"
      >
        <circle
          ref="background"
          cx="0.5"
          cy="0.5"
          r="0.5"
          class="raginput__background"
        />
        <circle
          cx="0.5"
          cy="0.5"
          :r="redSize"
          class="raginput__circle raginput__circle--outer"
        />
        <circle
          cx="0.5"
          cy="0.5"
          :r="amberSize"
          class="raginput__circle raginput__circle--middle"
        />
        <circle
          cx="0.5"
          cy="0.5"
          :r="greenSize"
          class="raginput__circle raginput__circle--inner"
        />
      </svg>
    </div>
  </div>
</template>

<script>
export default {
  components: {},
  props: {
    redSize: {
      type: Number,
      default: 0.5,
    },
    amberSize: {
      type: Number,
      default: 0.33,
    },
    greenSize: {
      type: Number,
      default: 0.17,
    },
  },
  data() {
    return {
      held: false,
    }
  },
  methods: {
    mousedown(event) {
      this.held = true
    },
    mouseup(event) {
      this.held = false
    },
    update(event) {
      if (this.held) {
        this.animate(event)
      }
    },

    animate(event) {
      // https://vuejs.org/v2/api/#el
      const container = this.$refs.background

      // https://stackoverflow.com/questions/3234256/find-mouse-position-relative-to-element
      const rect = container.getBoundingClientRect()

      // Get relative X,Y postion from center.
      const x = (event.clientX - rect.left - rect.width / 2) / rect.width
      const y = (event.clientY - rect.top - rect.height / 2) / rect.height

      // Get magnitute of the X,Y vector found above
      const radius = Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2))

      // Print to console with string formatting.
      console.log(`X: ${x}, Y: ${y}, R: ${radius}`)

      // Pick which circle is effected.
      const thresh1 = (this.redSize + this.amberSize) / 2
      const thresh2 = (this.amberSize + this.greenSize) / 2

      const pad = 0.05
      const minr = 0.1

      if (radius > thresh1) {
        // https://vuejs.org/v2/guide/components-custom-events.html

        if (radius > 0.5) {
          this.$emit('changed', { circle: 'red', radius: 0.5 })
        } else if (radius < minr + 2 * pad) {
          this.$emit('changed', { circle: 'red', radius: minr + 2 * pad })
        } else {
          this.$emit('changed', { circle: 'red', radius })
        }

        if (this.redSize - this.amberSize < pad) {
          this.$emit('changed', {
            circle: 'amber',
            radius: this.redSize - pad,
          })
        }
        if (this.amberSize - this.greenSize < pad) {
          this.$emit('changed', {
            circle: 'green',
            radius: this.amberSize - pad,
          })
        }
      } else if (radius > thresh2) {
        if (radius > 0.5 - pad) {
          this.$emit('changed', { circle: 'amber', radius: 0.5 - pad })
        } else if (radius < minr + pad) {
          this.$emit('changed', { circle: 'amber', radius: minr + pad })
        } else {
          this.$emit('changed', { circle: 'amber', radius })
        }

        if (this.redSize - this.amberSize < pad) {
          this.$emit('changed', {
            circle: 'red',
            radius: this.amberSize + pad,
          })
        }
        if (this.amberSize - this.greenSize < pad) {
          this.$emit('changed', {
            circle: 'green',
            radius: this.amberSize - pad,
          })
        }
      } else {
        if (radius > 0.5 - 2 * pad) {
          this.$emit('changed', { circle: 'green', radius: 0.5 - 2 * pad })
        } else if (radius < minr) {
          this.$emit('changed', { circle: 'green', radius: minr })
        } else {
          this.$emit('changed', { circle: 'green', radius })
        }

        if (this.amberSize - this.greenSize < pad) {
          this.$emit('changed', {
            circle: 'amber',
            radius: this.greenSize + pad,
          })
        }
        if (this.redSize - this.amberSize < pad) {
          this.$emit('changed', {
            circle: 'red',
            radius: this.amberSize + pad,
          })
        }
      }
    },
  },
}
</script>

<style scoped>
.raginput {
  margin: auto;
  width: 100%;
}

.raginput__inner {
  display: flex;
}

.raginput__inner__svg {
  max-height: 50vh;
  margin: auto;
  flex: 1;
}

.raginput__background,
.raginput__circle {
  @apply fill-current;
  @apply border;
}

.raginput__background {
  @apply text-gray-200;
  /* @apply stroke-gray-400; */
}

.raginput__circle {
  /* @apply shadow;
  filter: drop-shadow(var(--tw-shadow)); */
}

.raginput__circle--outer {
  @apply text-green-400;
  /* @apply stroke-green-800; */
}

.raginput__circle--middle {
  @apply text-yellow-400;
  /* @apply stroke-yellow-800; */
}

.raginput__circle--inner {
  @apply text-red-400;
  /* @apply stroke-red-800; */
}
</style>
