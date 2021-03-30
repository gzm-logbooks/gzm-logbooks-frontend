<template>
  <div class="bg-white mx-auto border border-indigo-200 shadow-sm sm:rounded">
    <div v-if="$slots.title" class="bg-gray-50 p-3 border-b">
      <slot name="title" />
    </div>

    <slot name="full" />

    <div v-if="$slots.title" class="p-3">
      <slot />
    </div>
  </div>
</template>
