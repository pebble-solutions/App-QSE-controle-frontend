<template>
    <div class="card my-2">
        <pre>{{ groupsAndQuestions }}</pre> <pre>{{ stats }}</pre>
        <div class="accordion accordion-flush" id="formulaireStats">
            <div v-for="bloc in blocs" :key="'bloc-'+bloc.id" class="accordion-item">
                <h2 class="accordion-header" :id="'heading-'+bloc.id">
                    <button class="accordion-button" type="button" data-bs-toggle="collapse" :data-bs-target="'#collapse-'+bloc.id" aria-expanded="true" :aria-controls="'collapse-'+bloc.id">
                        {{ bloc.bloc }} 
                    </button>
                </h2>

                <div :id="'collapse-'+bloc.id" class="accordion-collapse collapse show" :aria-labelledby="'heading-'+bloc.id">
                    <div class="accordion-body">
                        <div class="list-group list-group-flush">
                            <template v-for="question in getQuestionsFromBlocId(bloc.id)" :key="'question-'+question.id">
                                <QuestionItems :question="question" :stats="stats"/>
                            </template>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import QuestionItems from './questions/QuestionItems.vue'

export default {
    components: { QuestionItems },

    props: {
        stats: Object,
        groupsAndQuestions: Object
    },

    computed: {
        /**
         * Insert dans la variable blocs les blocs du formulaire du tableau groupsAndQuestions
         */
        blocs() {
            return this.groupsAndQuestions.blocs;
        },

        /**
         * Insert dans la variable qestions les qestions du formulaire du tableau groupsAndQuestions
         */
        questions() {
            return this.groupsAndQuestions.questions;
        }
    },

    methods: {
        /**
         * Retourne la collection des questions liée à un bloc
         * 
         * @param {number} id L'ID du bloc de référence
         * 
         * @return {array}
         */
        getQuestionsFromBlocId(id) {
            return this.groupsAndQuestions.questions.filter(e => e.information__bloc_id == id);        
        }
    }
};
</script>