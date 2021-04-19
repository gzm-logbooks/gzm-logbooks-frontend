<template>
  <!-- v-bind="$attrs" v-on="$listeners" -->
  <div class="sm:grid grid-cols-3 gap-4">
    <div class="col-span-2">
      <FormulateInput type="mood-circle" name="mood" label="Mood" />
    </div>

    <div class="flex flex-col space-around">
      <FormulateInput
        class="w-full"
        type="date"
        name="timestamp"
        label="Date"
        validation="required|after:2020-01-01"
        error-behavior="live"
      />

      <FormulateInput
        class="w-full"
        type="textarea"
        name="comment"
        label="Comment"
      />
    </div>
  </div>
</template>
