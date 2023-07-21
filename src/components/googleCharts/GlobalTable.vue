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
                ['KN', 'S', 'A', 'M', 'I'],
                [0, 0, 0, 0, 0]
            ];

            const data = this.$assets.getCollection('collectesCollection').getCollection();

            data.forEach(collecte => {
                this.chartData[1][0]++;//incrémentation du champ KN

                switch (collecte['sami']) {
                    case 'S':
                        this.chartData[1][1]++;
                        break;
                    case 'A':
                        this.chartData[1][2]++;
                        break;
                    case 'M':
                        this.chartData[1][3]++;
                        break;
                    case 'I':
                        this.chartData[1][4]++;
                        break;
                    default:
                        break;
                }
            });
            this.chartDataLoaded = true;
        }
    },
    mounted() {
        this.fetchData();
    },
}
</script>
    