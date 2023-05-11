<template>
    <div class="row">

        <div class="col-12 col-md-6 col-lg-4">
            <input type="number" class="form-control" v-model="cacheValue" placeholder="Votre réponse" v-if="question.type == 'integer'">
            <input type="number" class="form-control" v-model="cacheValue" placeholder="Votre réponse" step=".01" v-else>

        </div>

    </div>
</template>


<script>

export default {

    props: {
        question: Object,
        value: Number
    },

    data() {
        return {
            cacheValue: null
        }
    },

    emits: ['update:value'],

    watch: {
        /**
         * Lorsque la nouvelle valeur est mise à jour elle est actualisée sur l'élément parent.
         * @param {string} val Nouvelle valeur
         */
        cacheValue(val) {
            this.refreshValue(val);
        }
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

    mounted() {
        this.cacheValue = this.value;
    }
}
</script>
