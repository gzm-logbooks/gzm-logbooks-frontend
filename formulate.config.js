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
          return 'button'
        default:
          return 'input'
      }
    },
    label: 'text-sm mb-2 font-medium',
    help: 'text-xs mb-1 text-gray-600',
    error: 'text-xs mb-1 text-red-700',
  },
}
