<template>
  <ion-list>
    <ion-item>
      <ion-label position="stacked">Name</ion-label>
      <ion-input type="text" v-model="fields.name"></ion-input>
    </ion-item>
  </ion-list>
</template>

<script>
import { IonInput, IonItem, IonLabel, IonList } from '@ionic/vue'
import { defineComponent, readonly, reactive, computed } from 'vue'
import { defaultsDeep } from 'lodash-es'

export default defineComponent({
  components: {
    IonInput,
    IonItem,
    IonLabel,
    IonList,
  },
  props: {
    subject: {
      type: Object,
      immediate: true,
      handler(val) {
        this.fields = val
      },
    },
  },
  emits: ['input'],
  setup(props, { emit }) {
    //
    const defaultFields = readonly({
      name: '',
    })

    //
    const localFields = reactive(props.subject)

    //
    function updateField(field, value) {
      localFields[field] = value

      emit('input', localFields)
    }

    const fieldsHandler = {
      set(obj, prop, value) {
        updateField(prop, value)

        return true
      },
    }

    // Reactive fields with default values.
    const fields = computed({
      get() {
        const fields = defaultsDeep({}, localFields, defaultFields)
        return new Proxy(fields, fieldsHandler)
      },
    })

    return {
      // Reactive fields
      defaultFields,
      localFields,
      fields,
      updateField,
      fieldsHandler,
    }
  },
})
</script>
