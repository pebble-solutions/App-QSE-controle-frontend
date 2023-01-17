<template>
    <div class="card my-3" v-if="collecte">
        <div class="card-header">
            <div class="d-flex">
                <h2 class="card-title">Bilan du contrôle</h2>

                <div class="ms-auto">
                    <bloc-navigation></bloc-navigation>
                </div>
            </div>

            <div class="from-controle" v-if="stats">
                <table class="table table-bordered bg-light">
                    <thead>
                        <tr class="text-center text-light">
                            <th scope="col" class="text-dark">Items évalués</th>
                            <th scope="col" class="bg-success">S</th>
                            <th scope="col" class="bg-primary">A</th>
                            <th scope="col" class="bg-warning">M</th>
                            <th scope="col" class="bg-danger">I</th>
                        </tr>
                    </thead>

                    <tbody>
                        <tr class="text-center">
                            <td scope="row">Total: {{this.collecte.nb_reponse}}/{{this.collecte.nb_question}}</td>
                            <td>{{stats[this.collecte.information__groupe_id]?.type.sami.s}}</td>
                            <td>{{stats[this.collecte.information__groupe_id]?.type.sami.a}}</td>
                            <td>{{stats[this.collecte.information__groupe_id]?.type.sami.m}}</td>
                            <td>{{stats[this.collecte.information__groupe_id]?.type.sami.i}}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>

        <div class="card-body">
            <h3 class="">Votre évaluation générale pour ce contrôle</h3>

            <div class="row mb-3">
                <div v-for="button in buttonsSami" :key="'Button-'+button" class="col d-grid">
                    <button 
                        @click="recordSami(button)" 
                        type="button" class="btn" 
                        :class="{
                            'btn-outline-danger': 'i' == button && 'i' != itemResponse.result,
                            'btn-danger': 'i' == button && 'i' == itemResponse.result,
                            'btn-outline-warning': 'm' == button && 'm' != itemResponse.result,
                            'btn-warning': 'm' == button && 'm' == itemResponse.result,
                            'btn-outline-primary': 'a' == button && 'a' != itemResponse.result,
                            'btn-primary': 'a' == button && 'a' == itemResponse.result,
                            'btn-outline-success': 's' == button && 's' != itemResponse.result,
                            'btn-success': 's' == button && 's' == itemResponse.result
                        }"
                    >
                        {{button.toUpperCase()}}
                    </button>
                </div>
            </div>

            <div>
                <label for="collecte_rapport" class="fs-5 form-label">Vos remarques complémentaires:</label>
                <textarea class="form-control" id="collecte_rapport" v-model="itemResponse.rapport"></textarea>
            </div>

            <div class="mt-3">
                <label for="collecte_action" class="fs-5 form-label ">Actions correctives proposées:</label>
                <textarea class="form-control" id="collecte_action" v-model="itemResponse.actions"></textarea>
            </div>

            <div class="d-flex  mt-3" @click="validationKn()">
                <button type="button" class="d-block w-100 btn btn-lg btn-success" :disabled="pending.validation">
                    <span class="spinner-border spinner-border-sm" role="status" aria-hidden="true" v-if="pending.validation"></span>
                    <i v-else class="bi bi-clipboard-check"></i>
                    Valider
                </button>
            </div>
        </div>
    </div>

    <div v-else>
        <spinner></spinner>
    </div>
</template>

<script>

import {mapActions, mapState} from 'vuex';
import BlocNavigation from './BlocNavigation.vue';
import Spinner from './pebble-ui/Spinner.vue';

export default {
    components: { BlocNavigation, Spinner },

    data() {
        return {
            buttonsSami: ['s', 'a', 'm', 'i'],
            itemResponse: {
                result_type: 'sami',
                result: '',
                rapport: '',
                environnement: 'private',
                done: 'OUI',
                actions: ''
            },
            stats: null,
            pending: {
                validation: false
            }
        }
    },

    computed: {
        ...mapState(['collecte'])
    },

    methods: {
        ...mapActions(['refreshCollectes']),
        
        /**
         * enregistre le sami de l'itemReponse
         * @param {string} options s,a,m,i
         */
        recordSami(sami) {
            this.itemResponse.result = sami;
        }, 

        /**
         * Envoie les données a l'api pour valider le KN
        */
        validationKn() {
            this.pending.validation = true;

            if (confirm('Une fois le contrôle validé, vous ne pourrez plus le modifier. Confirmez-vous la validation?')) {
                this.$app.apiPost('data/POST/collecte/'+this.collecte.id, this.itemResponse)
                .then((data) => {
                    this.refreshCollectes([data]);
                    this.$router.push({name:'collecteKN', params:{id:this.collecte.id}});
                }).catch(this.$app.catchError).finally(() => this.pending.validation = false);
            } else {
                this.pending.validation = false;
            }
        },

        /**
         * Récupère les states de la collecte
         */
        getCollecteState() {
            this.$app.apiGet('data/GET/stats', {
                environnement: 'private',
                collecte: this.collecte.id,
                type: 'formulaire'
            }).then((data) => {
                this.stats = data.stats;
            }).catch(this.$app.catchError);
        }
    },

    mounted() {
        if (this.collecte) {
            this.getCollecteState();
            this.itemResponse.rapport = this.collecte.rapport;
            this.itemResponse.result = this.collecte.result_var;
        }

    }
}
</script>