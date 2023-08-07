<template>
    
    <div class="accordion accordion-flush" id="accordionPanelsStayOpenExample" v-if="(questions.length > 0)">
        <form-item :question="question" :collecte="collecte" v-for="question in questions" :key="question.id" />
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
        collecte: Object
    },

    components: { FormItem, AlertMessage },
}

</script>