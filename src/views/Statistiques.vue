<template>
    <div class="container">
        <div class="row">
            <h1>Statistiques générales</h1>
            <div class="col-3">
                <div class="card my-2">
                    <div class="card-body">
                        <h3 class="card-title fs-4">Date de début</h3>
                        <input type="date" v-model="startDate" class="form-control">
                    </div>
                </div>
            </div>
            <div class="col-3">
                <div class="card my-2">
                    <div class="card-body">
                        <h3 class="card-title fs-4">Date de fin</h3>
                        <input type="date" v-model="endDate" class="form-control">
                    </div>
                </div>
            </div>
            <div class="col-3">
                <div class="card my-2">
                    <div class="card-body">
                        <h3 class="card-title fs-4">Nombre de jours</h3>
                        <input type="number" v-model="daysDiff" class="form-control">
                    </div>
                </div>
            </div>
            <div class="col-3">
                <div class="card my-2">
                    <div class="card-body">
                        <h3 class="card-title fs-4">Nombre de mois</h3>
                        <input type="number" v-model="monthsDiff" class="form-control">

                    </div>
                </div>
            </div>
        </div>
        <div class="row">
            <div class="col-9">
                <div class="card my-2 overflow-auto">
                    <div class="card-body">
                        <h3 class="card-title fs-4">Agenda</h3>
                        <AgendaChart :jsonData="data"></AgendaChart>
                    </div>
                </div>
            </div>
            <div class="col-3">
                <div class="card my-2">
                    <div class="card-body">
                        <h3 class="card-title fs-4">Répartition des réponses</h3>
                        <GlobalPieChart :jsonData="pieChartData"></GlobalPieChart>
                    </div>
                </div>
            </div>
        </div>
        <div class="row">
            <div class="col-12">
                <div class="card my-2">
                    <div class="card-body">
                        <table class="table">
                            <thead>
                                <tr>
                                    <th>KN</th>
                                    <th>S</th>
                                    <th>A</th>
                                    <th>M</th>
                                    <th>I</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>79</td>
                                    <td>33</td>
                                    <td>12</td>
                                    <td>10</td>
                                    <td>8</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
        <StatOperateur :currentHabilitations="currentHabilitations" :totalHabilitations="totalHabilitations">
        </StatOperateur>
        <StatHabilitation :currentHabilitations="currentHabilitations" :totalHabilitations="totalHabilitations">
        </StatHabilitation>
        <StatProjet :currentHabilitations="currentHabilitations" :totalHabilitations="totalHabilitations"></StatProjet>
        <!-- <StatControleur :currentHabilitations="currentHabilitations" :totalHabilitations="totalHabilitations">
        </StatControleur> -->
    </div>
</template>

<script>
import AgendaChart from '../components/googleCharts/AgendaChart.vue'
import GlobalPieChart from '../components/googleCharts/GlobalPieChart.vue'
import StatOperateur from '../components/googleCharts/StatOperateur.vue'
import StatHabilitation from '../components/googleCharts/StatHabilitation.vue'
import StatProjet from '../components/googleCharts/StatProjet.vue'
// import StatControleur from '../components/googleCharts/StatControleur.vue'

