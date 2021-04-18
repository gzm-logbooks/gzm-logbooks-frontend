<template>
  <div>
    <canvas ref="canvas" />
  </div>
</template>

<script>
import { Chart } from 'chart.js'
// import { defaultsDeep } from 'lodash-es'
import {
  defineComponent,
  ref,
  reactive,
  computed,
  watchEffect,
  onMounted,
  readonly,
  // watch,
} from '@nuxtjs/composition-api'

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
  },
  emits: ['selected'],
  setup(props, { emit, refs }) {
    const chart = ref(null)

    //
    const canvas = ref(null)

    const defaultOptions = readonly({
      legend: {
        display: false,
      },
      elements: {
        point: {
          pointStyle: 'circle',
          radius: 4,
        },
        line: {
          borderWidth: 1,
          tension: 0.4,
          cubicInterpolationMode: 'monotone',
        },
      },
      scales: {
        xAxes: [
          {
            type: 'time',
            time: {
              unit: 'day',
            },
          },
        ],
        yAxes: [
          {
            display: false,
            ticks: {
              min: 0,
              max: 0.5,
            },
          },
        ],
      },
      onClick(event, elements = [], legend) {
        const first = elements[0]

        if (first && first.element) {
          const dataset = legend.data?.datasets[first.datasetIndex]
          const pointData = dataset?.data[first.index]
          const timestamp = pointData?.x

          emit('selected', timestamp)
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
              x: entry.timestamp,
              y: entry.amountRed ?? 0,
            })
            accumulator.amber.push({
              x: entry.timestamp,
              y: entry.amountAmber ?? 0,
            })
            accumulator.green.push({
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
              backgroundColor: 'rgb(0,255,0)',
              data: datasets.green,
            },
            {
              backgroundColor: 'rgb(255,165,0)',
              data: datasets.amber,
            },
            {
              backgroundColor: 'rgb(255,0,0)',
              data: datasets.red,
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
        data: chartData.value,
      })

      chart.value.update()
    })

    // Update chart on changes.
    watchEffect(() => {
      // chart.value.update()
    })

    // watch(chartData, () => {
    //   chart.value.update()
    // })

    //   function demoData() {
    //     return {
    //       datasets: [
    //         {
    //           backgroundColor: 'rgb(0,255,0)',
    //           data: [
    //             {
    //               x: new Date('August 19, 1975 23:15:30'),
    //               y: 0.3,
    //             },
    //             {
    //               x: new Date('August 21, 1975 23:15:30'),
    //               y: 0.2,
    //             },
    //             {
    //               x: new Date('August 22, 1975 23:15:30'),
    //               y: 0.2,
    //             },
    //           ],
    //         },
    //         {
    //           backgroundColor: 'rgb(255,165,0)',
    //           data: [
    //             {
    //               x: new Date('August 19, 1975 23:15:30'),
    //               y: 0.4,
    //             },
    //             {
    //               x: new Date('August 21, 1975 23:15:30'),
    //               y: 0.3,
    //             },
    //             {
    //               x: new Date('August 22, 1975 23:15:30'),
    //               y: 0.3,
    //             },
    //           ],
    //         },
    //         {
    //           backgroundColor: 'rgb(255,0,0)',
    //           data: [
    //             {
    //               x: new Date('August 19, 1975 23:15:30'),
    //               y: 0.5,
    //             },
    //             {
    //               x: new Date('August 21, 1975 23:15:30'),
    //               y: 0.4,
    //             },
    //             {
    //               x: new Date('August 22, 1975 23:15:30'),
    //               y: 0.5,
    //             },
    //           ],
    //         },
    //       ],
    //     }
    //   }

    return { canvas, chart, chartOptions, chartData }
  },
})
</script>
