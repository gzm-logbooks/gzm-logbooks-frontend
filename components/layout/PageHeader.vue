<template>
  <div class="mb-4">
    <div class="flex items-end min-h-16 align-end">
      <div class="flex items-center w-full gap-2">
        <span
          v-if="$slots.title"
          class="mr-4 text-2xl font-medium text-base-content"
        >
          <slot name="title" />
        </span>

        <div class="flex gap-2 actions-inline">
          <slot name="inline-actions" />
        </div>

        <div class="flex justify-end flex-1 gap-2 main-actions grow">
          <slot name="main-actions" />
        </div>
      </div>
    </div>

    <slot />
  </div>
</template>

<style scoped>
/* Pull primary buttons to the right. */
.main-actions > .btn-primary {
  order: 99;
}
</style>
