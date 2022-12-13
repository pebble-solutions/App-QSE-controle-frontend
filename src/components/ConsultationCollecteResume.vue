<template>
    <div>
        <div class="card my-2">
            <div class="card-header d-flex align-items-center justify-content-between">
                <h4 class="fs-5 card-title">Informations générales </h4>

                <div class="badge fs-5 text-uppercase" :class="classNameFromSAMI(collecte.result_var)">
                    {{collecte.result_var.toUpperCase()}}
                </div>
            </div>

            <div class="card-body">
                <div>
                    <strong>Type de KN: </strong> <span class="fw-lighter">{{collecte.formulaire.groupe}}</span>
                </div>

                <div class="my-2">
                    <strong class="d-block">Commentaire général: </strong>

                    <div class="fw-lighter">
                        {{collecte.commentaire}}
                    </div>
                </div>

                <div>
                    <strong class="d-block">Rapport final:</strong>

                    <div class="fw-lighter">
                        {{collecte.rapport}}
                    </div>
                </div>
            </div>
        </div>

        <div class="card my-2">
            <div class="card-header">
                <h4 class="fs-5 card-title">Formulaire</h4>
            </div>

            <div class="accordion accordion-flush" id="formulaireResume">
                <div v-for="bloc in blocs" :key="'bloc-'+bloc.id" class="accordion-item">
                    <h2 class="accordion-header" :id="'heading-'+bloc.id">
                        <button class="accordion-button" type="button" data-bs-toggle="collapse" :data-bs-target="'#collapse-'+bloc.id" aria-expanded="true" :aria-controls="'collapse-'+bloc.id">
                            {{bloc.bloc}}
                        </button>
                    </h2>

                    <div :id="'collapse-'+bloc.id" class="accordion-collapse collapse show" :aria-labelledby="'heading-'+bloc.id" data-bs-parent="#formulaireResume">
                        <div class="accordion-body">
                            <div class="list-group list-group-flush">
                                <div class="list-group-item d-flex align-items-center justify-content-between" v-for="question in getBlocQuestions(bloc)" :key="question.id">
                                    {{question}}
                                    <em class="d-bloc">{{question.ligne}}</em>
                                    <strong class="badge text-uppercase" :class="getClassNameFromQuestion(question)">{{getQuestionReponse(question)}}</strong>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>

export default {
    props: {
        collecte: Object
    },

    computed: {
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
        } 
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

        /**
         * Retourne la liste des questions dans un bloc.
         * 
         * @param {object} bloc Le bloc à anlyser
         * 
         * @return {array}
         */
        getBlocQuestions(bloc) {
            return this.questions.filter(e => e.information__bloc_id == bloc.id);
        },

        /**
         * Retourne la réponse à une question
         * 
         * @param {object} question La question à anlyser
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
         * Retourne une classe CSS par rapport à une réponse S A M I
         * 
         * @param {string} reponse S A M I
         * 
         * @return {string}
         */
        classNameFromSAMI(reponse) {
            if (reponse == 's') return 'text-bg-success';
            else if (reponse == 'a') return 'text-bg-primary';
            else if (reponse == 'm') return 'text-bg-warning';
            else if (reponse == 'i') return 'text-bg-danger';
            else return 'text-bg-secondary';
        }
    },

    components: {  }
}
</script>