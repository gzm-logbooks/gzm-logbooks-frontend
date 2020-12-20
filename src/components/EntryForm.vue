<template>
  <ion-list>
    <ion-list-header>
      <h1>How did things go today?</h1>
    </ion-list-header>

    <ion-item>
      <ion-label>Date</ion-label>
      <ion-datetime :value="fields.timestamp" placeholder="Select Date">
      </ion-datetime>
    </ion-item>

    <ion-item>
      <CircleInput
        @changed="updateRagInput"
        :red-size="fields.amountRed"
        :amber-size="fields.amountAmber"
        :green-size="fields.amountGreen"
        class="ion-padding"
      />
    </ion-item>

    <ion-item>
      <ion-label position="stacked">Comment</ion-label>
      <ion-textarea v-model="fields.comment"></ion-textarea>
    </ion-item>
  </ion-list>
</template>

<script>
import {
  IonDatetime,
  IonItem,
  IonLabel,
  IonList,
  IonListHeader,
  IonTextarea,
} from '@ionic/vue'
import {
  defineComponent,
  readonly,
  reactive,
  computed,
  watchEffect,
  watch,
} from 'vue'
import { defaultsDeep } from 'lodash-es'
import CircleInput from '@/components/CircleInput'

export default defineComponent({
  components: {
    CircleInput,
    IonDatetime,
    IonItem,
    IonLabel,
    IonList,
    IonListHeader,
    IonTextarea,
  },
  props: {
    entry: {
      type: Object,
      immediate: true,
      handler(val) {
        console.log('Fields have changed')
        this.fields = val
      },
    },
  },
  emits: ['input'],
  setup(props, { emit }) {
    //
    const defaultFields = readonly({
      timestamp: new Date().toISOString(),
      amountRed: 0.5,
      amountAmber: 0.33,
      amountGreen: 0.17,
      comment: '',
    })

    //
    const localFields = reactive(props.entry)

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

    // Fields with default values
    const fields = computed({
      get() {
        const fields = defaultsDeep({}, localFields, defaultFields)
        return new Proxy(fields, fieldsHandler)
      },
    })

    return {
      defaultFields,
      localFields,
      fields,
      updateField,
      fieldsHandler,
    }
  },
  methods: {
    // Handles circles component @changed event.
    updateRagInput(event) {
      // Event contents set in $emit() above.
      switch (event.circle) {
        case 'red':
          this.fields.amountRed = event.radius
          break
        case 'amber':
          this.fields.amountAmber = event.radius
          break
        case 'green':
          this.fields.amountGreen = event.radius
          break
      }
    },
  },
})
</script>
