<template>
  <div class="prose">
    {{ metric }}

    <p>
      Remember when you feel confused or panicky or stupid, that this is only
      your brain trying to keep you safe. You can think more clearly if you
      reverse the fight, flight or freeze response. This will reconnect your
      thinking brain.
    </p>

    <p v-if="metric > 0.4">
      When you make a mistake, remember that more new connections are made in
      your brain than when you get it right. Mistakes are good! When you make a
      mistake, imagine the new connections in your brain, like the new creases
      on a scrumpled bit of paper. Then keep trying.
      <em>You are learning!</em>
    </p>

    <p>
      To reconnect your thinking brain, try 5/7 breathing. Breathe in while you
      count to 5, and out while you count to 7. Do this again and again until
      you start to feel calm.
    </p>
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
    metric() {
      return (
        (this.scaled?.amountGreen - this.scaled?.amountRed) /
        (this.scaled?.amountAmber + 1)
      )
    },
  },
}
</script>
