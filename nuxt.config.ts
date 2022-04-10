import { defineNuxtConfig } from '@nuxt/bridge'
import { name, version } from './package.json'

// import globals from '@rollup/plugin-node-resolve'

// //
// const globalsPlugin = globals();
// globalsPlugin.name = 'globals'; // required, see https://github.com/vitejs/vite/issues/728

const title = process.env.appName ?? name

export default defineNuxtConfig({
  bridge: {
    // Use Vite as the bundler instead of webpack 4
    vite: true,

    // Enable Nuxt 3 compatible useHead
    // meta: true,
  },

  // Disable server-side rendering: https://go.nuxtjs.dev/ssr-mode
  ssr: false,

  // Target: https://go.nuxtjs.dev/config-target
  target: 'static',

  // Global page headers: https://go.nuxtjs.dev/config-head
  head: {
    title,
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

  // Auto import components: https://go.nuxtjs.dev/config-components
  components: true,

  // Modules for dev and build (recommended): https://go.nuxtjs.dev/config-modules
  buildModules: [
    // https://github.com/nuxt-community/color-mode-module
    '@nuxtjs/color-mode',

    // https://go.nuxtjs.dev/eslint
    // '@nuxtjs/eslint-module',

    // https://go.nuxtjs.dev/tailwindcss
    '@nuxtjs/tailwindcss',

    // https://vueformulate.com/guide
    '@braid/vue-formulate/nuxt',
  ],

  // Modules: https://go.nuxtjs.dev/config-modules
  modules: [
    // https://go.nuxtjs.dev/pwa
    '@nuxtjs/pwa',
  ],

  // https://nuxtjs.org/guide/runtime-config
  publicRuntimeConfig: {
  },

  //
  generate: {
    // fallback: true,
  },

  colorMode: {
    classSuffix: '',
  },

  tailwindcss: {
    // add '#tailwind-config` alias
    exposeConfig: true,
  },

  // PWA module configuration: https://go.nuxtjs.dev/pwa
  pwa: {
    manifest: {
      lang: 'en',
    },
  },

  // Build Configuration: https://go.nuxtjs.dev/config-build
  build: {
    // transpile: ['remotestorage-widget', 'pouchdb-core']
  },

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
})
