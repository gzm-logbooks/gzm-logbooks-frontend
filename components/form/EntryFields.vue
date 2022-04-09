<template>
  <div class="">
    <FormulateInput
      type="mood-circle"
      name="mood"
      label="Mood"
      validation="required"
      label-class="hidden"
    />

    <FormulateInput
      type="date"
      name="timestamp"
      label="Date"
      validation="required|after:2000-01-01"
      error-behavior="live"
      class="w-full"
    />

    <!-- TODO: Fix width -->
    <FormulateInput
      class="w-full"
      type="textarea"
      name="comment"
      label="Comment"
    />
  </div>
</template>
