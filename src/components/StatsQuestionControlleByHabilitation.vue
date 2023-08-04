<template>
    <div class="card my-2">
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
                            <template v-for="question in questions" :key="'question-'+question.id">  
                                <div class="list-group-item" v-if="bloc.id == question.information__bloc_id">
                                    <div class="d-flex align-items-center justify-content-between">
                                        <div class="fst-italic">
                                            {{ question.question }}
                                        </div>
                                    </div>
                                </div>
                            </template>
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
        stats: Array,
        groupsAndQuestions: Array
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

    },

    mounted() {
        console.log('stats', this.stats);
        console.log('list', this.groupsAndQuestions);
    }
};
</script>