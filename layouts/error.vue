<template>
  <LayoutPage>
    <h1 v-if="error.statusCode === 404">Page not found</h1>
    <h1 v-else>An error occurred</h1>
  </LayoutPage>
</template>

<script>
export default {
  layout: 'error',
  props: ['error'],
}
</script>
