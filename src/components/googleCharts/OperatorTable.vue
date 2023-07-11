<template>
  <table class="table" :v-if="chartDataLoaded">
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
export default {
  data() {
    return {
      chartData: [],
      chartDataLoaded: false,
    }
  },
  methods: {
    async fetchData() {
      this.chartDataLoaded = false;
      this.chartData = [
        ['', 'KN', 'Type habilitation', 'Total habilitations', 'S', 'A', 'M', 'I'],
      ];
      let collection = this.$assets.getCollection('collectes');
      const data = collection.getCollection();
      let habilitationTypeHistory = [];
      let totalHabilitationsHIstory = [];

      const ids = [437];
      let i = 1;
      ids.forEach(id => {
        data.forEach(collecte => {
          if (id == collecte['personnel_id__operateur']) {
            if (this.chartData[i]) {
              this.chartData[i][1]++;//incrémentation du champ KN
              if (habilitationTypeHistory.findIndex(id => id == collecte['habilitation_type_id']) == -1) {
                habilitationTypeHistory.push(collecte['habilitation_type_id']);
              }
              if (totalHabilitationsHIstory.findIndex(id => id == collecte['habilitation_id']) == -1) {
                totalHabilitationsHIstory.push(collecte['habilitation_id']);
              }
              this.chartData[i][3]++;
              switch (collecte['sami']) {
                case 'S':
                  this.chartData[i][4]++;
                  break;
                case 'A':
                  this.chartData[i][5]++;
                  break;
                case 'M':
                  this.chartData[i][6]++;
                  break;
                case 'I':
                  this.chartData[i][7]++;
                  break;
                default:
                  break;
              }
            } else {
              this.chartData.push(['Opérateur ' + id, 0, 0, 0, 0, 0, 0, 0]);
            }
          }
        });
        this.chartData[i][2] = habilitationTypeHistory.length;
        this.chartData[i][3] = totalHabilitationsHIstory.length;
        habilitationTypeHistory = [];
        totalHabilitationsHIstory = [];
        i++;
      });
    }
  },
  mounted() {
    this.fetchData();
  },
}
</script>
  