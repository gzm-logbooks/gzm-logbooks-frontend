<template>
  <div class="shadow-sm card">
    <slot name="top" />

    <div v-if="$slots.title" class="flex-row card-body">
      <div class="card-title">
        <slot name="title" />
      </div>
    </div>

    <div class="card-body" :class="contentClass">
      <slot />
    </div>

    <div v-if="$slots.footer" class="px-4 py-3 card-body">
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
