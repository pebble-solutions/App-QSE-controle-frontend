<template>
    
    <span class="badge rounded-pill" :class="classList">
        <template v-if="hasResult">{{ result }}</template>
        <i class="bi bi-question-circle" v-else></i>
    </span>

</template>

<script>

import { classNameFromSAMI } from '../../js/collecte.js';

export default {
    props: {
        result: String,
        className: String
    },

    computed: {
        /**
         * Retourne la liste des classes CSS à appliquer en fonction du résultat
         * 
         * @return {string}
         */
        classList() {
            return this.className+' '+classNameFromSAMI(this.result)
        },

        /**
         * Teste une collecte afin de déterminer si elle a un résultat
         * 
         * @return {boolean}
         */
        hasResult() {
            return this.result && this.result != "null";
        }
    }
}
</script>