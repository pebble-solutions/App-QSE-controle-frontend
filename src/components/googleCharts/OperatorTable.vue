<template v-if="!pending.fetchData">
  <table class="table">
    <thead>
      <tr>
        <th></th>
        <th>KN</th>
        <th>Habilitation contrôlées</th>
        <th>SAMI</th>
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
    }
  },
  props: {
    requeteStat: {
      type: Object,
      required: true
    }
  },
  computed: {
    ...mapState(['personnels'])
  },
  methods: {
    fetchData() {
      this.chartData = [];
      const data = this.$assets.getCollection('collectesCollection').getCollection();
      let habilitationTypeHistory = [];

      data.forEach(collecte => {
        const id = collecte['personnel_id__operateur'];
        const index = this.chartData.findIndex(operateur => (operateur[0] == 'Opérateur ' + id));
        if (habilitationTypeHistory.findIndex(id => id == collecte['habilitation_type_id']) == -1) {
          habilitationTypeHistory.push(collecte['habilitation_type_id']);
        }
        if (index >= 0) {
          this.chartData[index][1]++;//incrémentation du champ KN
          this.chartData[index][2] = habilitationTypeHistory.length;
          switch (collecte['sami']) {
            case 'S':
              this.chartData[index][3][0].value++;
              break;
            case 'A':
              this.chartData[index][3][1].value++;
              break;
            case 'M':
              this.chartData[index][3][2].value++;
              break;
            case 'I':
              this.chartData[index][3][3].value++;
              break;
            default:
              this.chartData[index][3][4].value++;
              break;
          }
        } else {
          let newRow = ['Opérateur ' + id, 1, habilitationTypeHistory.length, [
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
              newRow[3][0].value++;
              break;
            case 'A':
              newRow[3][1].value++;
              break;
            case 'M':
              newRow[3][2].value++;
              break;
            case 'I':
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
    }
  },
  components: { StackedBar },
  mounted() {
    this.fetchData();
  },
}
</script>
  