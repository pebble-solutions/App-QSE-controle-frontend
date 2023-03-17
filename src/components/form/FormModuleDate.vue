<template>
    <div>

        <VueDatePicker v-model="date" :enable-time-picker="isDatetime" auto-apply />

        <!-- <input type="date" class="form-control" v-model="cacheValue" placeholder="Votre réponse" v-if="question.type == 'date'">
        <input type="datetime-local" class="form-control" v-model="cacheValue" placeholder="Votre réponse" v-else> -->

    </div>
</template>


<script>

import VueDatePicker from '@vuepic/vue-datepicker';
import '@vuepic/vue-datepicker/dist/main.css';
import { ref } from 'vue';

const toSQLDate = require('js-date-to-sql-datetime');

export default {

    props: {
        question: Object,
        value: String
    },

    data() {
        return {
            date: null
        }
    },

    emits: ['update:value'],

    computed: {
        /**
         * Retourne true si le type de champ inclu le temps
         * @return {bool}
         */
        isDatetime() {
            return this.question.type == 'datetime';
        }
    },

    watch: {
        /**
         * Lorsque la nouvelle valeur est mise à jour elle est actualisée sur l'élément parent.
         * @param {string} val Nouvelle valeur
         */
        date(val) {
            this.refreshValue(toSQLDate(val));
        },

    },

    methods: {
        /**
         * Informe l'élément parent d'une modification de la valeur.
         * 
         * @param {string} value S,A,M,I
         */
        refreshValue(value) {
            this.$emit('update:value', value);
        }
    },

    components: { VueDatePicker },

    mounted() {
        this.date = new ref(new Date(this.value));
    }
}
</script>
