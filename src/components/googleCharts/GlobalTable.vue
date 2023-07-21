<template>
    <table class="table" :v-if="chartDataLoaded">
        <thead>
            <tr>
                <th>KN</th>
                <th>SAMI</th>
            </tr>
        </thead>
        <tbody>
            <tr>
                <td>{{ sumAllValues(chartData) }}</td>
                <td>
                    <StackedBar :bars="chartData" :value="true"></StackedBar>
                </td>
            </tr>
        </tbody>
    </table>
</template>
    
<script>
import StackedBar from '../../components/pebble-ui/charts/StackedBar.vue'
export default {
    data() {
        return {
            chartData: [],
            chartDataLoaded: false,
        }
    },

    methods: {
        fetchData() {
            this.chartDataLoaded = false;
            this.chartData = [
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
                }
            ];

            const data = this.$assets.getCollection('collectesCollection').getCollection();
            data.forEach(collecte => {
                switch (collecte['sami']?.toUpperCase()) {
                    case 'S':
                        this.chartData[0].value++;
                        break;
                    case 'A':
                        this.chartData[1].value++;
                        break;
                    case 'M':
                        this.chartData[2].value++;
                        break;
                    case 'I':
                        this.chartData[3].value++;
                        break;
                    default:
                        this.chartData[4].value++;
                        break;
                }
            });
            this.chartDataLoaded = true;
        },

        sumAllValues(values) {
            let sum = 0;
            values.forEach(val => {
                sum += val.value;
            });
            return sum;
        }
    },
    components: { StackedBar },
    mounted() {
        this.fetchData();
    },
}
</script>
    