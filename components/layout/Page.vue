<template>
  <div class="px-6 flex flex-col items-center">
    <div class="max-w-xl xl:max-w-6xl_ w-full my-6">
      <div v-if="$slots.title" class="font-bold text-xl mb-4">
        <slot name="title" />
      </div>

      <slot />
    </div>

    <slot name="fullwidth" />
  </div>
</template>
