<template>
  <div class="card">
    <slot name="top" />

    <div
      v-if="$slots.title"
      class="card__section flex-row text-lg items-center bg-gray-50"
    >
      <slot name="title" />
    </div>

    <div class="card__content" :class="contentClass">
      <slot />
    </div>

    <div v-if="$slots.footer" class="card__section px-4 py-3">
      <slot name="footer" />
    </div>

    <slot name="bottom" />
  </div>
</template>

<script>
export default {
  props: {
    contentClass: {
      type: [String, Object, Array],
      default: 'p-4',
    },
  },
}
</script>
