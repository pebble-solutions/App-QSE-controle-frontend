<template>
    <div>

        <input type="text" class="form-control" v-model="cacheValue" placeholder="Votre réponse" v-if="question.type == 'text'">
        <textarea type="text" class="form-control" v-model="cacheValue" placeholder="Votre réponse" rows="4" v-else></textarea>

    </div>
</template>


<script>

export default {

    props: {
        question: Object,
        value: String
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
