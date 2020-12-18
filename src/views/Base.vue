<template>
  <Suspense>
    <template #default>
      <slot />
    </template>

    <template #fallback> Loading&hellip; </template>
  </Suspense>
</template>
