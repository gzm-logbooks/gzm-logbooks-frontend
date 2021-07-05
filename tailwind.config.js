// import pluginForms from '@tailwindcss/forms'
// import pluginTypography from '@tailwindcss/typography'

/*
 ** TailwindCSS Configuration File
 **
 ** Docs: https://tailwindcss.com/docs/configuration
 ** Default: https://github.com/tailwindcss/tailwindcss/blob/master/stubs/defaultConfig.stub.js
 */
module.exports = {
  important: '#__nuxt',
  // theme: {
  //   stroke: (theme) => ({
  //     current: 'currentColor',
  //     red: theme('colors.red.500'),
  //     green: theme('colors.green.800'),
  //     blue: theme('colors.blue.500'),
  //   }),
  // },
  plugins: [
    // pluginForms,
    // pluginTypography
  ],
  purge: {
    content: ['formulate.config.js'],
  },
}
