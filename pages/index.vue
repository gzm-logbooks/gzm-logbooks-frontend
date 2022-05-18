<script lang="ts">
export default {
  middleware({ redirect, app }) {
    redirect({ name: 'logbooks' })
  },
}
</script>
