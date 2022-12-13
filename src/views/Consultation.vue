<template>
    <div v-if="collecte">

    </div>

    <div v-else class="">
        <AlertMessage icon="bi bi-info-circle">
            Séléctionner un KN terminé sur la liste de gauche
        </AlertMessage>
    </div>
</template>

<script>
import { mapState } from 'vuex';
import AlertMessage from '@/components/pebble-ui/AlertMessage.vue';


export default {
    computed: {
        ...mapState(['collecte']),
    },

    components: {AlertMessage}
}
</script>