<template>
    <div class="list-group-item" v-if="bloc.id == question.information__bloc_id">
        <div class="fst-italic">
            {{ question.question }}
        </div>


        <!-- <QuestionStats :stats="questionStats"/> -->
    </div>
</template>

<script>
// import QuestionStats from './QuestionStats.vue';

export default {
    // components: { QuestionStats },

    props: {
        bloc: Object,
        question: Object,
        stats: Array
    },

    computed: {
        /**
         * Retourne les stats qui correspond a la question
         * 
         * @return {object}
         */
        questionStats() {
            console.log(this.stats);
            let questionStats = this.stats.questions.find(qs => qs.id == this.question.id);

            console.log(questionStats);

            return questionStats;
        }
    },

}
</script>