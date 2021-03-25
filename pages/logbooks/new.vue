<template>
  <div>
    <h1>this is a new logbook form</h1>
    <LogbookForm @submit="save" />
    <button class="btn" @click="$formulate.submit('logbook')">
      Create logbook
    </button>
  </div>
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
