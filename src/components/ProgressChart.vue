<template>
  <canvas ref="canvas" />
</template>

<script>
import { Chart, Element } from 'chart.js'
import { defaultsDeep } from 'lodash-es'
import {
  defineComponent,
  ref,
  reactive,
  computed,
  watchEffect,
  onMounted,
  readonly,
} from 'vue'
import { useRouter } from 'vue-router'
import { useCssVar } from '@vueuse/core'

//
const defaultOptions = readonly({
  legend: {
    display: false,
  },
  elements: {
    point: { radius: 4 },
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
})

export default defineComponent({
  props: {
    options: {
      type: Object,
    },
    entries: {
      type: Object,
    },
  },
  emits: ['selected'],
  setup(props, { emit }) {
    // Get colors from css variables.
    const colors = {
      green: useCssVar('--ion-color-success'),
      amber: useCssVar('--ion-color-warning'),
      red: useCssVar('--ion-color-danger'),
    }

    // Chart.js instance.
    const chart = new ref()

    // Canvas element used for chart display.
    const canvas = new ref(null)

    //
    function clickHandler(event, elements = []) {
      const first = elements[0]

      if (first && first instanceof Element) {
        const chart = first._chart
        const pointData =
          chart.data?.datasets[first._datasetIndex]?.data[first._index]

        //
        const timestamp = pointData?.x

        //
        emit('selected', timestamp)
      }
    }

    // Merge options with defaults.
    const chartOptions = reactive(props.options || {})
    Object.assign(chartOptions, defaultOptions)
    chartOptions.onClick = clickHandler

    //
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
              backgroundColor: colors.green,
              data: datasets.green,
            },
            {
              backgroundColor: colors.amber,
              data: datasets.amber,
            },
            {
              backgroundColor: colors.red,
              data: datasets.red,
            },
          ],
        }
      },
    })

    //
    onMounted(() => {
      chart.value = new Chart(canvas.value, {
        type: 'line',
        options: chartOptions,
        data: chartData.value,
      })

      // Update chart on changes.
      watchEffect(() => {
        chart.value.update()
      })
    })

    return { canvas, chart, chartOptions, chartData }
  },
})
</script>
