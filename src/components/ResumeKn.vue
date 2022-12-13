<template>
    <div class="card my-3" v-if="collecte">
        <div class="card-header">
            <h2 class="card-title">Bilan du contrôle, évaluation</h2>

            <div class="from-controle">
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
                            <td>90</td>
                            <td>3</td>
                            <td>0</td>
                            <td>1</td>
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
                <label for="rapport" class="fs-3">Votre rapport:</label>
                <textarea class="form-control text-muted w-100" placeholder="..." id="rapport" v-model="itemResponse.rapport"></textarea>
            </div>

            <div class="d-flex justify-content-end mt-3" @click="validationKn()">
                <button type="button" class="btn btn-success" >
                    Valider
                </button>
            </div>
        </div>
    </div>
</template>

<script>
import {mapActions, mapState} from 'vuex';

export default {
    data() {
        return {
            buttonsSami: ['s', 'a', 'm', 'i'],
            itemResponse: {
                result_type: 'sami',
                result: '',
                rapport: '',
                environnement: 'private'
            },
            state: []
        }
    },

    computed: {
        ...mapState(['collecte'])
    },

    methods: {
        ...mapActions(['refreshCollecte']),

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
            this.$app.apiPost('data/POST/collecte/'+this.collecte.id, this.itemResponse)
            .then((data) => {
                console.log('rapport adata', data);

                this.$router.push({name:'collecte'});
            }).catch(this.$app.catchError);
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
                console.log('resulte state', data);
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