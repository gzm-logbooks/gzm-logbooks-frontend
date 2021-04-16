<template>
  <div class="px-6 flex flex-col items-center">
    <LayoutContainer max="lg" class="my-6">
      <div v-if="$slots.title" class="font-medium text-xl mb-4">
        <slot name="title" />
      </div>

      <slot />
    </LayoutContainer>

    <slot name="fullwidth" />
  </div>
</template>
