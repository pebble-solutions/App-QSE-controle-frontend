<template>
    <div v-if="collecte">
        <div class="card my-2">
            <div class="card-header">
                <div class="d-flex flex-column">
                    <h4 class="fs-5 card-title">
                        <span class="fw-lighter">{{collecte.formulaire.groupe}} du {{ collecte.date }}</span>
                        <div class="d-flex align-items-baseline justify-content-start mt-2">
                            <div v-if="itemResponse.result">
                                <span class="me-2">Note générale:</span>
                                <span class="badge" :class="classNameFromSAMI(itemResponse.result)">{{itemResponse.result}}</span>
                            </div>
                            <div v-else>
                                <span class="me-1">Note générale:</span>
                                <span class="badge" :class="classNameFromSAMI()">Non évaluée</span>
                            </div>
                        </div>
                    </h4>
                    <div class="d-flex justify-content-end align-items-center">
                        <span class="me-2 text-warning">modification:</span>
                        <sami-button v-if="itemResponse.result" v-model="itemResponse.result">{{itemResponse.result}}</sami-button>
                        <sami-button v-else v-model="itemResponse.result"></sami-button>
                    </div>
                </div>
            </div>

            <div class="card-body" v-if="listActifs">
                <div class="row">
                    <div class="mb-2 col">
                        <strong class="d-block">Contrôleur:</strong>
                        <span class="ms-2 fw-lighter">
                            {{controleur}}
                        </span>
                    </div>

                    <div class="mb-2 col border-start border-dark">
                        <strong class="d-block">Opérateur:</strong>
                        <span class="ms-2 fw-lighter">
                            {{operateur}}
                        </span>
                    </div>
                </div>
                <div class="mb-2">
                    <!-- <label class="form-label fw-bold">Contrôleur</label>
                    <select class="form-select" v-model="itemResponse.enqueteur__structure__personnel_id">
                        <option v-for="personnel in listActifs" :key="'personnel-'+personnel.id" :value="personnel.id">
                            {{personnel.cache_nom}} 
                        </option>
                    </select> -->
            
                </div>

                <div class="mb-2">
                
                    <!-- <select class="form-select" v-model="itemResponse.cible__structure__personnel_id">
                        <option v-for="personnel in listActifs" :key="'personnel-'+personnel.id" :value="personnel.id">
                            {{personnel.cache_nom}}
                        </option>
                    </select> -->
                </div>

                <div class="mb-2">
                    <label class="form-label fw-bold">Commentaire général:</label>
                    <textarea class="form-control d-block" :value="itemResponse.commentaire" placeholder="Commentaire..."></textarea>
                </div>

                <div class="mb-2">
                    <label class="form-label fw-bold">Rapport final:</label>
                    <textarea class="form-control d-block" v-model="itemResponse.rapport"></textarea>
                </div>
            </div>
            <div v-for="rep in collecte.reponses" :key="rep.id">
                {{ rep.question}} {{ rep.data }}{{ rep.data_var }} {{rep.ligne}}

            </div>
        </div>

        <div class="card my-2">
            <div class="card-header d-flex align-items-baseline justify-content-between">
                <h4 class="fs-5 card-title">Nombre d'items évalués</h4>
                <div class="badge fs-6 text-uppercase ms-1" :class="classNameFromSAMI(collecte.result_var)" >
                    {{collecte.nb_reponse}}/{{collecte.nb_question}}
                </div>
            </div>

            <div class="accordion accordion-flush" id="formulaireResume">
                <div v-for="bloc in blocs" :key="'bloc-'+bloc.id" class="accordion-item">
                    <h2 class="accordion-header" :id="'heading-'+bloc.id">
                        <button class="accordion-button" type="button" data-bs-toggle="collapse" :data-bs-target="'#collapse-'+bloc.id" aria-expanded="true" :aria-controls="'collapse-'+bloc.id">
                            {{bloc.bloc}} {{ bloc.id }}
                        </button>
                    </h2>
                    <div :id="'collapse-'+bloc.id" class="accordion-collapse collapse show" :aria-labelledby="'heading-'+bloc.id">
                        <div class="accordion-body">
                            <div class="list-group list-group-flush">
                                <template v-for="reponse in itemResponse.reponses" :key="'reponse-'+reponse.question">  
                                    <div class="list-group-item" v-if="bloc.id == reponse.bloc">

                                        <div class="d-flex align-items-center justify-content-between" v-if="reponse.reponse">
                                            <div class="fst-italic">{{quesionLigne(reponse.question)}}</div>
                                            <div class="badge" :class="classNameFromSAMI(reponse.reponse)" >{{reponse.reponse}}</div>
                                        </div>
                                        <div class="d-flex align-items-center justify-content-between" v-else>
                                            <div class="fst-italic">{{quesionLigne(reponse.question)}}</div>
                                            <div class="badge" :class="classNameFromSAMI(reponse.reponse)">Non évaluée</div>
                                        </div>
                                        <div class="d-flex align-items-center justify-content-start">
                                            <span class="me-2 text-warning">modification:</span>
                                            <sami-button v-model="reponse.reponse">{{reponse.reponse}}</sami-button>
                                        </div>
                                        <!-- <sami-button v-model="reponse.reponse"></sami-button>
                                        <div class="fst-italic">{{quesionLigne(reponse.question)}}</div>
                                        v-if="reponse.reponse  {{reponse.commentaire}} -->
                                        <textarea class="form-control d-block mt-2" v-model="reponse.commentaire" placeholder=""></textarea>
                                    </div>
                                </template>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div class="text-center">
            <button tupe="button" class="btn btn-primary" @click="updateCollecte()" :disabled="pending.buttonSave">
                <span class="spinner-border spinner-border-sm" role="status" aria-hidden="true" v-if="pending.buttonSave"></span>
                Enregistrer les modifications
            </button>
            <div>
                items modifiés {{ nbReponse }}
            </div>
        </div>
    </div>
