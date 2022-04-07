<template>
  <div>
    <p class="text-3xl font-bold">
      Growth {{ scaled.amountAmber.toFixed(2) }} Anxiety
      {{ scaled.amountRed.toFixed(2) }} Comfort
      {{ scaled.amountGreen.toFixed(2) }}
    </p>
    <svg
      viewBox="0 0 400 250"
      xmlns="http://www.w3.org/2000/svg"
      xmlns:bx="https://boxy-svg.com"
    >
      <defs>
        <bx:grid x="0" y="0" width="100" height="95.446" />
        <linearGradient
          id="gradient-0"
          gradientUnits="userSpaceOnUse"
          x1="200"
          y1="0"
          x2="200"
          y2="141.421"
          gradientTransform="matrix(0, -1, 2.82842712475, 0, 0, 0)"
        >
          <stop offset="0" style="stop-color: rgba(0, 255, 8, 0.79)" />
          <stop offset="1" style="stop-color: rgba(255, 9, 0, 0.85)" />
        </linearGradient>
        <linearGradient
          id="gradient-1"
          gradientUnits="userSpaceOnUse"
          x1="200"
          y1="0"
          x2="200"
          y2="141.421"
          gradientTransform="matrix(1, 0, 0, 1, 0, 0)"
        >
          <stop offset="0" style="stop-color: rgb(255, 115, 0)" />
          <stop offset="1" style="stop-color: rgba(255, 115, 0, 0)" />
        </linearGradient>
      </defs>
      <path
        d="M 200 25 L 400 225 L 0 225 L 200 25 Z"
        style="fill: url(#gradient-0)"
        bx:shape="triangle 0 25 400 141.421 0.5 0 1@88f9a85d"
      />
      <path
        d="M 200 25 L 400 225 L 0 225 L 200 25 Z"
        style="fill: url(#gradient-1)"
        bx:shape="triangle 0 25 400 141.421 0.5 0 1@88f9a85d"
      />
      <g :transform="triangleTransform">
        <circle r="3" fill="red" />
        <circle r="2" fill="orange" />
        <circle r="1" fill="green" />
      </g>
      <text
        style="
          white-space: pre;
          fill: rgb(51, 51, 51);
          font-family: Arial, sans-serif;
          font-size: 18.8px;
        "
        x="169.331"
        y="17.5"
      >
        Growth
      </text>
      <text
        style="
          white-space: pre;
          fill: rgb(51, 51, 51);
          font-family: Arial, sans-serif;
          font-size: 18.8px;
        "
        x="0"
        y="245"
      >
        Comfort
      </text>
      <text
        style="
          white-space: pre;
          fill: rgb(51, 51, 51);
          font-family: Arial, sans-serif;
          font-size: 18.8px;
        "
        x="338.123"
        y="245"
      >
        Anxiety
      </text>
    </svg>
  </div>
</template>

<script>
export default {
  props: {
    mood: { type: Object },
  },
  computed: {
    scaled() {
      const { amountRed, amountAmber, amountGreen } = this.mood ?? {
        amountRed: 0,
        amountAmber: 0,
        amountGreen: 0,
      }

      return {
        amountRed: (amountRed - amountAmber - 0.05) / 0.8,
        amountAmber: (amountAmber - amountGreen - 0.05) / 0.8,
        amountGreen: (amountGreen - 0.1) / 0.8,
      }
    },
    triangleTransform() {
      const scaler = 200 * Math.sqrt(2)
      return `translate(200,25) rotate(45) translate(${
        this.scaled.amountRed * scaler
      },${this.scaled.amountGreen * scaler})`
    },
  },
}
</script>
