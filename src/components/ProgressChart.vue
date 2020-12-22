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
export default defineComponent({
  props: {
    options: {
      type: Object,
    },
    entries: { type: Object },
  },
  emits: ['selected'],
  setup(props, { emit }) {
    const chart = new ref()

    //
    const canvas = new ref(null)

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
      onClick(event, elements = []) {
        const first = elements[0]

        if (first && first instanceof Element) {
          const chart = first._chart
          const pointData =
            chart.data?.datasets[first._datasetIndex]?.data[first._index]
          const timestamp = pointData?.x

          emit('selected', timestamp)
        }
      },
    })
    const chartOptions = reactive(props.options || {})
    Object.assign(chartOptions, defaultOptions)

    const chartData = computed({
      get() {
        //return demoData()

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
      chart.value = new Chart(canvas.value, {
        type: 'line',
        options: chartOptions,
        data: chartData.value,
      })

      console.log(chartData.value)

      watchEffect(() => {
        chart.value.update()
      })
    })

    function demoData() {
      return {
        datasets: [
          {
            backgroundColor: 'rgb(0,255,0)',
            data: [
              {
                x: new Date('August 19, 1975 23:15:30'),
                y: 0.3,
              },
              {
                x: new Date('August 21, 1975 23:15:30'),
                y: 0.2,
              },
              {
                x: new Date('August 22, 1975 23:15:30'),
                y: 0.2,
              },
            ],
          },
          {
            backgroundColor: 'rgb(255,165,0)',
            data: [
              {
                x: new Date('August 19, 1975 23:15:30'),
                y: 0.4,
              },
              {
                x: new Date('August 21, 1975 23:15:30'),
                y: 0.3,
              },
              {
                x: new Date('August 22, 1975 23:15:30'),
                y: 0.3,
              },
            ],
          },
          {
            backgroundColor: 'rgb(255,0,0)',
            data: [
              {
                x: new Date('August 19, 1975 23:15:30'),
                y: 0.5,
              },
              {
                x: new Date('August 21, 1975 23:15:30'),
                y: 0.4,
              },
              {
                x: new Date('August 22, 1975 23:15:30'),
                y: 0.5,
              },
            ],
          },
        ],
      }
    }
    return { canvas, chart, chartOptions, chartData }
  },
})
</script>
