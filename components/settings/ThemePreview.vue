<template>
  <div :data-theme="themeName">
    <svg width="100" viewBox="0 0 20 34" xmlns="http://www.w3.org/2000/svg">
      <rect
        x="0"
        y="0"
        width="20"
        height="34"
        rx="2"
        ry="2"
        class="fill-base-100"
      />
      <circle cx="10" cy="10" r="9" :class="`fill-${themeName}-comfort`" />
      <circle cx="10" cy="10" r="6" :class="`fill-${themeName}-growth`" />
      <circle cx="10" cy="10" r="3" :class="`fill-${themeName}-anxiety`" />
      <rect
        x="1"
        y="20"
        width="18"
        height="3"
        rx="2"
        ry="2"
        class="fill-warning"
      />
      <rect
        x="1"
        y="24"
        width="18"
        height="3"
        rx="2"
        ry="2"
        class="fill-neutral-content"
      />
      <rect
        x="1"
        y="28"
        width="18"
        height="3"
        rx="2"
        ry="2"
        class="fill-success"
      />
    </svg>
  </div>
</template>

<script>
export default {
  props: {
    themeName: { type: String, required: true },
  },
}
</script>
