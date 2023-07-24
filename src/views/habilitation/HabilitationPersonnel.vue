<template>
    
    <router-view />

</template>

<script>

export default {

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
        }
    },

    async mounted() {
        await this.loadHabilitationsPersonnels();
    }
}

</script>
