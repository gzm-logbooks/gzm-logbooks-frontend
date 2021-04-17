<template>
  <div class="bg-white mx-auto border border-indigo-200 shadow-sm sm:rounded">
    <slot name="header" />

    <div :class="contentClass">
      <slot />
    </div>

    <slot name="footer" />
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
