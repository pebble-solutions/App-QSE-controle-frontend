<template v-if="!pending.fetchData">
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
export default {
  data() {
    return {
      chartData: [],
      pending: {
        fetchData: true,
      },
    }
  },
  props: {
    requeteStat: {
      type: Object,
      required: true,
    }
  },
  methods: {
    fetchData() {
      this.chartData = [
        ['', 'KN', 'Type habilitation', 'Total habilitations', 'S', 'A', 'M', 'I'],
      ];
      let collection = this.$assets.getCollection('collectes');
      const data = collection.getCollection();

      let habilitationTypeHistory = [];
      let totalHabilitationsHIstory = [];

      const ids = this.requeteStat.projets;
      ids.forEach(id => {
        data.forEach(collecte => {
          if (id == collecte['projet_id']) {
            const index = this.chartData.findIndex(projet => ( projet[0] == 'Projet ' + id));
            if (index >= 0) {
              this.chartData[index][1]++;//incrémentation du champ KN
              if (habilitationTypeHistory.findIndex(id => id == collecte['habilitation_type_id']) == -1) {
                habilitationTypeHistory.push(collecte['habilitation_type_id']);
              }
              if (totalHabilitationsHIstory.findIndex(id => id == collecte['habilitation_id']) == -1) {
                totalHabilitationsHIstory.push(collecte['habilitation_id']);
              }
              this.chartData[index][3]++;
              switch (collecte['sami']) {
                case 'S':
                  this.chartData[index][4]++;
                  break;
                case 'A':
                  this.chartData[index][5]++;
                  break;
                case 'M':
                  this.chartData[index][6]++;
                  break;
                case 'I':
                  this.chartData[index][7]++;
                  break;
                default:
                  break;
              }
              this.chartData[index][2] = habilitationTypeHistory.length;
              this.chartData[index][3] = totalHabilitationsHIstory.length;
            } else {
              this.chartData.push(['Projet ' + id, 0, 0, 0, 0, 0, 0, 0]);
            }
          }
        });
        habilitationTypeHistory = [];
        totalHabilitationsHIstory = [];
      });
    }
  },
  async mounted() {
    this.pending.fetchData = true;
    await this.fetchData();
    this.pending.fetchData = false;
  },
}
</script>
  