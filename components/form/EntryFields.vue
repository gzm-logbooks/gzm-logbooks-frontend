<template>
  <!-- v-bind="$attrs" v-on="$listeners" -->
  <div>
    <FormulateInput
      type="mood-circle"
      name="mood"
      label="Mood"
      validation="required"
    />

    <FormulateInput
      type="date"
      name="timestamp"
      label="Date"
      validation="required|after:2000-01-01"
      error-behavior="live"
      input-class="w-full"
    />

    <FormulateInput
      type="textarea"
      name="comment"
      label="Comment"
      input-class="w-full"
    />
  </div>
</template>
