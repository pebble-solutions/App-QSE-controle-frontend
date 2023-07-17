<template>
  <table class="table">
    <thead>
      <tr>
        <th v-for="(label, index) in chartData[0]" :key="index">{{ label }}</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="(row, rowIndex) in chartData.slice(1)" :key="rowIndex">
        <td v-for="(value, columnIndex) in row" :key="columnIndex">{{ value }}</td>
      </tr>
    </tbody>
  </table>
</template>
  
<script>

import { mapState } from 'vuex';
export default {
  props: {
    jsonData: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      chartData: [],
      options: {}
    }
  },
  mounted() {
    this.fetchData(this.jsonData);
},
computed: {
  ...mapState(['collectes'])
},
methods: {
  fetchData(jsonData) {
    console.log(jsonData),
      this.chartData = [
        ['', 'KN', 'Habilitation', 'Total habilitations', 'S', 'A', 'M', 'I'],
        ['APLAM', 8, 7, 32, 4, 2, 1, 1]
      ];
  }
}
}
</script>
  