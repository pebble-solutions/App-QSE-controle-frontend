<template>
    <router-view />
</template>

<script>
import { mapState } from 'vuex';


export default {
    computed: {
        ...mapState(['pending', 'habilitationsTypes']),
    },
    methods: {
        /**
         * Charge les informations des habilitations du personnel depuis la collection
         */
        async loadHabilitationsPersonnels() {
            const collection = this.$assets.getCollection("habilitationsPersonnels");
            collection.requestPayload = {
                last_control: 1,
                last_control_limit: 91,
                limit: 100
            };

            try {
                await collection.load();
            }
            catch (e) {
                this.$app.catchError(e);
            }
        },
        /**
         * Charge la liste du personnel 
         */
        async loadPersonnels() {
            const collection = this.$assets.getCollection("personnels");
            try {
                await collection.load({
                    limit: 'aucune'
                });
            }
            catch (e) {
                this.$app.catchError(e);
            }
        },
        /**
         * Charge habilitationCharacteristic
         */
         async loadHabilitationsCharacteristic() {
            const collection = this.$assets.getCollection("habilitationsCharacteristic");
            try {
                await collection.load({
                    limit: 'aucune'
                });
            }
            catch (e) {
                this.$app.catchError(e);
            }
        },
        /**
         * charge les habilitations type
         */
        async loadHabilitationsTypes() {
            const collection = this.$assets.getCollection("habilitationsTypes");
            try {
                await collection.load();
            }
            catch (e) {
                this.$app.catchError(e);
            }
        },
    },

    mounted() {
        this.loadHabilitationsPersonnels();
        this.loadPersonnels();
        this.loadHabilitationsCharacteristic();
        this.loadHabilitationsTypes();
    }
}

</script>
