<template v-if="!pending.fetchData">
  <table class="table">
    <thead>
      <tr>
        <th v-for="(label, index) in chartData[0]" :key="index">{{ label }}</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="(row, rowIndex) in chartData.slice(1)" :key="rowIndex">
        <td v-for="(value, columnIndex) in row" :key="columnIndex">
          <template v-if="columnIndex === 3">
            <StackedBar :bars="value" :value="true"></StackedBar>
          </template>
          <template v-else>
            {{ value }}
          </template>
        </td>
      </tr>
    </tbody>
  </table>
</template>
  
<script>
import StackedBar from '../../components/pebble-ui/charts/StackedBar.vue'
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
      required: true
    },
  },
  computed: {
    ...mapState(['statResult', 'personnels'])
  },
  methods: {
    fetchData() {
      /*this.chartData = [
        ['', 'KN', 'Type habilitation', 'Total habilitations', 'S', 'A', 'M', 'I'],
      ];*/
      this.chartData = [
        ['', 'KN', 'Habilitations contrôlées', 'SAMI'],
      ];
      const data = this.statResult;
      let habilitationTypeHistory = [];
      //let totalHabilitationsHIstory = [];

      data.forEach(collecte => {
        const id = collecte['personnel_id__controleur'];
        const index = this.chartData.findIndex(controleur => (controleur[0] == id));
        if (habilitationTypeHistory.findIndex(id => id == collecte['habilitation_type_id']) == -1) {
          habilitationTypeHistory.push(collecte['habilitation_type_id']);
        }
        /*if (totalHabilitationsHIstory.findIndex(id => id == collecte['habilitation_id']) == -1) {
          totalHabilitationsHIstory.push(collecte['habilitation_id']);
        }*/
        if (index >= 0) {
          this.chartData[index][1]++;//incrémentation du champ KN
          this.chartData[index][2] = habilitationTypeHistory.length;
          //this.chartData[index][3] = totalHabilitationsHIstory.length;
          switch (collecte['sami']) {
            case 'S':
              //this.chartData[index][4]++;
              this.chartData[index][3][0].value++;
              break;
            case 'A':
              //this.chartData[index][5]++;
              this.chartData[index][3][1].value++;
              break;
            case 'M':
              //this.chartData[index][6]++;
              this.chartData[index][3][2].value++;
              break;
            case 'I':
              //this.chartData[index][7]++;
              this.chartData[index][3][3].value++;
              break;
            default:
              this.chartData[index][3][4].value++;
              break;
          }

        } else {
          let newRow = ['Contrôleur ' + id, 1, habilitationTypeHistory.length, [
            {
              color: 'success',
              value: 0
            },
            {
              color: 'primary',
              value: 0
            },
            {
              color: 'warning',
              value: 0
            },
            {
              color: 'danger',
              value: 0
            },
            {
              color: 'secondary',
              value: 0
            },
          ]];
          switch (collecte['sami']) {
            case 'S':
              //newRow[4]++;
              newRow[3][0].value++;
              break;
            case 'A':
              //newRow[5]++;
              newRow[3][1].value++;
              break;
            case 'M':
              //newRow[6]++;
              newRow[3][2].value++;
              break;
            case 'I':
              //newRow[7]++;
              newRow[3][3].value++;
              break;
            default:
              newRow[3][4].value++;
              break;
          }
          this.chartData.push(newRow);
        }
      });
      habilitationTypeHistory = [];
      //totalHabilitationsHIstory = [];
    }
  },
  components: { StackedBar },
  mounted() {
    this.pending.fetchData = true;
    this.fetchData();
    this.getOperatorById();
    this.pending.fetchData = false;
  },
}
</script>
  