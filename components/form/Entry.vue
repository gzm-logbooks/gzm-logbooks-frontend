<template>
  <FormulateForm name="entry" v-bind="$attrs" v-on="$listeners">
    <FormulateInput
      type="date"
      name="timestamp"
      label="Date"
      validation="required"
    />

    <FormulateInput type="textarea" name="comment" label="Comment" />
  </FormulateForm>
</template>
