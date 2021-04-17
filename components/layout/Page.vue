<template>
  <div class="px-4 flex flex-col items-center">
    <LayoutContainer max="lg" class="my-6">
      <div v-if="$slots.title" class="text-xl mb-4">
        <slot name="title" />
      </div>

      <slot />
    </LayoutContainer>

    <slot name="fullwidth" />

    <div v-if="$slots.debug" class="w-full overflow-hidden mt-auto">
      <LayoutContainer>
        <slot name="debug" />
      </LayoutContainer>
    </div>
  </div>
</template>
