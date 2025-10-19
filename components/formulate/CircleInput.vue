<template>
  <div
    :class="`formulate-input-element formulate-input-element--${context.type}`"
    :data-type="context.type"
  >
    <CircleInput v-model="value" />
  </div>
</template>

<script lang="ts">
export default {
  props: {
    context: {
      type: Object,
      required: true,
    },
  },
  computed: {
    value: {
      get() {
        return this.entryAmountsToCircleInputModel(this.context.model)
      },
      set(newValue) {
        const amounts = this.circleInputModelToEntryAmounts(newValue)

        // Update formulate context.
        this.context.model = amounts
      },
    },
  },
  methods: {
    entryAmountsToCircleInputModel(entry) {
      return {
        anxiety: 1,
        growth: entry.amountGrowth,
        comfort: entry.amountComfort,
      }
    },

    circleInputModelToEntryAmounts(model) {
      return {
        amountAnxiety: 1, // Outer ring is fixed.
        amountGrowth: model.growth,
        amountComfort: model.comfort,
      }
    },
  },
}
</script>
