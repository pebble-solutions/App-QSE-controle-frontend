<template>
    <div class="list-group-item">
        <div class="fst-italic pb-2">
            {{ question.question }}
        </div>

        <QuestionStats :stats="questionStats"/>
    </div>
</template>

<script>
import QuestionStats from './QuestionStats.vue';

export default {
    components: { QuestionStats },

    props: {
        question: Object,
        stats: Object
    },

    computed: {
        /**
         * Retourne les stats qui correspond a la question
         * 
         * @return {object}
         */
        questionStats() {
            let questionStats = this.stats.questions.find(qs => qs.id == this.question.id);
            return questionStats;
        }
    },

}
</script>