<template>
  <div class="w-full">
    <canvas ref="canvasRef" />
  </div>
</template>

<script lang="ts" setup>
import { Chart } from 'chart.js'
import tailwindConfig from '#tailwind-config'

const props = defineProps({
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
})

const emit = defineEmits(['selected'])

const chartOptions = reactive({
  animation: false,
  responsive: true,
  plugins: {
    legend: {
      display: false,
    },
  },
  elements: {
    point: {
      pointStyle: 'circle',
      radius: 0,
    },
    line: {
      showLine: false,
      borderWidth: 0,
      tension: 1 / 4,
    },
  },
  scales: {
    x: {
      display: props.full,
      type: 'timeseries',
      time: {
        unit: 'day',
      },
      ticks: {
        auto: true,
        display: true,
        align: 'start',
        // showLabelBackdrop: true,
        source: 'data',
        // maxTicksLimit: 12,
        minRotation: 0,
      },
      grid: {
        display: true,
      },
      // max: new Date(),
      // suggestedMax: new Date(),
    },
    y: {
      display: false,
      min: 0,
      max: props.full ? 1.03 : 1,
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

const canvasRef = ref()
const chartRef = ref()

function updateChart(entries) {
  if (!chartRef.value) {
    return
  }

  // const datasets = entries.reduce((accumulator, entry) => {
  //   accumulator.red.push({
  //     primary: entry.primary,
  //     x: entry.timestamp,
  //     y: entry.amountAnxiety ?? 0
  //   })
  //   accumulator.amber.push({
  //     primary: entry.primary,
  //     x: entry.timestamp,
  //     y: entry.amountGrowth ?? 0
  //   })
  //   accumulator.green.push({
  //     primary: entry.primary,
  //     x: entry.timestamp,
  //     y: entry.amountComfort ?? 0
  //   })
  //   return accumulator
  // }, {
  //   anxiety: [],
  //   growth: [],
  //   comfort:  []
  // })

  const { green, amber, red } = tailwindConfig.theme.colors

  chartRef.value.data.datasets = [
    {
      fill: {
        target: 'origin',
        above: green,
      },
      data: [],
      stepped: props.full ? false : 'before',
    },
    // {
    //   fill: {
    //     target: 'origin',
    //     above: comfort
    //   },
    //   data: datasets.green,
    //   stepped: props.full ? false : 'before'
    // },
    // {
    //   fill: {
    //     target: 'origin',
    //     above: growth
    //   },
    //   data: datasets.amber,
    //   stepped: props.full ? false : 'before'
    // },
    // {
    //   fill: {
    //     target: 'origin',
    //     above: anxiety
    //   },
    //   data: datasets.red,
    //   stepped: props.full ? false : 'before'
    // }
  ]

  // chartRef.value.update()
}

watchEffect(() => {
  updateChart(props.entries)
})

onMounted(() => {
  console.log({
    type: 'line',
    options: Object.assign(toRaw(chartOptions), props.options),
    data: {
      datasets: [],
    },
  })

  chartRef.value = new Chart(canvasRef.value, {
    type: 'line',
    options: {}, // chartOptions, // Object.assign(toRaw(chartOptions), props.options),
    data: {
      datasets: [],
    },
  })

  // updateChart(props.entries)
})
</script>
