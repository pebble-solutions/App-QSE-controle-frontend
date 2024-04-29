<template>
    
    <div class="accordion accordion-flush" id="accordionPanelsStayOpenExample" v-if="(questions.length > 0)">
        <form-item :question="question" :collecte="collecte" :stat="getStat(question.id)" v-for="question in questions" :key="question.id" />
    </div> 
    <div class="d-flex justify-content-center mt-3" v-else>
        <alert-message variant="warning w-50 text-center">Aucune question renseignée</alert-message> 
    </div> 

</template>


<script>

import AlertMessage from '../pebble-ui/AlertMessage.vue'
import FormItem from './FormItem.vue'

export default {
    props: {
        questions: Array,
        collecte: Object,
        stats: Array
    },

    methods: {
        getStat(questionId){
            if (this.stats) {
                for(let stat of this.stats) {
                    if (stat.id = questionId) return stat
                }
            }
            return null
        }
        // getStat(questionId) {
        //     return this.stats ? this.stats.find(stat => stat.id === questionId) : null;
        // }

    },

    components: { FormItem, AlertMessage },
}

</script>