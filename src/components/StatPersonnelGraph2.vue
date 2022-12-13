<template>
    <div>
        <!-- style="width: 900px; height: 300px;"" -->
            <div id="piechart" style="width:100%;"></div>
            <div id="chart_div4" style="width:100%;"></div>
        <div id="chart_div3" style="width:100%;"></div>
        <div id="chart_div" style="width:100%;"></div>
    </div>
</template>
<script>
import { GoogleCharts } from 'google-charts';
export default {

    data(){

        return {
            stat_sami: [
                [
                    "lettre",
                    "nb"
                ],
                [
                    "S",
                    240
                ],
                [
                    "A",
                    15
                ],
                [
                    "M",
                    10
                ],
                [
                    "I",
                    0
                ]
            ],
        
            stat_sami_collecte: [
                [
                    "Item",
                    "S",
                    "A",
                    "M",
                    "I"
                ],
                [
                    "2022-02-10 KN AGENT PRESTATAIRE LAM",
                    18,
                    2,
                    1,
                    0
                ],
                [
                    "2022-02-10 KN AGENT PRESTATAIRE LAM",
                    18,
                    2,
                    1,
                    0
                ],
                [
                    "2022-02-14 KN ANNONCEUR SENTINELLE",
                    35,
                    0,
                    0,
                    0
                ],
                [
                    "2022-02-14 KN ANNONCEUR SENTINELLE",
                    35,
                    0,
                    0,
                    0
                ],
                [
                    "2022-04-14 KN ANNONCEUR SENTINELLE",
                    28,
                    0,
                    0,
                    0
                ],
                [
                    "2022-05-05 KN AGENT DE SECURITE DU PERSONNEL EN EQUIPE",
                    42,
                    1,
                    7,
                    0
                ],
                [
                    "2022-08-31 KN ANNONCEUR SENTINELLE",
                    27,
                    3,
                    1,
                    0
                ],
                [
                    "2022-09-16 KN AGENT DE SECURITE DU PERSONNEL EN EQUIPE",
                    37,
                    7,
                    0,
                    0
                ]
            ],
            stat_sami_formulaire: [
                [
                    "Item",
                    "S",
                    "A",
                    "M",
                    "I"
                ],
                [
                    " KN AGENT PRESTATAIRE LAM",
                    36,
                    4,
                    2,
                    0
                ],
                [
                    " KN ANNONCEUR SENTINELLE",
                    125,
                    3,
                    1,
                    0
                ],
                [
                    " KN AGENT DE SECURITE DU PERSONNEL EN EQUIPE",
                    79,
                    8,
                    7,
                    0
                ]
            ],
        
            stat_sami_question: [
            [
                "Item",
                "S",
                "A",
                "M",
                "I"
            ],
            [
                " Connaissance de l'environnement (particularités locales)",
                2,
                0,
                0,
                0
            ],
            [
                " Connaissance des textes réglementaires (ISF, PPSPS)",
                2,
                0,
                0,
                0
            ],
            [
                " Application briefing",
                2,
                0,
                0,
                0
            ],
            [
                " Risques liés à la circulation",
                2,
                0,
                0,
                0
            ],
            [
                " Définition de la zone dangereuse",
                2,
                0,
                0,
                0
            ],
            [
                " Risques liés à la traction électrique",
                2,
                0,
                0,
                0
            ],
            [
                " Hauteur minimum et maximum de la caténaire ? Hauteur sur LGV ?",
                2,
                0,
                0,
                0
            ],
            [
                " Définition des zones électriques",
                2,
                0,
                0,
                0
            ],
            [
                " Signification des différents passants (gris, jaune, vert, bleu, violet)",
                2,
                0,
                0,
                0
            ],
            [
                " Comportement de l'agent",
                2,
                0,
                0,
                0
            ],
            [
                " Concentration de l'agent",
                2,
                0,
                0,
                0
            ],
            [
                " Vérification de(s) engin(s) (agrés, agréments, limiteurs)",
                2,
                0,
                0,
                0
            ],
            [
                " Conditions montée descente",
                2,
                0,
                0,
                0
            ],
            [
                " Immobilisation Gestion des aléas",
                0,
                2,
                0,
                0
            ],
            [
                " Mesures en cas de défaillance conducteur",
                2,
                0,
                0,
                0
            ],
            [
                " Conditions pour plusieurs LAM",
                2,
                0,
                0,
                0
            ],
            [
                " Stationnement du LAM (conditions à respecter)",
                0,
                0,
                2,
                0
            ],
            [
                " Hauteur du limiteur de la pelle",
                2,
                0,
                0,
                0
            ],
            [
                " Spécificités enraillement à un PN",
                2,
                0,
                0,
                0
            ],
            [
                " Connaissance des textes réglementaires (ISF, PPSPS)",
                0,
                2,
                0,
                0
            ],
            [
                " Utilisation de Pebble",
                2,
                0,
                0,
                0
            ],
            [
                " Connaissance des lieux (vitesses, sens de circulation, particularités …)",
                4,
                0,
                0,
                0
            ],
            [
                " Connaissance de la voie de travail",
                4,
                0,
                0,
                0
            ],
            [
                " Connaissance de l'emplacement de garage",
                4,
                0,
                0,
                0
            ],
            [
                " Connaissance du PRS sur le chantier et lé téléphone d'alarme le plus proche",
                2,
                0,
                0,
                0
            ],
            [
                " Connaissance des documents de prévention sur la tablette (PGC, PDP, CSF, ISF, NSF,  PPSPS,…)",
                2,
                0,
                0,
                0
            ],
            [
                " Possession, validitée de la carte d'habilitation et l'accès aux emprises",
                2,
                0,
                0,
                0
            ],
            [
                " Définition de la zone dangereuse + valeurs ",
                2,
                0,
                0,
                0
            ],
            [
                " Signification des différents passants (gris, jaune, vert, bleu, violet)",
                2,
                0,
                0,
                0
            ],
            [
                " Comportement de l'agent",
                4,
                0,
                0,
                0
            ],
            [
                " Concentration de l'agent",
                4,
                0,
                0,
                0
            ],
            [
                " Réactivité de l'agent",
                4,
                0,
                0,
                0
            ],
            [
                " Quels sont les 4 conditions légales à remplir pour être annonceur sentinelle ?",
                4,
                0,
                0,
                0
            ],
            [
                " Port des EPI et bon état pour la mission",
                2,
                0,
                0,
                0
            ],
            [
                " Quels sont les agrès d'un annonceur ?",
                4,
                0,
                0,
                0
            ],
            [
                " Validité des pétards",
                4,
                0,
                0,
                0
            ],
            [
                " Validité de la torche et durée de combustion",
                4,
                0,
                0,
                0
            ],
            [
                " Comment craquer une torche à flamme rouge ( en mode secours et le positionnement)",
                4,
                0,
                0,
                0
            ],
            [
                " Etat des différents agrès",
                4,
                0,
                0,
                0
            ],
            [
                " Etat du carquois",
                2,
                0,
                0,
                0
            ],
            [
                " Quels sont les agrès d'un annonceur de nuit ?",
                4,
                0,
                0,
                0
            ],
            [
                " Positionnement de l'annonceur",
                4,
                0,
                0,
                0
            ],
            [
                " Connaissance de la DCO ( Proposer différents cas)",
                3,
                1,
                0,
                0
            ],
            [
                " Point d'annonce (avec repère physique)",
                2,
                0,
                0,
                0
            ],
            [
                " Identification des voies",
                2,
                0,
                0,
                0
            ],
            [
                " Sens de circulation surveillé",
                2,
                0,
                0,
                0
            ],
            [
                " Possession de la CADA et signification",
                2,
                0,
                0,
                0
            ],
            [
                " Connaissance des emplacements de garage",
                4,
                0,
                0,
                0
            ],
            [
                " Utilisation de la trompe à grande puissance (pression, purge en fin de journée, …)",
                4,
                0,
                0,
                0
            ],
            [
                " Audibilité de l'annonce sur le chantier",
                2,
                0,
                0,
                0
            ],
            [
                " Connaissance des différentes voies à annoncer",
                4,
                0,
                0,
                0
            ],
            [
                " Connaissance de la distance moyenne entre 2 téléphones d'alarme",
                4,
                0,
                0,
                0
            ],
            [
                " Rôle RPAC",
                2,
                0,
                0,
                0
            ],
            [
                " Rôle ASP et ASP remplaçant",
                2,
                0,
                0,
                0
            ],
            [
                " Rôle annonceur",
                4,
                0,
                0,
                0
            ],
            [
                " Les différents emplacements de garage et définition d'un garage réduit",
                2,
                0,
                0,
                0
            ],
            [
                " Possession des EPI obligatoire",
                2,
                0,
                0,
                0
            ],
            [
                " Risques liés à la circulation",
                2,
                0,
                0,
                0
            ],
            [
                " Définition de la zone dangereuse",
                2,
                0,
                0,
                0
            ],
            [
                " Définition des zones électriques",
                2,
                0,
                0,
                0
            ],
            [
                " Citer les règles qui sauvent",
                2,
                0,
                0,
                0
            ],
            [
                " Port des EPI pour la mission ?",
                2,
                0,
                0,
                0
            ],
            [
                " Répercussion de l'alerte donnée par une sentinelle",
                2,
                0,
                0,
                0
            ],
            [
                " Quelles informations peut-on trouver sur un support caténaire ?",
                2,
                0,
                0,
                0
            ],
            [
                " Connaissance des lieux (vitesse, sens de circulation, particularités, …)",
                2,
                0,
                0,
                0
            ],
            [
                " Connaissance de la voie de travail",
                2,
                0,
                0,
                0
            ],
            [
                " Connaissance du téléphone d'alarme le plus proche du chantier",
                2,
                0,
                0,
                0
            ],
            [
                " Connaissance organisation du chantier  phasage",
                2,
                0,
                0,
                0
            ],
            [
                " Quelles sont les conditions pour cumuler le rôle d'ASP Annonceur",
                0,
                1,
                1,
                0
            ],
            [
                " Que doit faire un ASP lors d'une CO",
                2,
                0,
                0,
                0
            ],
            [
                " Quelles informations peut-on trouver sur un support caténaire ?",
                2,
                0,
                0,
                0
            ],
            [
                " Où trouve-t-on les pistes et itinéraires ?",
                2,
                0,
                0,
                0
            ],
            [
                " Respect des zones de voisinage des parties sous tension",
                2,
                0,
                0,
                0
            ],
            [
                " Traversée de matériaux",
                1,
                0,
                0,
                0
            ],
            [
                " Connaissance et respect du gabarit des dépôts provisoires (schèma)",
                2,
                0,
                0,
                0
            ],
            [
                " Sûreté du chantier",
                1,
                0,
                0,
                0
            ],
            [
                " Les différents emplacements de garage",
                2,
                0,
                0,
                0
            ],
            [
                " Définition d'un garage réduit",
                1,
                0,
                0,
                0
            ],
            [
                " Manutention de pièces lourdes et encombrantes",
                2,
                0,
                0,
                0
            ],
            [
                " Risques liés à la circulation",
                2,
                0,
                0,
                0
            ],
            [
                " Définition de la zone dangereuse et ses valeurs",
                1,
                1,
                0,
                0
            ],
            [
                " Risques liés à la traction électrique",
                2,
                0,
                0,
                0
            ],
            [
                " Hauteur minimum et maximum de la caténaire ? Hauteur sur LGV ?",
                2,
                0,
                0,
                0
            ],
            [
                " Définition des zones électriques",
                2,
                0,
                0,
                0
            ],
            [
                " Règles de repérage dans les emprises ferrovaires",
                2,
                0,
                0,
                0
            ],
            [
                " Signification des différents passants (gris, jaune, vert, bleu, violet)",
                2,
                0,
                0,
                0
            ],
            [
                " Comportement de l'agent",
                2,
                0,
                0,
                0
            ],
            [
                " Concentration de l'agent",
                2,
                0,
                0,
                0
            ],
            [
                " Réactivité de l'agent",
                2,
                0,
                0,
                0
            ],
            [
                " Citer les règles qui sauvent",
                1,
                1,
                0,
                0
            ],
            [
                " Identification du RPAC et ou agent sécurité",
                2,
                0,
                0,
                0
            ],
            [
                " Catégorie d'outillage utilisé pour la mission",
                2,
                0,
                0,
                0
            ],
            [
                " Exception d'utilisation de la 1ère et 2ème catégorie",
                0,
                1,
                1,
                0
            ],
            [
                " Port des EPI adaptés au travail entrepris",
                2,
                0,
                0,
                0
            ],
            [
                " Quels sont les agrès d'un ASP Agent seul ?",
                1,
                0,
                0,
                0
            ],
            [
                " Validité des pétards",
                2,
                0,
                0,
                0
            ],
            [
                " Validité de la torche et durée de combustion et connaissance de son fonctionnement",
                2,
                0,
                0,
                0
            ],
            [
                " Port des différents passants (gris, jaune, vert, bleu, mauve)",
                1,
                0,
                0,
                0
            ],
            [
                " Que doit posséder un ASP pour cumuler avec le rôle d'annonceur",
                0,
                0,
                1,
                0
            ],
            [
                " Détermination de la zone de travail",
                2,
                0,
                0,
                0
            ],
            [
                " Prise en compte de la catégorie d'outillage",
                2,
                0,
                0,
                0
            ],
            [
                " Détermination de l'emplacement de garage et des zones de garage réduit",
                2,
                0,
                0,
                0
            ],
            [
                " Comment détermine t'on une marge de sécurité",
                1,
                0,
                1,
                0
            ],
            [
                " Quelles sont les questions à se poser sur voie circulée?",
                0,
                1,
                1,
                0
            ],
            [
                " Quels sont les questions à se poser sur voie interceptée ou proche d'une ZD",
                1,
                0,
                1,
                0
            ],
            [
                " Vérification du chantier",
                2,
                0,
                0,
                0
            ],
            [
                " Rôle ASP et ASP remplaçant",
                1,
                0,
                0,
                0
            ],
            [
                " VU - VUT - IPCS - ITCS - voie banalisée - double voie - TCT",
                2,
                0,
                0,
                0
            ],
            [
                " Signification et principe de la CADA",
                2,
                0,
                0,
                0
            ],
            [
                " Connaissance de la distance moyenne entre 2 téléphones d'alarme",
                2,
                0,
                0,
                0
            ],
            [
                " Valeurs d'un quai bas, haut et mi haut",
                2,
                0,
                0,
                0
            ],
            [
                " Définition du RCT",
                1,
                0,
                0,
                0
            ],
            [
                " Ensemble des documents liés à la mission ayant la bonne version ",
                1,
                0,
                0,
                0
            ],
            [
                " Appréciation générale : (noter S, A, M ou I dans la case)",
                0,
                1,
                1,
                0
            ],
            [
                " Connaissance des gabarits de dépôt provisoire (schéma)",
                0,
                0,
                1,
                0
            ],
            [
                " VU - VUT - IPCS - ITCS - TCT - voie banalisée - double voie",
                0,
                1,
                0,
                0
            ],
            [
                " Appréciation générale : (noter S, A, M ou I dans la case)",
                0,
                1,
                0,
                0
            ],
            [
                " Possession, validitée de la carte d'habililitation et accès aux emprises",
                1,
                0,
                0,
                0
            ],
            [
                " Briefing avant le départ sur le chantier avec réalisateur",
                0,
                1,
                0,
                0
            ],
            [
                " Connaissance textes de prescription",
                0,
                1,
                0,
                0
            ]
            ]
        }
    },
    methods: {
        drawChart() {
            let div = document.getElementById('piechart');
            let datatable = this.stat_sami;

            let data = GoogleCharts.api.visualization.arrayToDataTable(datatable);

            var options = {
            title: 'Répartition des réponses sur l\'ensemble des KN',
            // width: '100%',
            is3D: true,
            pieSliceText: 'label',
            colors: ['#198754', '#0d6efd', '#ffc107', '#dc3545']
            };

            let chart = new GoogleCharts.api.visualization.PieChart(div);

            chart.draw(data, options);
        },

        drawStacked() {
            let div = document.getElementById('chart_div');
            let datatable = this.stat_sami_question;

            var data2 = GoogleCharts.api.visualization.arrayToDataTable(datatable);

            var options2 = {
            title: 'répartitions des réponses par questions',
            // width: 400,

            chartArea: {width: '40%'},
            isStacked: 'percent',
            colors: ['#198754', '#0d6efd', '#ffc107', '#dc3545'],
            legend: { position: 'top', maxLines: 4 },
            height: 2000
            };
            let chart = new GoogleCharts.api.visualization.BarChart(div);
            chart.draw(data2, options2);
        },

        drawStacked3() {
            let div = document.getElementById('chart_div3');
            let datatable = this.stat_sami_formulaire;

            var data3 = GoogleCharts.api.visualization.arrayToDataTable(datatable);

            var options3 = {
                title: 'répartition des réponses par habilitation',
                chartArea: {width: '40%'},
                isStacked: 'percent',
                colors: ['#198754', '#0d6efd', '#ffc107', '#dc3545'],
                legend: { position: 'top', maxLines: 4 }
            };
            let chart = new GoogleCharts.api.visualization.BarChart(div);
            chart.draw(data3, options3);
            },
            drawStacked4() {
            let div = document.getElementById('chart_div4');
            let datatable = this.stat_sami_collecte;

            var data4 = GoogleCharts.api.visualization.arrayToDataTable(datatable);

            var options4 = {
                title: 'répartition des réponses  par KN réalisés',
                chartArea: {width: '50%'},
                isStacked: 'percent',
                colors: ['#198754', '#0d6efd', '#ffc107', '#dc3545'],
                legend: { position: 'top', maxLines: 4 }
            };
            let chart = new GoogleCharts.api.visualization.BarChart(div);
            chart.draw(data4, options4);
            }
    },

    beforeUnmount() {
        window.removeEventListener("resize", this.drawChart);
        window.removeEventListener("resize", this.drawStacked);
        window.removeEventListener("resize", this.drawStacked3);
        window.removeEventListener("resize", this.drawStacked4);
        
    },

    mounted(){
        GoogleCharts.load(this.drawChart);
        GoogleCharts.load(this.drawStacked);
        GoogleCharts.load(this.drawStacked3);
        GoogleCharts.load(this.drawStacked4);
        window.addEventListener("resize", this.drawChart);
        window.addEventListener("resize", this.drawStacked);
        window.addEventListener("resize", this.drawStacked3);
        window.addEventListener("resize", this.drawStacked4);




    }


}
</script>