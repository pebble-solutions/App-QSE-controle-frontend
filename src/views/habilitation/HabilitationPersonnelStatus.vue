<template>
    
    <div v-if="isReady">
        {{ habilitationPersonnel }}
    </div>

</template>

<script>

export default {

    data() {
        return {
            collection: null,
            habilitationPersonnel: null
        }
    },

    methods: {
        /**
         * Récupère l'habilitation personnel dans data
         * 
         * @param {number} id ID de l'habilitation personnel à cibler
         */
        async getHabilitationPersonnel(id) {
            id = typeof id !== 'undefined' ? id : this.$route.params.id;
            try {
                this.habilitationPersonnel = await this.collection.getById(id);
            }
            catch (e) {
                this.$app.catchError(e);
            }
        }
    },

    computed: {
        /**
         * Retourne vrais si les données du composant sont prètes à être affichées
         * 
         * @return {boolean}
         */
        isReady() {
            return this.collection && this.habilitationPersonnel ? true : false;
        }
    },

    beforeRouteUpdate(to) {
        this.getHabilitationPersonnel(to.params.id)    
    },

    mounted() {
        this.collection = this.$assets.getCollection("habilitationsPersonnels");
        this.getHabilitationPersonnel();
    }
}
</script>
