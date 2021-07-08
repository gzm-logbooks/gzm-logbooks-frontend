<template>
  <div class="mb-4">
    <span v-if="$slots.title" class="text-2xl font-medium text-gray-800 mb-16">
      <slot name="title" />
    </span>

    <slot />
  </div>
</template>
