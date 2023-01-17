<template>
    <div>
        <div class="card my-2">
            <div class="card-header">
                <div class="d-flex align-items-center justify-content-between">
                    <h4 class="fs-5 card-title">
                        <span class="fw-lighter me-1">{{collecte.formulaire.groupe}} du {{changeFormatDateLit(collecte.date)}}</span>
                    </h4>
                    <div class="text-success" v-if="collecte.date_done">Validé le {{changeFormatDateLit(collecte.date_done)}}</div>
                </div>
                <div>
                    Note générale:
                    <div v-if="collecte.result_var && collecte.result_var != 'null'" class="badge fs-5 text-uppercase" :class="classNameFromSAMI(collecte.result_var)">
                        {{collecte.result_var}}
                    </div>
                    <div v-else class="badge fs-5 text-uppercase" :class="classNameFromSAMI(collecte.result_var)">Non renseignée</div>
                </div>
            </div>

            <div class="card-body">

                <div>
                    <strong class="d-block">Projet:</strong>
                    <div class="ms-2 fw-lighter">
                        <span v-if="collecte.projet_label">{{ collecte.projet_label }}</span>
                        <span v-else>Projet non renseigné</span>
                    </div>
                </div>

                <div class="row" v-if="listActifs">
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
                    <strong class="d-block">Commentaire général:</strong>
                    <div class="ms-2 fw-lighter">
                        {{collecte.commentaire}}
                    </div>
                </div>

                <div class="mb-2">
                    <strong class="d-block">Rapport final:</strong>
                    <div class="ms-2 fw-lighter">
                        {{collecte.rapport}}
                    </div>
                </div>

                <div class="mb-2">
                    <strong class="d-block">Actions correctives proposées:</strong>
                    <div class="ms-2 fw-lighter">
                        {{collecte.actions}}
                    </div>
                </div>
            </div>
        </div>

        <div class="card my-2">
            <div class="card-header d-flex align-items-baseline justify-content-between">
                <h4 class="fs-5 card-title">Nombre d'items évalués</h4> 
                <div class="badge fs-6 text-uppercase ms-1" :class="classNameFromSAMI(collecte.result_var)" >
                {{collecte.nb_reponse}} / {{collecte.nb_question}}
                </div>
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
                                <div class="list-group-item" v-for="question in getBlocQuestions(bloc)" :key="question.id">
                                    <div class="d-flex align-items-center justify-content-between">
                                        <em class="d-bloc" :class="{'text-secondary fw-light': getQuestionReponse(question) == null }">{{question.ligne}}</em>
                                        <strong class="badge text-uppercase ms-1 fs-6" :class="getClassNameFromQuestion(question)">{{getQuestionReponse(question)}}</strong>
                                    </div>
                                    <div>
                                        <span class="fw-lighter">{{getCommentFromQestion(question)}}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div class="text-center my-3">
            <button type="button" class="btn btn-lg btn-outline-primary" @click="$emit('updateEdit')">
                Modifier les informations
            </button>
        </div>
    </div>
</template>

<script lang="js">

import { mapState } from 'vuex';
import date from 'date-and-time';
import fr from 'date-and-time/locale/fr';


export default {
    props: {
        collecte: Object,
        readonly: Boolean
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
         * Récupere le nom du controleur a partir d'un id
         * 
         * @return {string}
         */
        operateur() {
            let controleurName = this.listActifs.find(personnel => personnel.id == this.collecte.cible__structure__personnel_id);

            if (controleurName) {
                return controleurName.cache_nom;
            } else {
                return 'Opérateur non renseigné'
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
         * Retourne la liste des questions dans un bloc.
         * 
         * @param {object} bloc Le bloc à analyser
         * 
         * @return {array}
         */
        getBlocQuestions(bloc) {
            return this.questions.filter(e => e.information__bloc_id == bloc.id);
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
            return reponse ? reponse.data : null; /// pb?
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
    },

    components: {  }
}

</script>