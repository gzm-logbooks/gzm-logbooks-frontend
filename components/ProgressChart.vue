<template>
  <div class="w-full">
    <canvas ref="canvas" />
  </div>
</template>

<script>
import { Chart } from 'chart.js'
import {
  defineComponent,
  ref,
  reactive,
  computed,
  watch,
  watchEffect,
  onMounted,
  readonly,
  // watch,
} from '@nuxtjs/composition-api'
import { theme } from '~tailwind.config'
// import { defaultsDeep } from 'lodash-es'

export default defineComponent({
  props: {
    options: {
      type: Object,
      default() {
        return {}
      },
    },
    entries: {
      type: [Object, Array],
      default() {
        return {}
      },
    },
    full: {
      type: Boolean,
      default: false,
    },
  },
  emits: ['selected'],
  setup(props, { emit, refs }) {
    const chart = ref(null)

    //
    const canvas = ref(null)

    const defaultOptions = readonly({
      animation: false,
      plugins: {
        legend: {
          display: false,
        },
      },
      elements: {
        point: {
          pointStyle: 'circle',
          radius: props.full ? 8 : 0,
        },
        line: {
          showLine: false,
          borderWidth: 0,
          tension: 0.4,
          cubicInterpolationMode: 'monotone',
        },
      },
      scales: {
        x: {
          display: props.full,
          type: 'timeseries',
          time: {
            unit: 'day',
          },
          // ticks: {
          //   // source: 'data',
          //   autoSkip: true,
          //   maxTicksLimit: 20,
          // },
          // max: new Date(),
          // suggestedMax: new Date(),
        },
        y: {
          display: false,
          min: 0,
          max: 1,
        },
      },
      onClick(event, elements = [], legend) {
        const first = elements[0]

        if (first && first.element) {
          const dataset = legend.data?.datasets[first.datasetIndex]
          const pointData = dataset?.data[first.index]
          const primary = pointData?.id

          emit('selected', primary)
        }
      },
    })

    const chartOptions = reactive(props.options || {})
    Object.assign(chartOptions, defaultOptions)

    const chartData = computed({
      get() {
        //
        const datasets = props.entries.reduce(
          (accumulator, entry) => {
            accumulator.red.push({
              primary: entry.primary,
              x: entry.timestamp,
              y: entry.amountRed ?? 0,
            })
            accumulator.amber.push({
              primary: entry.primary,
              x: entry.timestamp,
              y: entry.amountAmber ?? 0,
            })
            accumulator.green.push({
              primary: entry.primary,
              x: entry.timestamp,
              y: entry.amountGreen ?? 0,
            })
            return accumulator
          },

          // Initial value.
          {
            red: [],
            amber: [],
            green: [],
          }
        )

        return {
          datasets: [
            {
              fill: {
                target: 'origin',
                above: theme.colors.green[400],
              },
              data: datasets.green,
              stepped: props.full ? false : 'before',
            },
            {
              fill: {
                target: 'origin',
                above: theme.colors.yellow[400],
              },
              data: datasets.amber,
              stepped: props.full ? false : 'before',
            },
            {
              fill: {
                target: 'origin',
                above: theme.colors.red[400],
              },
              data: datasets.red,
              stepped: props.full ? false : 'before',
            },
          ],
        }
      },
    })

    onMounted(() => {
      const { canvas } = refs

      chart.value = new Chart(canvas, {
        type: 'line',
        options: chartOptions,
        data: {
          datasets: chartData.value.datasets,
        },
      })

      chart.value.update()
    })

    // Update chart on changes.
    watch(chartData, (value, oldValue) => {
      if (!(value && chart.value?.data?.datasets?.length > 0)) {
        return
      }

      console.log(`Updating chart...`)
      chart.value.data.datasets = value.datasets
      chart.value?.update()
    })

    return { canvas, chart, chartOptions, chartData }
  },
})
</script>
