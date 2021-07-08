<template>
  <FormulateForm name="logbook" v-bind="$attrs" v-on="$listeners">
    <FormulateInput
      type="text"
      name="name"
      label="Logbook Name"
      validation="required"
      input-class="input w-full"
    />
  </FormulateForm>
</template>
