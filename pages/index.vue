<script>
export default {
  middleware({ redirect, app }) {
    redirect({ name: 'logbooks' })
  },
}
</script>
