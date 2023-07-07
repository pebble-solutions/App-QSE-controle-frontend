<template>
    <GChart :type="type" :data="chartData" :options="options" v-if="chartDataLoaded" />
    <div id="controlerBarChart"></div>
</template>

<script>
import { GChart } from 'vue-google-charts'
import { GoogleCharts } from 'google-charts'

export default {
    components: { GChart },

    data() {
        return {
            type: "BarChart",
            chartData: [],
            chartDataLoaded: false,
            options: {
                isStacked: "percent",
                height: 0,
            },
            pixelHeight: 75
        }
    },
    methods: {
        async fetchData() {
            /*this.chartData = [
                ['Contrôleurs', 'S', 'A', 'M', 'I'],
                ['Contrôleur 1', 10, 3, 5, 2],
                ['Contrôleur 2', 10, 3, 5, 2],
            ];*/

            let collection = this.$assets.getCollection('collectes');
            await collection.load();
            const data = collection.getCollection();

            this.chartData = [];
            this.chartData.push(['Contrôleurs', 'S', 'A', 'M', 'I']);
            const ids = [268];
            let i = 1;
            for (const id of ids) {
                data.array.forEach(collecte => {
                    if (collecte['personnel_id__controleur'] == id) {
                        switch (collecte['sami']) {
                            case 'S':
                                if (this.chartData[i]) {
                                    this.chartData[i][1]++;
                                } else { this.chatData[i] = ['Contrôleur ' + i, 0, 0, 0, 0] }
                                break;
                            case 'A':
                                if (this.chartData[i]) {
                                    this.chartData[i][2]++;
                                } else { this.chatData[i] = ['Contrôleur ' + i, 0, 0, 0, 0] }
                                break;
                            case 'M':
                                if (this.chartData[i]) {
                                    this.chartData[i][3]++;
                                } else { this.chatData[i] = ['Contrôleur ' + i, 0, 0, 0, 0] }
                                break;
                            case 'I':
                                if (this.chartData[i]) {
                                    this.chartData[i][4]++;
                                } else { this.chatData[i] = ['Contrôleur ' + i, 0, 0, 0, 0] }
                                break;
                            default:
                                break;
                        }
                    }
                });
                i++;
            }

            this.options.height = (this.chartData.length - 1) * this.pixelHeight;
            this.chartDataLoaded = true;
        }
    },
    async mounted() {
        await this.fetchData();
        GoogleCharts.load(this.drawChart, {
            packages: ['corechart'],
        });
    },
}
</script>
