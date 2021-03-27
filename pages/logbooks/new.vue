<template>
  <LayoutPage>
    <template #title>this is a new logbook form</template>

    <Card class="p-6 m-4">
      <LogbookForm @submit="save" />
    </Card>

    <button class="btn" @click="$formulate.submit('logbook')">
      Create logbook
    </button>
  </LayoutPage>
</template>

<script>
export default {
  methods: {
    async save(fields) {
      //
      const doc = await this.$db.logbooks.insert(fields).catch((err) => {
        console.log(err)

        // const toast = await toastController.create({
        //   message: err,
        //   color: 'danger',
        //   duration: 2000,
        // })

        // toast.present()
      })

      console.log(doc)
    },
  },
}
</script>
