<template>
    <div class="card">
      <div class="card-body">
        <div class="fw-bold mb-4 text-center">
            Note moyenne : {{ getAverage(n1Obj) }}/10
        </div>

        <div class="progress-container">
          <div class="progress">
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
              class="progress-bar bg-danger"
              role="progressbar"
              :style="{ width: '25%' }"
              aria-valuenow="25"
              aria-valuemin="0"
              aria-valuemax="100"
            >
              I
            </div>
          </div>
          <div class="indicator" :style="{ left: calculateProgressPosition(n1Obj) + '%' }"></div>
          <div class="generalIndicator" :style="{ left: calculateProgressPosition(n2Obj) + '%' }">
          <div class="average-display text-center">
          {{ getAverage(n2Obj) }}
          </div>
        </div>
          <div class="userImageIndicator" :style="{ left: calculateProgressPosition(n1Obj) + '%' }">
            <UserImage size='sm' name='H'></UserImage>
        </div>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  import UserImage from './pebble-ui/UserImage.vue';

  export default {

    props: {
      n1: {
        type: Number,
        required: true,
      },
      n2: {
        type: Number,
        required: true,
      },
    },

    computed: {
        n1Obj() {
        return { value: this.n1 };
      },
      n2Obj() {
        return { value: this.n2 };
      },
    },

    methods: {
          calculateProgressPosition(obj) {
        const minAverage = 1;
        const maxAverage = 4;
        const minPosition = 12.5;
        const maxPosition = 87.5;
        const average = obj.value;

        const position = Math.min(
          Math.max(
            ((average - minAverage) / (maxAverage - minAverage)) *
              (maxPosition - minPosition) +
              minPosition,
            minPosition
          ),
          maxPosition
        );

        return maxPosition - position + minPosition; // Invert the progress
      },
        getAverage(obj) {
        const average = obj.value;
        const calculatedAverage = ((average - 1) / 3) * 10;
        const roundedAverage = Math.round(calculatedAverage);

        // Vérifier si la partie décimale est nulle
        if (calculatedAverage % 1 === 0) {
          return roundedAverage.toString();
        } else {
          return calculatedAverage.toFixed(1);
        }
      },
      
    },

    components: { UserImage},
  

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
    background-color: transparent;
    z-index: 1;
  }
  
  .indicator {
    position: absolute;
    top: -2px;
    transform: translate(-50%, -50%);
    width: 0;
    height: 0;
    border-left: 6px solid transparent;
    border-right: 6px solid transparent;
    border-top: 6px solid grey;
    z-index: 1;
  }

  /*  ancien design triangle 
  .indicator {
  position: absolute;
  top: -6px;
  transform: translate(-50%, -50%);
  width: 0;
  height: 0;
  border-left: 8px solid transparent;
  border-right: 8px solid transparent;
  border-bottom: 10px solid black;
  z-index: 1;


   .generalIndicator {
  position: absolute;
  bottom: -6px;
  transform: translate(-50%, -50%);
  width: 0;
  height: 0;
  border-left: 8px solid transparent;
  border-right: 8px solid transparent;
  border-bottom: 10px solid grey;
  z-index: 1;
}
} */

  .userImageIndicator {
  position: absolute;
  top: -16px;
  transform: translate(-50%, -50%);
  z-index: 2;
}
.generalIndicator {
        position: absolute;
        top: 35%;
        transform: translate(-50%, -50%);
        border-left: 2px solid rgba(247, 140, 107, 0.3);
        border-right: 2px solid rgba(247, 140, 107, 0.3);
        width: 10%;
        height: 30px; /* Adjust according to your needs */
        background-color: rgba(247, 140, 107, 0.4); /* Semi-transparent orange */
        z-index: 0; /* To place it behind progress-container */
    }

    .average-display {
    position: absolute;
    top: -23px; /* adjust this to position the element correctly */
    width: 100%;
    color: rgba(247, 140, 107, 0.55);
  }

.light-gray {
    color: rgba(255, 140, 83, 0.377); /*You can adjust the color code to get the exact shade of gray you want*/
}

  </style>
  