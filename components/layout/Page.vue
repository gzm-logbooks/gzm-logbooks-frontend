<template>
  <div class="flex flex-col flex-grow items-center">
    <div class="max-w-xl xl:max-w-6xl_ w-full my-6">
      <div v-if="$slots.title" class="font-bold text-xl mb-4">
        <slot name="title" />
      </div>

      <slot />
    </div>

    <slot name="fullwidth" />

    <div v-if="$slots.debug" class="w-full overflow-hidden mt-auto p-3">
      <slot name="debug" />
    </div>
  </div>
</template>
