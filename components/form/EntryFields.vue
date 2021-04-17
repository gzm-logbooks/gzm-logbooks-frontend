<template>
  <!-- v-bind="$attrs" v-on="$listeners" -->
  <div>
    <FormulateInput type="mood-circle" name="mood" label="Mood" />

    <FormulateInput
      type="date"
      name="timestamp"
      label="Date"
      validation="required|after:2000-01-01"
      error-behavior="live"
    />

    <FormulateInput type="textarea" name="comment" label="Comment" />
  </div>
</template>
