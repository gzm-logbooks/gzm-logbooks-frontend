<template>
  <div class="sm:grid grid-cols-3 gap-4">
    <div class="col-span-2">
      <FormulateInput
        type="mood-circle"
        name="mood"
        label="Mood"
        validation="required"
        label-class="hidden"
      />
    </div>

    <div class="flex flex-col space-around">
      <FormulateInput
        type="date"
        name="timestamp"
        label="Date"
        validation="required|after:2000-01-01"
        error-behavior="live"
        input-class="input w-full"
      />

      <FormulateInput
        input-class="input w-full"
        type="textarea"
        name="comment"
        label="Comment"
      />
    </div>
  </div>
</template>
