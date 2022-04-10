<template>
  <Card class="bg-white/80">
    <template #title>
      <h2>Metrics and Analysis</h2>
    </template>

    <!-- Stats -->
    <div class="grid grid-cols-3 mb-4">
      <div class="stat">
        <div class="stat-title">Growth</div>
        <div v-if="scaled" class="stat-value">
          {{ scaled.amountAmber.toFixed(2) }}
        </div>
      </div>

      <div class="stat">
        <div class="stat-title">Anxiety</div>
        <div v-if="scaled" class="stat-value">
          {{ scaled.amountRed.toFixed(2) }}
        </div>
      </div>

      <div class="stat">
        <div class="stat-title">Comfort</div>
        <div v-if="scaled" class="stat-value">
          {{ scaled.amountGreen.toFixed(2) }}
        </div>
      </div>
    </div>

    <!-- Analysis triangle -->
    <div class="mb-4">
      <svg
        viewBox="0 0 400 250"
        xmlns="http://www.w3.org/2000/svg"
        xmlns:bx="https://boxy-svg.com"
      >
        <defs>
          <bx:grid x="0" y="0" width="100" height="95.446" />
          <linearGradient
            id="gradient-0"
            gradientUnits="userSpaceOnUse"
            x1="200"
            y1="0"
            x2="200"
            y2="141.421"
            gradientTransform="matrix(0, -1, 2.82842712475, 0, 0, 0)"
          >
            <stop offset="0" style="stop-color: rgba(0, 255, 8, 0.79)" />
            <stop offset="1" style="stop-color: rgba(255, 9, 0, 0.85)" />
          </linearGradient>

          <linearGradient
            id="gradient-1"
            gradientUnits="userSpaceOnUse"
            x1="200"
            y1="0"
            x2="200"
            y2="141.421"
            gradientTransform="matrix(1, 0, 0, 1, 0, 0)"
          >
            <stop offset="0" style="stop-color: rgb(255, 115, 0)" />
            <stop offset="1" style="stop-color: rgba(255, 115, 0, 0)" />
          </linearGradient>
        </defs>

        <path
          d="M 200 25 L 400 225 L 0 225 L 200 25 Z"
          style="fill: url(#gradient-0)"
          bx:shape="triangle 0 25 400 141.421 0.5 0 1@88f9a85d"
        />
        <path
          d="M 200 25 L 400 225 L 0 225 L 200 25 Z"
          style="fill: url(#gradient-1)"
          bx:shape="triangle 0 25 400 141.421 0.5 0 1@88f9a85d"
        />

        <circle v-if="mood" :transform="triangleTransform" r="4" />

        <g class="text-sm uppercase">
          <text style="text-anchor: middle" x="50%" width="50%" y="20">
            Growth
          </text>

          <text style="text-anchor: start" x="0%" width="20%" y="245">
            Comfort
          </text>

          <text style="text-anchor: end" x="100%" width="20%" y="245">
            Anxiety
          </text>
        </g>
      </svg>
    </div>

    <!-- Suggestions -->
    <div class="flex-grow prose">
      <p v-if="suggestion == 0">
        You were in the best zone for learning, good job! What do you think
        helped you stay in the growth zone?
      </p>

      <p v-if="suggestion == 1">
        Looks like you have found your growth zone, what could you do to spend
        more time there?
      </p>

      <p v-if="suggestion == 2">
        Looks like you have found your growth zone, what could you do to spend
        more time there?
      </p>

      <p v-if="suggestion == 3">
        Looks like you stayed in the comfort zone a lot of the time. What could
        you do to challenge yourself?
      </p>

      <p v-if="suggestion == 4">
        Looks like you need to develop a growth zone, where you feel safe to
        take risks and can cope with manageable challenges. What could help you
        feel safe enough to take a risk?
      </p>

      <p v-if="suggestion == 5">
        Looks like you felt of your depth a lot of the time. What could you have
        done to calm down?
      </p>
    </div>
  </Card>
</template>

<script>
import { scaledModeInput } from '~/data/config'

export default {
  props: {
    mood: { type: Object, default: null },
  },
  computed: {
    scaled() {
      if (this.mood) {
        return scaledModeInput(this.mood)
      }

      return null
    },
    triangleTransform() {
      if (!this.mood) {
        return ``
      }

      //
      const scaled = scaledModeInput(this.mood)

      const scaler = 200 * Math.sqrt(2)

      return `translate(200,25)
        rotate(45)
        translate(
          ${(scaled?.amountRed ?? 0) * scaler},
          ${(scaled?.amountGreen ?? 0) * scaler}
        )`
    },
    suggestion() {
      if (!this.mood) {
        return ``
      }

      //
      const scaled = scaledModeInput(this.mood)

      const { amountRed, amountGreen } = scaled

      if (amountRed < 1 / 3 && amountGreen < 1 / 3) {
        return 0
      }

      if (amountRed < 1 / 3 && amountGreen < 2 / 3) {
        return 1
      }

      if (amountRed < 2 / 3 && amountGreen < 1 / 3) {
        return 2
      }

      if (amountGreen > 2 / 3) {
        return 3
      }

      if (amountRed > 1 / 3 && amountGreen > 1 / 3) {
        return 4
      }

      if (amountRed > 2 / 3) {
        return 5
      }

      return null
    },
  },
}
</script>
