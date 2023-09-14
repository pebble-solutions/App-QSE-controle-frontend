<template>
    <div v-if="collecte">
        <div class="card my-2">
            <div class="card-header">
                <div class="d-flex flex-column">
                    <h4 class="fs-5 card-title">
                        <span class="fw-lighter">{{collecte.formulaire.groupe}} du {{ changeFormatDateLit(collecte.date) }}</span>
                        <div class="d-flex align-items-baseline justify-content-start mt-2">
                            <div v-if="itemResponse.result" class="d-flex align-items-center text-uppercase">
                                <span class="me-2">Note générale:</span>
                                <span class="badge fs-5 text-uppercase" :class="classNameFromSAMI(itemResponse.result)">{{itemResponse.result}}</span>
                            </div>
                            <div v-else class="d-flex align-items-center text-uppercase">
                                <span class="me-1">Note générale:</span>
                                <span class="badge fs-5 text-uppercase" :class="classNameFromSAMI()">Non renseignée</span>
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
                    <div class="m-2 col border-start border-dark">
                        <strong class="d-block">Contrôleur:</strong>
                        <span class="ms-2 fw-lighter">
                            {{controleur}}
                        </span>
                    </div>

                    <div class="m-2 col border-start border-dark">
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
                    <textarea class="form-control d-block" :value="itemResponse.commentaire" placeholder="Vos remarques complémentaires à propos de ce contrôle..."></textarea>
                </div>

                <div class="mb-2">
                    <label class="form-label fw-bold">Rapport final:</label>
                    <textarea class="form-control d-block" v-model="itemResponse.rapport" placeholder="Tous les éléments justifiant l'évaluation générale de ce contrôle..."></textarea>
                </div>
            </div>
            <!-- <div v-for="rep in collecte.reponses" :key="rep.id">
                {{ rep.question}} {{ rep.data }}{{ rep.data_var }} {{rep.ligne}}

            </div> -->
        </div>

        <div class="card my-2">
            <div class="card-header">
                <div class="d-flex align-items-baseline justify-content-between mb-2">
                    <h4 class="fs-5 card-title">Nombre d'items évalués </h4>
                    <div class="badge fs-5 text-uppercase ms-1" :class="classNameFromSAMI(collecte.result_var)" >
                        {{collecte.nb_reponse}}/{{collecte.nb_question}}
                    </div>
                </div>
                <!-- pour ajouter un bouton de réinitialisation sans quitter la modale
                <div v-if="changeItem" class="d-flex align-items-baseline justify-content-end">
                    <div class="me-2"><span class="badge bg-warning me-1">{{ nbReponse }}</span><span class="fs-7">items renseignés après modifications</span></div>
                        <button tupe="button" class="btn btn-outline-secondary me-1 fs-7" @click.prevent="cancelEdit()" :disabled="pending.buttonCancel">
                            <span class="spinner-border spinner-border-sm" role="status" aria-hidden="true" v-if="pending.buttonCancel"></span>
                            réinitialiser
                        </button>
                </div> -->
            </div>

            <div class="accordion accordion-flush" id="formulaireResume">
                <div v-for="bloc in blocs" :key="'bloc-'+bloc.id" class="accordion-item">
                    <h2 class="accordion-header" :id="'heading-'+bloc.id">
                        <button class="accordion-button" type="button" data-bs-toggle="collapse" :data-bs-target="'#collapse-'+bloc.id" aria-expanded="true" :aria-controls="'collapse-'+bloc.id">
                            {{bloc.bloc}} 
                        </button>
                    </h2>
                    <div :id="'collapse-'+bloc.id" class="accordion-collapse collapse show" :aria-labelledby="'heading-'+bloc.id">
                        <div class="accordion-body">
                            <div class="list-group list-group-flush">
                                <template v-for="reponse in itemResponse.reponses" :key="'reponse-'+reponse.question">  
                                    <div class="list-group-item" v-if="bloc.id == reponse.bloc">

                                        <div class="d-flex align-items-center justify-content-between" v-if="reponse.reponse">
                                            <div class="fst-italic">{{quesionLigne(reponse.question)}}</div>
                                            <div class="badge text-uppercase fs-6" :class="classNameFromSAMI(reponse.reponse)" >{{reponse.reponse}}</div>
                                        </div>
                                        <div class="d-flex align-items-center justify-content-between" v-else>
                                            <div class="fst-italic">{{quesionLigne(reponse.question)}}</div>
                                            <div class="badge text-uppercase fs-7" :class="classNameFromSAMI(reponse.reponse)">Pas d'évaluation</div>
                                        </div>
                                        <div class="d-flex align-items-center justify-content-start">
                                            <span class="me-2 text-warning">modification:</span>
                                            <sami-button v-model="reponse.reponse">{{reponse.reponse}}</sami-button>
                                        </div>
                                        <!-- <sami-button v-model="reponse.reponse"></sami-button>
                                        <div class="fst-italic">{{quesionLigne(reponse.question)}}</div>
                                        v-if="reponse.reponse  {{reponse.commentaire}} -->

                                        <textarea class="form-control d-block mt-2" v-model="reponse.commentaire" placeholder="modifier le commentaire"></textarea>
                                    </div>
                                </template>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
            
        
        <div class="d-flex align-items-center justify-content-between py-3">
            <!-- <div class="d-flex justify-content-between"> -->
            <button tupe="button" class="btn btn-lg btn-outline-secondary" @click.prevent="cancelAndReturn()" :disabled="pending.buttonSave">
                <span class="spinner-border spinner-border-sm" role="status" aria-hidden="true" v-if="pending.buttonSave"></span>
                Annuler
            </button>
            <button tupe="button" class="btn btn-lg btn-outline-primary" @click.prevent="updateCollecte()" :disabled="pending.buttonSave">
                <span class="spinner-border spinner-border-sm" role="status" aria-hidden="true" v-if="pending.buttonSave"></span>
                Enregistrer
            </button>
            <!-- </div> -->
        </div>
    </div>
</template>

<script>

import SamiButton from './SamiButton.vue';
import { mapState } from 'vuex';
import date from 'date-and-time';
import fr from 'date-and-time/locale/fr';

export default {
    props: {
        collecte: Object,
    },

    data() {
        return {
            pending: {
                buttonSave: false,
                buttonCancel: false,
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
            changeItem: true,
            nbreponses: 0,
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
		 * Modifie le format de la date entrée en paramètre et la retourne 
		 * sous le format 01 févr. 2021
		 * @param {string} date 
		 */

		changeFormatDateLit(el) {
			date.locale(fr);
			return date.format(new Date(el), 'DD MMM YYYY')
		},

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
            let reponse = this.reponses.find(e => e.question == question.id);

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
         * Initialise la data itemResponse en fonction de la collecte recue
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
            this.$app.apiPost('data/POST/collecte/'+this.collecte.id, this.itemResponse).catch(this.$app.catchError).finally(() => this.pending.buttonSave = false);
        },


        cancelEdit(){
            this.itemResponse.result = this.collecte.reponses.data_var;
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

        cancelAndReturn(){
            this.cancelEdit();
            
            // this.$router.go(-1);
            // this.$router.push({name:'ConsultationResponses', params:{id:id1, idCollecte:id2}});
            this.$emit('cancelEdit');
        }
    },

    components: {SamiButton },

    mounted() {
        this.initItemReponse();
    }
}

</script>