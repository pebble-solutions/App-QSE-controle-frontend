<template>
    <div class="card">
      <div class="card-body">
        <div class="fw-bold mb-3 text-center">Note moyenne : {{ getAverage() }}/20</div>

        <div class="progress-container">
          <div class="progress">
            <div
              class="progress-bar bg-danger"
              role="progressbar"
              :style="{ width: '25%' }"
              aria-valuenow="25"
              aria-valuemin="0"
              aria-valuemax="100"
            >
              I
            </div>
            <div
              class="progress-bar bg-warning"
              role="progressbar"
              :style="{ width: '25%' }"
              aria-valuenow="25"
              aria-valuemin="0"
              aria-valuemax="100"
            >
              M
            </div>
            <div
              class="progress-bar bg-primary"
              role="progressbar"
              :style="{ width: '25%' }"
              aria-valuenow="25"
              aria-valuemin="0"
              aria-valuemax="100"
            >
              A
            </div>
            <div
              class="progress-bar bg-success"
              role="progressbar"
              :style="{ width: '25%' }"
              aria-valuenow="25"
              aria-valuemin="0"
              aria-valuemax="100"
            >
              S
            </div>
          </div>
          <div class="indicator" :style="{ left: progressPosition + '%' }"></div>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    props: {
      average: {
        type: Number,
        required: true,
      },
    },
    computed: {
        
        
        progressPosition() {
  const minAverage = 1;
  const maxAverage = 4;
  const minPosition = 12.5;
  const maxPosition = 87.5;
  return Math.min(Math.max(((this.average - minAverage) / (maxAverage - minAverage)) * (maxPosition - minPosition) + minPosition, minPosition), maxPosition);
},

    },
    methods: {
    getAverage() {
      const calculatedAverage = ((this.average - 1) / 3) * 20;
      return calculatedAverage.toFixed(2);
    },
    
  },
  };
  </script>
  
  <style scoped>
  .card-body {
    position: relative;
    padding: 5px;
  }

  
  .progress {
    position: relative;
    height: 20px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    color: white;
    text-align: center;
  }
  
  .progress-container {
    position: relative;
    height: 30px;
  }
  
  .indicator {
    position: absolute;
    top: -6px;
    transform: translate(-50%, -50%);
    width: 0;
    height: 0;
    border-left: 8px solid transparent;
    border-right: 8px solid transparent;
    border-top: 10px solid black;
    z-index: 1;
  }
  </style>
  