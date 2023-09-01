<template>
    
    <div class="badge fs-6 text-uppercase border border-light" :class="SAMIClassName">
        <template v-if="hasResult">{{ displayValue }}</template>
        <i class="bi bi-question-circle" v-else></i>
    </div>

</template>

<script>
import { classNameFromSAMI } from '../../js/collecte';


export default {
    props: {
        result: String
    },

    computed: {
        /**
         * Retourne la valeur à afficher
         */
        displayValue() {
            return this.result ? this.result.toUpperCase() : "?";
        },

        /**
         * Retourne la classe CSS en fonction de la valeur SAMI
         */
        SAMIClassName() {
            return classNameFromSAMI(this.result);
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