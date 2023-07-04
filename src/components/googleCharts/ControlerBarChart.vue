<template>
    <GChart :type="type" :data="chartData" :options="options" v-if="chartDataLoaded" />
</template>

<script>
import { GChart } from 'vue-google-charts'

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
            type: "BarChart",
            chartData: null,
            chartDataLoaded: false,
            options: {
                isStacked: "percent",
                height: 0, 
            },
            pixelHeight: 75
        }
    },
    mounted() {
        this.fetchData(this.jsonData);
    },
    methods: {
        fetchData(jsonData) {
            console.log(jsonData),
                this.chartData = [
                    ['Contrôleurs', 'S', 'A', 'M', 'I'],
                    ['Contrôleur 1', 10, 3, 5, 2],
                    ['Contrôleur 2', 10, 3, 5, 2],
                ];
            this.options.height = (this.chartData.length - 1) * this.pixelHeight;
            this.chartDataLoaded = true;
        }
    }
}
</script>
