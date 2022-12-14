<template>
    <div>
        <div class="card my-2">
            <div class="card-body">
                <h3 class="fs-4">Répartition sur l'ensemble des contrôles</h3>
                <div id="sami_piechart" style="width:100%; height:300px; position:relative;"></div>
            </div>
        </div>

        <div class="card my-2">
            <div class="card-body">
                <h3 class="fs-4">Répartition par contrôles réalisés</h3>
                <div id="chart_collectes" style="width:100%; position:relative;"></div>
            </div>
        </div>

        <div class="card my-2">
            <div class="card-body">
                <h3 class="fs-4">Répartition par formulaires</h3>
                <div id="chart_formulaires" style="width:100%; position:relative;"></div>
            </div>
        </div>

        <div class="card my-2">
            <div class="card-body">
                <h3 class="fs-4">Répartition par questions</h3>
                <div id="chart_questions" style="width:100%; position:relative;"></div>
            </div>
        </div>
    </div>
</template>
<script>
import { GoogleCharts } from 'google-charts';
export default {

    props: {
        stats: Object
    },

    watch: {
        stats() {
            this.sami_global_piechart();
            this.chart_collectes();
            this.chart_formulaires();
            this.chart_questions();
        }
    },

    methods: {
        sami_global_piechart() {
            let div = document.getElementById('sami_piechart');

            // Création des données depuis les statistiques
            let datatable = [
                ['lettre', 'nombre']
            ];

            let stats = this.stats.type?.sami;

            console.log(stats);

            if (stats) {
                let lettres = ['S', 'A', 'M', 'I'];
    
                lettres.forEach(l => {
                    let qte = 0;
                    if (stats[l]) qte += parseInt(stats[l]);
                    if (stats[l.toLowerCase()]) qte += parseInt(stats[l.toLowerCase()]);
                    datatable.push([l, qte]);
                });
            }

            let data = GoogleCharts.api.visualization.arrayToDataTable(datatable);

            var options = {
                colors: ['#28a745', '#007bff', '#ffc107', '#dc3545']
            };

            let chart = new GoogleCharts.api.visualization.PieChart(div);

            chart.draw(data, options);
        },

        chart_collectes() {
            let div = document.getElementById('chart_collectes');
            let datatable = [
                [ "Collecte", "S", "A", "M", "I" ]
            ];

            let collectes = this.stats.collecte;

            if (collectes) {
                for (const key in collectes) {
                    let collecte = collectes[key];
                    let sami = collecte.sami;

                    if (sami) {
                        let lettres = ['S', 'A', 'M', 'I'];

                        let row = [collecte.intitule];
            
                        lettres.forEach(l => {
                            let qte = 0;
                            if (sami[l]) qte += parseInt(sami[l]);
                            if (sami[l.toLowerCase()]) qte += parseInt(sami[l.toLowerCase()]);
                            row.push(qte);
                        });

                        datatable.push(row);
                    }
                }
            }

            var data2 = GoogleCharts.api.visualization.arrayToDataTable(datatable);

            var options2 = {
                isStacked: 'percent',
                colors: ['#28a745', '#007bff', '#ffc107', '#dc3545'],
                legend: { position: 'top', maxLines: 4 },
            };
            let chart = new GoogleCharts.api.visualization.BarChart(div);
            chart.draw(data2, options2);
        },

        chart_formulaires() {
            let div = document.getElementById('chart_formulaires');
            let datatable = [
                [ "Formulaire", "S", "A", "M", "I" ]
            ];

            let formulaires = this.stats.formulaire;

            if (formulaires) {
                for (const key in formulaires) {
                    let formulaire = formulaires[key];
                    let sami = formulaire.sami;

                    if (sami) {
                        let lettres = ['S', 'A', 'M', 'I'];

                        let row = [formulaire.intitule];
            
                        lettres.forEach(l => {
                            let qte = 0;
                            if (sami[l]) qte += parseInt(sami[l]);
                            if (sami[l.toLowerCase()]) qte += parseInt(sami[l.toLowerCase()]);
                            row.push(qte);
                        });

                        datatable.push(row);
                    }
                }
            }

            var data3 = GoogleCharts.api.visualization.arrayToDataTable(datatable);

            var options3 = {
                isStacked: 'percent',
                colors: ['#28a745', '#007bff', '#ffc107', '#dc3545'],
                legend: { position: 'top', maxLines: 4 }
            };
            let chart = new GoogleCharts.api.visualization.BarChart(div);
            chart.draw(data3, options3);
        },

        chart_questions() {
            let div = document.getElementById('chart_questions');
            let datatable = [
                [ "Question", "S", "A", "M", "I" ]
            ];

            let questions = this.stats.question;

            if (questions) {
                for (const key in questions) {
                    let question = questions[key];
                    let sami = question.sami;

                    if (sami) {
                        let lettres = ['S', 'A', 'M', 'I'];

                        let row = [question.intitule];
            
                        lettres.forEach(l => {
                            let qte = 0;
                            if (sami[l]) qte += parseInt(sami[l]);
                            if (sami[l.toLowerCase()]) qte += parseInt(sami[l.toLowerCase()]);
                            row.push(qte);
                        });

                        datatable.push(row);
                    }
                }
            }

            var data4 = GoogleCharts.api.visualization.arrayToDataTable(datatable);

            var options4 = {
                isStacked: 'percent',
                colors: ['#28a745', '#007bff', '#ffc107', '#dc3545'],
                legend: { position: 'top', maxLines: 4 }
            };
            let chart = new GoogleCharts.api.visualization.BarChart(div);
            chart.draw(data4, options4);
        }
    },

    beforeUnmount() {
        window.removeEventListener("resize", this.sami_global_piechart);
        window.removeEventListener("resize", this.chart_collectes);
        window.removeEventListener("resize", this.chart_formulaires);
        window.removeEventListener("resize", this.chart_questions);
        
    },

    updated() {
        this.sami_global_piechart();
        this.chart_collectes();
        this.chart_formulaires();
        this.chart_questions();
    },

    mounted(){
        GoogleCharts.load(this.sami_global_piechart);
        GoogleCharts.load(this.chart_collectes);
        GoogleCharts.load(this.chart_formulaires);
        GoogleCharts.load(this.chart_questions);
        window.addEventListener("resize", this.sami_global_piechart);
        window.addEventListener("resize", this.chart_collectes);
        window.addEventListener("resize", this.chart_formulaires);
        window.addEventListener("resize", this.chart_questions);
    }
}
</script>