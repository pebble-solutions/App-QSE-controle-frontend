<template>
    <GChart :type="type" :data="chartData" :options="options" v-if="chartDataLoaded" />
</template>

<script>
import { GChart } from 'vue-google-charts'
import { mapState } from 'vuex';

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
    computed: {
        ...mapState['collectes']
    },
    methods: {
        fetchData(jsonData) {
            console.log(jsonData),
                this.chartData = [
                    ['Habilitations', 'S', 'A', 'M', 'I'],
                    ['ASP en équipe 1', 10, 3, 5, 2],
                    ['ASP en équipe 2', 10, 3, 5, 2],
                    ['ASP en équipe 3', 10, 3, 5, 2],
                    ['ASP en équipe 4', 10, 3, 5, 2],
                    ['ASP en équipe 5', 10, 3, 5, 2],
                    ['ASP en équipe 6', 10, 3, 5, 2],
                    ['ASP en équipe 6', 10, 3, 5, 2],
                    ['ASP en équipe 6', 10, 3, 5, 2],
                    ['ASP en équipe 6', 10, 3, 5, 2],
                    ['ASP en équipe 6', 10, 3, 5, 2],
                    ['ASP en équipe 6', 10, 3, 5, 2],
                    ['ASP en équipe 6', 10, 3, 5, 2],
                    ['ASP en équipe 6', 10, 3, 5, 2],
                    ['ASP en équipe 6', 10, 3, 5, 2],
                    ['ASP en équipe 6', 10, 3, 5, 2],
                ];
            this.options.height = (this.chartData.length - 1) * this.pixelHeight;
            this.chartDataLoaded = true;
        }
    }
}
</script>
