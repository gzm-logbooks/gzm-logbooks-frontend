import pluginForms from '@tailwindcss/forms'
import pluginTypography from '@tailwindcss/typography'
import pluginDaisy from 'daisyui'

/*
 ** TailwindCSS Configuration File
 **
 ** Docs: https://tailwindcss.com/docs/configuration
 ** Default: https://github.com/tailwindcss/tailwindcss/blob/master/stubs/defaultConfig.stub.js
 */
module.exports = {
  daisyui: {
    themes: [
      'light',
      'dark',
      'cupcake',
      'bumblebee',
      'emerald',
      'corporate',
      'synthwave',
      'retro',
      'cyberpunk',
      'valentine',
      'halloween',
      'garden',
      'forest',
      'aqua',
      'lofi',
      'pastel',
      'fantasy',
      'wireframe',
      'black',
      'luxury',
      'dracula',
      'cmyk',
      'autumn',
      'business',
      'acid',
      'lemonade',
      'night',
      'coffee',
      'winter',
      {
        default: {
          primary: '#2a9d8f',
          secondary: '#f4a261',
          accent: '#e76f51',
          neutral: '#264653',
          // 'base-100': '#e9c46a',
        },
        meanteen: {
          primary: '#3d5a80',
          secondary: '#98c1d9',
          accent: '#ee6c4d',
          neutral: '#293241',
          // 'base-100': '#e0fbfc',
        },
        pinkpalace: {
          primary: '#cdb4db',
          secondary: '#ffc8dd',
          accent: '#ffafcc',
          neutral: '#a2d2ff',
          // 'base-100': '#bde0fe',
        },
      },
    ],
  },
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
    pluginTypography,
    pluginDaisy,
  ],
  purge: {
    content: ['formulate.config.js'],
  },
  theme: {
    extend: {
      backgroundImage: (theme) => ({
        texture:
          'url("https://source.unsplash.com/collection/5019395/1600x900")',
        paper: 'url("https://pagecdn.io/lib/subtlepatterns/lined-paper-2.png")',
        doodles: 'url("https://pagecdn.io/lib/subtlepatterns/doodles.png")',
      }),
    },
  },
}