export default {
    data() {
        return {
            data: {
                "status": "OK",
                "datetime": "2023-06-15 16:02:36",
                "data": [
                    {
                        "id": 852,
                        "dc": "2023-03-10 15:55:36",
                        "dm": "2023-03-10 16:30:00",
                        "commentaire": "Premier essai du nouveau formulaire de veille système.",
                        "ordre": 0,
                        "keygen": "e44he8zey9rb",
                        "id_edi": null,
                        "structure": 3,
                        "sess_login_id": 235,
                        "corbeille": "NON",
                        "information__groupe_id": 63,
                        "tlc": null,
                        "tli": null,
                        "team_id": null,
                        "grant_login": null,
                        "grant_team": null,
                        "grant_public": null,
                        "date": "2022-12-10 00:00:00",
                        "enqueteur__login_id": null,
                        "enqueteur__structure__personnel_id": 508,
                        "rapport": "Il est important de poursuivre la mise à jour du process logistique avec un inventaire complet du matériel par opérateur.\r\nNous nous sommes améliorés dans la traçabilité de nos données grâce à la création des tableaux de bords.",
                        "document_id": null,
                        "cible__login_id": null,
                        "cible__structure__personnel_id": 0,
                        "done": "OUI",
                        "nb_question": 16,
                        "nb_reponse": 16,
                        "projet_id": null,
                        "ticket_id": null,
                        "result_integer": null,
                        "result_float": null,
                        "result_var": "A",
                        "result_enum": null,
                        "result_datetime": null,
                        "result_text": null,
                        "actions": "Créer un formulaire Pebble afin de réaliser un suivi plus approfondie des opérateurs sous tutorat.\r\n",
                        "date_done": "2023-03-10 16:30:00",
                        "previous_id": null,
                        "following_id": null,
                        "date_start": "2023-03-10 16:30:00",
                        "unlocked": null,
                        "projet_label": null,
                        "enqueteur_nom": "COUFFIN Virginie",
                        "cible_nom": null,
                        "groupe_lock_timeout": null,
                        "following_result": null,
                        "previous_result": null,
                        "formulaire": 63,
                        "cible_login": null,
                        "cible_personnel": 0,
                        "enqueteur_login": null,
                        "enqueteur_personnel": 508,
                        "locked": true
                    },
                    {
                        "id": 844,
                        "dc": "2023-03-10 09:39:34",
                        "dm": "2023-03-10 10:26:20",
                        "commentaire": "Premier essai du nouveau formulaire de veille système.",
                        "ordre": 0,
                        "keygen": "wnz9kxkbgb4n",
                        "id_edi": null,
                        "structure": 3,
                        "sess_login_id": 235,
                        "corbeille": "NON",
                        "information__groupe_id": 63,
                        "tlc": null,
                        "tli": null,
                        "team_id": null,
                        "grant_login": null,
                        "grant_team": null,
                        "grant_public": null,
                        "date": "2022-12-10 00:00:00",
                        "enqueteur__login_id": null,
                        "enqueteur__structure__personnel_id": 508,
                        "rapport": "Les questions JFC et suspension ne sont pas évaluées car actuellement en cours.\r\nNous devons nous améliorer sur le suivi du tutorat des opérateurs en doublons.",
                        "document_id": null,
                        "cible__login_id": null,
                        "cible__structure__personnel_id": 0,
                        "done": "OUI",
                        "nb_question": 16,
                        "nb_reponse": 16,
                        "projet_id": null,
                        "ticket_id": null,
                        "result_integer": null,
                        "result_float": null,
                        "result_var": "A",
                        "result_enum": null,
                        "result_datetime": null,
                        "result_text": null,
                        "actions": "Créer un formulaire via Pebble de fin de tutorat pour avoir un retour du tuteur sur l'opérateur et évaluer l'efficacité de sa période de doublon.",
                        "date_done": "2023-03-10 10:26:20",
                        "previous_id": null,
                        "following_id": null,
                        "date_start": "2023-03-10 10:26:20",
                        "unlocked": null,
                        "projet_label": null,
                        "enqueteur_nom": "COUFFIN Virginie",
                        "cible_nom": null,
                        "groupe_lock_timeout": null,
                        "following_result": null,
                        "previous_result": null,
                        "formulaire": 63,
                        "cible_login": null,
                        "cible_personnel": 0,
                        "enqueteur_login": null,
                        "enqueteur_personnel": 508,
                        "locked": true
                    }
                ]
            },
            startDate: '',
            endDate: '',
            daysDiff: 0,
            monthsDiff: 0,
            pieChartData: {
                "labels": {
                    1: "Answer",
                    2: "Amount"
                },
                "S": 33,
                "A": 12,
                "M": 10,
                "I": 8
            },
            currentHabilitations: 3,
            totalHabilitations: 12
        }
    },
    components: { AgendaChart, GlobalPieChart, StatOperateur, StatHabilitation, StatProjet  }, //StatControleur
    methods: {
        computeTimeDiff() {
            const startDate = new Date(this.startDate);
            const endDate = new Date(this.endDate);

            if (!isNaN(startDate.getTime()) && !isNaN(endDate.getTime())) {
                const timeDiff = endDate.getTime() - startDate.getTime();
                this.daysDiff = timeDiff / (1000 * 3600 * 24);
                this.monthsDiff = timeDiff / (1000 * 3600 * 24 * 30);
                return true;
            } else {
                return false;
            }
        },
        updateEndDateFromDays() {
            const startDate = new Date(this.startDate);
            const endDate = new Date(startDate.getTime() + this.daysDiff * 24 * 60 * 60 * 1000);
            const year = endDate.getFullYear();
            const month = String(endDate.getMonth() + 1).padStart(2, '0');
            const day = String(endDate.getDate()).padStart(2, '0');
            this.endDate = `${year}-${month}-${day}`;
        },
        updateEndDateFromMonths() {
            const startDate = new Date(this.startDate);
            const newEndDate = new Date(startDate.getTime());

            // On ajoute le nombre de mois sélectionné à la date de début
            newEndDate.setMonth(startDate.getMonth() + parseInt(this.monthsDiff));

            // Si la nouvelle date de fin se trouve être après la date de début, on la met à jour
            if (!isNaN(newEndDate.getTime()) && newEndDate > startDate) {
                const year = newEndDate.getFullYear();
                const month = String(newEndDate.getMonth() + 1).padStart(2, '0');
                const day = String(newEndDate.getDate()).padStart(2, '0');
                this.endDate = `${year}-${month}-${day}`;
            } else {
                // Si la nouvelle date de fin est avant la date de début, on réinitialise le nombre de mois
                this.monthsDiff = 0;
            }
        }
    },
    watch: {
        startDate() {
            this.computeTimeDiff();
        },
        endDate() {
            this.computeTimeDiff();
        },
        daysDiff() {
            this.updateEndDateFromDays();
        },
        monthsDiff() {
            this.updateEndDateFromMonths();
        }
    }
}
</script>