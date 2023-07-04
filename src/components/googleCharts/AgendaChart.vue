<template>
    <div :id="chartElementId">
        <GChart :type="type" :data="chartData" :options="options" :settings="settings" :chart-element="chartElementId" v-if="chartDataLoaded" />
    </div>
</template>

<script>
import { mapState } from 'vuex';
import { GChart } from 'vue-google-charts';

export default {
    props: {
        jsonData: {
            type: Object,
            required: true
        }
    },

    components: { GChart },

    data() {
        return {
            type: 'Calendar',
            options: {
            },
            settings: {
                packages: ['calendar', 'corechart'],
            },
            chartData: null,
            chartDataLoaded: false,
            chartElementId: "agendaChart"
        }
    },
    mounted() {
        this.fetchData(this.jsonData);
    },
    computed: {
        ...mapState(['collectes'])
    },
    methods: {
        fetchData() {
            /*const dateOccurrences = {};
            for (const i in jsonData['data']) {
                const date = jsonData['data'][i].date_done.split(' ')[0];
                dateOccurrences[date] = dateOccurrences[date] ? dateOccurrences[date] + 1 : 1;
            }

            this.chartData = [
                ['Date', 'Occurencies'],
                ...Object.entries(dateOccurrences).map(([date, count]) => [new Date(date), count])
            ];
            this.chartDataLoaded = true;*/


            const dateOccurrences = {};
            for (const element of this.collectes) {
                console.log(element);
                if (element.done_done != null) {
                    const date = element.done_done.split(' ')[0];
                    dateOccurrences[date] = dateOccurrences[date] ? dateOccurrences[date] + 1 : 1;
                }
            }

            this.chartData = [
                ['Date', 'Occurencies'],
                ...Object.entries(dateOccurrences).map(([date, count]) => [new Date(date), count])
            ];
            this.chartDataLoaded = true;
        }
    }
}
</script>
