// import pluginForms from '@tailwindcss/forms'
import pluginTypography from '@tailwindcss/typography'
import pluginDaisy from 'daisyui'

/*
 ** TailwindCSS Configuration File
 **
 ** Docs: https://tailwindcss.com/docs/configuration
 ** Default: https://github.com/tailwindcss/tailwindcss/blob/master/stubs/defaultConfig.stub.js
 */
export default {
  daisyui: {
    themes: ['light', 'dark', 'cupcake', 'bumblebee'],
  },

  important: '#__nuxt',

  plugins: [
    // pluginForms,
    pluginTypography,
    pluginDaisy,
  ],

  content: ['formulate.config.js'],

  theme: {
    extend: {
      colors: {
        'light-comfort': '#2a9d8f',
        'light-growth': '#f4a261',
        'light-anxiety': '#e76f51',
        'dark-comfort': '#2a9d8f',
        'dark-growth': '#f4a261',
        'dark-anxiety': '#e76f51',
        'cupcake-comfort': '#cdb4db',
        'cupcake-growth': '#ffc8dd',
        'cupcake-anxiety': '#ffafcc',
        'bumblebee-comfort': '#3d5a80',
        'bumblebee-growth': '#98c1d9',
        'bumblebee-anxiety': '#ee6c4d',
      },
      backgroundImage: (theme) => ({
        texture:
          'url("https://source.unsplash.com/collection/5019395/1600x900")',
        paper: 'url("https://pagecdn.io/lib/subtlepatterns/lined-paper-2.png")',
        doodles: 'url("https://pagecdn.io/lib/subtlepatterns/doodles.png")',
      }),
    },
  },
}
