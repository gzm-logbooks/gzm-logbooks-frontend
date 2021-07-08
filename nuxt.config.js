// import globals from '@rollup/plugin-node-resolve'

// //
// const globalsPlugin = globals();
// globalsPlugin.name = 'globals'; // required, see https://github.com/vitejs/vite/issues/728

export default {
  // Disable server-side rendering: https://go.nuxtjs.dev/ssr-mode
  ssr: false,

  // Target: https://go.nuxtjs.dev/config-target
  target: 'static',

  // Global page headers: https://go.nuxtjs.dev/config-head
  head: {
    title: 'growth-app',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: '' },
    ],
    link: [{ rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }],
    bodyAttrs: {
      class: '',
    },
  },

  // Global CSS: https://go.nuxtjs.dev/config-css
  css: [],

  // Plugins to run before rendering page: https://go.nuxtjs.dev/config-plugins
  plugins: ['~/plugins/globals', '~/plugins/database'],

  // Auto import components: https://go.nuxtjs.dev/config-components
  components: true,

  // Modules for dev and build (recommended): https://go.nuxtjs.dev/config-modules
  buildModules: [
    // https://composition-api.nuxtjs.org
    '@nuxtjs/composition-api/module',

    // https://github.com/nuxt-community/color-mode-module
    '@nuxtjs/color-mode',

    // https://go.nuxtjs.dev/eslint
    '@nuxtjs/eslint-module',

    // https://go.nuxtjs.dev/tailwindcss
    '@nuxtjs/tailwindcss',

    // https://vueformulate.com/guide
    '@braid/vue-formulate/nuxt',

    // https://github.com/nuxt/vite
    // 'nuxt-vite',
  ],

  // Modules: https://go.nuxtjs.dev/config-modules
  modules: [
    // https://go.nuxtjs.dev/pwa
    '@nuxtjs/pwa',
  ],

  //
  generate: {
    fallback: true,
  },

  colorMode: {
    classSuffix: '',
  },

  tailwindcss: {
    jit: true,
    // add '~tailwind.config` alias
    exposeConfig: true,
  },

  // PWA module configuration: https://go.nuxtjs.dev/pwa
  pwa: {
    manifest: {
      lang: 'en',
    },
  },

  // Build Configuration: https://go.nuxtjs.dev/config-build
  build: {},

  // vite: {
  //   /* options for vite */
  //   // optimizeDeps: {
  //   //   include: ['rxdb/plugins/core'], // try to limit scope of optimized module
  //   //   exclude: ['rxdb'],
  //   // },

  //   build: {
  //     rollupOptions: {
  //       plugins: {
  //         globalsPlugin,
  //       },
  //     },
  //   },
  // },
}
