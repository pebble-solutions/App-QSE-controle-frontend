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
import { mapState } from 'vuex';
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
  computed: {
    ...mapState(['statResult', 'projets'])
  },
  methods: {
    fetchData() {
      this.chartData = [
        ['', 'KN', 'Type habilitation', 'Total habilitations', 'S', 'A', 'M', 'I'],
      ];
      const data = this.statResult;
      let habilitationTypeHistory = [];
      let totalHabilitationsHIstory = [];

      data.forEach(collecte => {
        const id = collecte['projet_id'];
        const index = this.chartData.findIndex(projet => (projet[0] == id));
        if (habilitationTypeHistory.findIndex(id => id == collecte['habilitation_type_id']) == -1) {
          habilitationTypeHistory.push(collecte['habilitation_type_id']);
        }
        if (totalHabilitationsHIstory.findIndex(id => id == collecte['habilitation_id']) == -1) {
          totalHabilitationsHIstory.push(collecte['habilitation_id']);
        }
        if (index >= 0) {
          this.chartData[index][1]++;//incrémentation du champ KN
          this.chartData[index][2] = habilitationTypeHistory.length;
          this.chartData[index][3] = totalHabilitationsHIstory.length;
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
        } else {
          let newRow = [id, 1, habilitationTypeHistory.length, totalHabilitationsHIstory.length, 0, 0, 0, 0];
          switch (collecte['sami']) {
            case 'S':
              newRow[4]++;
              break;
            case 'A':
              newRow[5]++;
              break;
            case 'M':
              newRow[6]++;
              break;
            case 'I':
              newRow[7]++;
              break;
            default:
              break;
          }
          this.chartData.push(newRow);
        }
      });
      habilitationTypeHistory = [];
      totalHabilitationsHIstory = [];
    },
    getOperatorById(){
            let projets = this.projets;
            this.chartData.forEach(chartDataRow => {
                const projet = projets.find(projet => projet.id === chartDataRow[0]);
                if(projet != null){
                    chartDataRow[0] = projet.intitule;
                }else {
                    chartDataRow[0] = 'Projet ' + chartDataRow[0];
                }
            });
        }
  },
  async mounted() {
    this.pending.fetchData = true;
    await this.fetchData();
    this.getOperatorById();
    this.pending.fetchData = false;
  },
}
</script>
  