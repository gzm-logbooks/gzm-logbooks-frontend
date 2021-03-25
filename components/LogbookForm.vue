<template>
  <FormulateForm name="logbook" v-bind="$attrs" v-on="$listeners">
    <FormulateInput
      type="text"
      name="name"
      label="Name your Logbook"
      validation="required"
    />
  </FormulateForm>
</template>
