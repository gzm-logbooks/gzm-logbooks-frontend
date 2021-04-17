// import pluginForms from '@tailwindcss/forms'
// import pluginTypography from '@tailwindcss/typography'

/*
 ** TailwindCSS Configuration File
 **
 ** Docs: https://tailwindcss.com/docs/configuration
 ** Default: https://github.com/tailwindcss/tailwindcss/blob/master/stubs/defaultConfig.stub.js
 */
module.exports = {
  darkMode: 'class',
  // theme: {
  //   stroke: (theme) => ({
  //     current: 'currentColor',
  //     red: theme('colors.red.500'),
  //     green: theme('colors.green.800'),
  //     blue: theme('colors.blue.500'),
  //   }),
  // },
  variants: {
    // backgroundColor: [
    //   'dark',
    //   'dark-hover',
    //   'dark-group-hover',
    //   'dark-even',
    //   'dark-odd',
    // ],
    // borderColor: ['dark', 'dark-focus', 'dark-focus-within'],
    // textColor: ['dark', 'dark-hover', 'dark-active'],
  },
  plugins: [
    // pluginForms,
    // pluginTypography
  ],
  purge: {
    content: ['formulate.config.js'],
  },
}
