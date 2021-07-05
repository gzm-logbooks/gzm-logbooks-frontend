<template>
  <div class="mx-auto border card shadow-sm sm:rounded">
    <div v-if="$slots.title" class="card px-4 py-3 border-b">
      <slot name="title" />
    </div>

    <div :class="contentClass">
      <slot />
    </div>
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
