<template>
  <div class="border-b border-indigo-200 pb-4 mb-4">
    <div v-if="$slots.title" class="text-2xl font-medium text-gray-800 mb-2">
      <slot name="title" />
    </div>

    <slot />
  </div>
</template>
