<template>
  <FormulateForm name="logbook" v-bind="$attrs" v-on="$listeners">
    <FormulateInput
      type="text"
      name="name"
      label="Logbook Name"
      validation="required"
    />
  </FormulateForm>
</template>
