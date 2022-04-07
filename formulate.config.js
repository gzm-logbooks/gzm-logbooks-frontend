export default {
  library: {
    'mood-circle': {
      component: 'FormulateCircleInput',
    },
  },
  classes: {
    outer: 'mb-4',
    input(context) {
      switch (context.classification) {
        case 'button':
          return 'btn'
        default:
          return 'input'
      }
    },
    label: 'label-text',
    help: 'text-xs mb-1 text-gray-600',
    error: 'text-xs mb-1 text-red-700',
  },
}
