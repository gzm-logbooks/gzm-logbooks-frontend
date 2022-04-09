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

      <div class="flex flex-grow">
        <ConnectRemoteStorage />
      </div>
    </Card>

    <!-- Theme -->
    <Card class="mb-6 bg-white">
      <template #title>
        <h2>Theme</h2>
      </template>

      <div class="flex space-x-3">
        <SettingsThemePreview v-for="theme in themes" :key="theme.key" />
      </div>
    </Card>
  </LayoutPage>
</template>

<script>
export default {
  data() {
    return {
      settings: {
        darkMode: false,
        theme: 0,
      },
      themes: {
        default: {
          primary: '#2a9d8f',
          secondary: '#f4a261',
          accent: '#e76f51',
          neutral: '#264653',
          'base-100': '#e9c46a',
        },
        meanteen: {
          primary: '#3d5a80',
          secondary: '#98c1d9',
          accent: '#ee6c4d',
          neutral: '#293241',
          'base-100': '#e0fbfc',
        },
        pinkpalace: {
          primary: '#cdb4db',
          secondary: '#ffc8dd',
          accent: '#ffafcc',
          neutral: '#a2d2ff',
          'base-100': '#bde0fe',
        },
      },
    }
  },
  methods: {
    toggle() {
      console.log('toggle')
    },
  },
}
</script>
