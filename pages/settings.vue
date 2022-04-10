<template>
  <!-- v-if="!$fetchState.pending" -->
  <LayoutPage>
    <LayoutPageHeader>
      <template #title>
        <div class="flex items-center gap-2">
          <h1>Settings</h1>
        </div>
      </template>
    </LayoutPageHeader>

    <!-- <Card class="mb-6 bg-white">
      <template #title>
        <h2>Account Info</h2>
      </template>
      <h3>Email</h3>
      <h3>Password</h3>
    </Card> -->

    <!-- Remote storage -->
    <Card class="mb-6 bg-white">
      <template #title>
        <h2>Backup and sync</h2>
      </template>

      <div class="flex grow">
        <ConnectRemoteStorage />
      </div>
    </Card>

    <!-- Theme -->
    <Card class="mb-6 bg-white">
      <template #title>
        <h2>Theme</h2>
      </template>

      <div class="flex space-x-3">
        <SettingsThemePreview
          v-for="(themeName, index) in themeNames"
          :key="index"
          :theme-name="themeName"
        />
      </div>
    </Card>
  </LayoutPage>
</template>

<script>
import tailwindConfig from '#tailwind-config'

export default {
  data() {
    return {}
  },
  computed: {
    themeNames() {
      // Get themes list from daisyui config.
      // const fullConfig = resolveConfig(tailwindConfig)

      const { themes } = tailwindConfig.daisyui

      // Get a theme name string from each config item.
      return themes
        .map(function (theme) {
          // Simple string keys.
          if (typeof theme === 'string') {
            return theme
          }

          // User defined theme objects.
          if (theme instanceof Object) {
            const keys = Object.keys(theme)
            return keys[0]
            // return theme
          }

          return null
        })
        .filter(function (themeName) {
          return typeof themeName === 'string'
        })
    },
  },
  mounted() {
    const { themeNames } = this

    // console.log({ tailwindConfig, themeNames })
    // debugger
  },
  methods: {},
}
</script>
