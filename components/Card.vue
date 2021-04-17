<template>
  <div class="bg-white mx-auto border border-indigo-200 shadow-sm sm:rounded">
    <div v-if="$slots.title" class="bg-gray-50 px-4 py-2 border-b">
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
