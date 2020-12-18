<template>
<div>
  <Suspense>
    <template #default>
      <slot />
    </template>

    <template #fallback>
      <span>Loading&hellip;</span>
    </template>
  </Suspense>
</div>
</template>
