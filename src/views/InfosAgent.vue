<template>
    <div>
        <AppModal @modal-hide="routeToParent()">
            LA voila ma modaaaaaaale
        </AppModal>

    </div>
</template>

<script>
import AppModal from '../components/pebble-ui/AppModal.vue';
export default {
    components: {
        AppModal,
    },


    methods: {

        /**
         * Retourne à la vue précédente
         */
        routeToParent() {
            this.$router.push({ name: 'ControllerBoard' },);

        }

    },
}
</script>