</template>

<script lang="js">

import SamiButton from './SamiButton.vue';
import { mapState } from 'vuex';

export default {
    props: {
        collecte: Object,
    },

    data() {
        return {
            pending: {
                buttonSave: false,
            },
            itemResponse: {
                result_type: 'sami',
                result: '',
                rapport: '',
                environnement: 'private',
                enqueteur__structure__personnel_id: null,
                cible__structure__personnel_id: null,
                commentaire: '',
                reponses: []
            },

            nbreponses: 0
        }
    },

    computed: {
        ...mapState(['listActifs']),

        /**
         * Racourcis vers la liste des blocs
         * @return {array}
         */
        blocs() {
            return this.collecte?.formulaire.blocs;
        },

        /**
         * Racourcis vers la liste des questions
         * @return {array}
         */
        questions() {
            return this.collecte?.formulaire.questions;
        },

        /**
         * Racourcis vers la liste des réponses
         * @return {array}
         */
        reponses() {
            return this.collecte?.reponses;
        },

        /**
         * Retourne le nombre de question repondu
         * 
         * @return {number}
         */
        nbReponse() {
            let count = 0;
            console.log(this.itemResponse.reponses, 'itemResponse.reponses');
            console.log(this.collecte.nb_reponse,'collecte');
            console.log(this.collecte, 'toatal')

            this.itemResponse.reponses?.forEach(rep => {
                if (rep.reponse) {
                    count++;
                }
            });

            return count;
        },

        /**
         * Récupere le nom du controleur a partir d'un id
         * 
         * @return {string}
         */
        controleur() {
            let controleurName = this.listActifs.find(personnel => personnel.id == this.collecte.enqueteur__structure__personnel_id);

            if (controleurName) {
                return controleurName.cache_nom;
            } else {
                return 'Contrôleur non renseigné'
            }
        },

        /**
         * Récupere le nom de l'opérateur a partir d'un id
         * 
         * @return {string}
         */
        operateur() {
            let operateurName = this.listActifs.find(personnel => personnel.id == this.collecte.cible__structure__personnel_id);

            if (operateurName) {
                return operateurName.cache_nom;
            } else {
                return 'opérateur non renseigné'
            }
        },
    },

    methods: {

        /**
         * Si premier index de l'object return true sinon false
         * 
         * @param {Number} index Index de l'object box
         * 
         * @return {boolean}
         */
        getExpanded(index) {
            if (index == 0) {
                return true;
            }

            return false
        },

        updateSami(payload, change) {
            console.log(payload);
            console.log(change)
        },

        /**
         * recupere le text de la question
         * 
         * @return {string|null}
         */
        quesionLigne(questionId) {
            let question = this.collecte?.formulaire.questions.find(question => question.id == questionId);

            return question ? question.ligne : null;
        },

        /**
         * Retourne la réponse à une question
         * 
         * @param {object} question La question à analyser
         * 
         * @return {string|null}
         */
        getQuestionReponse(question) {
            console.log(this.reponses, 'reponses.question');
            console.log(question.id, 'id quetion');
            console.log(question.question, 'question');
            
            let reponse = this.reponses.find(e => e.question == question.id);
            if(reponse){
                console.log(reponse.data, 'data');
                console.log(reponse.data_var,'var');
                console.log (reponse.question, 'reponse question')
            }
            return reponse ? reponse.data : null;
        },

        /**
         * Retourne une classe CSS pour S A M I en fonction des réponses à une question
         * 
         * @param {object} question La question à analyser
         * 
         * @return {string}
         */
        getClassNameFromQuestion(question) {
            let reponse = this.getQuestionReponse(question);
            return this.classNameFromSAMI(reponse);
        },

        /**
         * Retourne le commentaire de la question fournie
         * 
         * @param {Object} question La question à analyser
         * 
         * @return {string}
         */
        getCommentFromQestion(question) {
            let reponse = this.reponses.find(resp => resp.question == question.id);
            return reponse ? reponse.commentaire : null;
        },

        /**
         * Retourne une classe CSS par rapport à une réponse S A M I
         * 
         * @param {string} reponse S A M I
         * 
         * @return {string}
         */
        classNameFromSAMI(reponse) {
            if (typeof reponse === 'string') {
                if (reponse.toLowerCase() == 's') return 'text-bg-success';
                else if (reponse.toLowerCase() == 'a') return 'text-bg-primary';
                else if (reponse.toLowerCase() == 'm') return 'text-bg-warning';
                else if (reponse.toLowerCase() == 'i') return 'text-bg-danger';
            }

            return 'text-bg-secondary';
        },

        /**
         * Initialise la data itemResponse en fonction de la collecte recu
         */
        initItemReponse() {
            this.itemResponse.result = this.collecte.reponses.data_var; //this.collecte.result_var
            this.itemResponse.enqueteur__structure__personnel_id = this.collecte.enqueteur__structure__personnel_id;
            this.itemResponse.cible__structure__personnel_id = this.collecte.cible__structure__personnel_id;
            this.itemResponse.commentaire = this.collecte.commentaire;
            this.itemResponse.rapport = this.collecte.rapport

            this.initResponsesObject();
        },

        /**
         * Recupere toute les reponses au question de la collecte
         */
        initResponsesObject() {
            this.itemResponse.reponses = [];

            this.collecte.formulaire.questions.forEach(question => {
                
                let reponse = {
                    question: question.id,
                    reponse: this.getQuestionReponse(question),
                    commentaire: this.getCommentFromQestion(question),
                    bloc: question.information__bloc_id
                }


                this.itemResponse.reponses.push(reponse);
            });
        },

        updateCollecte() {
            this.pending.buttonSave = true;

            this.$app.apiPost('data/POST/collecte/'+this.collecte.id, this.itemResponse)
            .then((data) => {
                console.log('retour edit', data);
            }).catch(this.$app.catchError).finally(() => this.pending.buttonSave = false);
        }
    },

    components: {SamiButton },

    mounted() {
        this.initItemReponse();
    }
}
</script>