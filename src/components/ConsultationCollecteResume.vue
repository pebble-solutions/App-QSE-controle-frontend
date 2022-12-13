<template>
    <div>
        Reste à lister :
        <li>Les informations du répondant</li>
        <li>les informations du contrôleurs</li>
        <li>Les infos générales : commentaire d'entrée, note générale de sortie</li>
        Puis lisser la mise en page
    </div>
    <div>

        <div v-for="bloc in blocs" :key="bloc.id" class="card my-2">
            <h3 class="card-header">{{bloc.bloc}}</h3>

            <div class="card-body">

                <div class="list-group list-group-flush">

                    <div class="list-group-item d-flex align-items-center justify-content-between" v-for="question in getBlocQuestions(bloc)" :key="question.id">
                        <em class="d-bloc">{{question.ligne}}</em>
                        <strong class="badge" :class="getClassNameFromQuestion(question)">{{getQuestionReponse(question)}}</strong>
                    </div>

                </div>

            </div>
            
        </div>

        <pre>{{collecte}}</pre>
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