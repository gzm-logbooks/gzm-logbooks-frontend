<template>
  <canvas ref="canvas" />
</template>

<script>
import {
  defineComponent,
  ref,
  reactive,
  computed,
  watchEffect,
  onMounted,
} from 'vue'
import { Chart } from 'chart.js'

export default defineComponent({
  props: {
    options: {
      type: Object,
      default() {
        return {
          legend: {
            display: false, // Hide the legend
          },
          elements: {
            point: {
              radius: 0,
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
                  min: 0, // Might want to change this? See how it feels when working
                  max: 0.5,
                },
              },
            ],
          },
        }
      },
    },
    entries: {
      type: Object,
    },
  },
  setup(props) {
    const chart = new ref()

    //
    const canvas = new ref(null)
    const chartOptions = reactive(props.options)
    const chartData = computed({
      get() {
        //return demoData()

        //
        const datasets = props.entries.reduce(
          (accumulator = [], entry) => {
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
          {
            red: [],
            amber: [],
            green: [],
          }
        )

        return {
          datasets: [
            {
              backgroundColor: 'rgb(0,255,0)', // First  dataset will be on top
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
            backgroundColor: 'rgb(0,255,0)', // First  dataset will be on top
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
            backgroundColor: 'rgb(255,0,0)', // Last dataset will be behind
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

    return {
      canvas,
      chart,
      chartOptions,
      chartData,
    }
  },
})
</script>
