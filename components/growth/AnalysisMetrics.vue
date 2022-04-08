<template>
  <div v-if="scaled">
    <div class="stat">
      <div class="stat-title">Growth</div>
      <div class="stat-value">{{ scaled.amountAmber.toFixed(2) }}</div>
    </div>

    <div class="stat">
      <div class="stat-title">Anxiety</div>
      <div class="stat-value">{{ scaled.amountRed.toFixed(2) }}</div>
    </div>

    <div class="stat">
      <div class="stat-title">Comfort</div>
      <div class="stat-value">{{ scaled.amountGreen.toFixed(2) }}</div>
    </div>
  </div>
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
        scaledModeInput(this.mood)
      }

      return null
    },
  },
}
</script>
