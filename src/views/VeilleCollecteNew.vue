<template>
    <div>
    
    </div>
    <programmation-collecte-modal
    
        :collecte="collecte"
        :formulaires="formulaires"
        :personnels="listActifs"
        :veille= false
        
        @updated="routeToParent"/>
</template>

<script>

import { mapState } from 'vuex'
import ProgrammationCollecteModal from '../components/ProgrammationCollecteModal.vue';
// import AppModal from '../components/pebble-ui/AppModal.vue';
// import ProgrammationCollecteForm from '../components/ProgrammationCollecteForm.vue';

export default {

    data() {
        return {
            collecte: {
                formulaire: null,
                cible_personnel: null,
                date: null,
                enqueteur_personnel: null,
                environnement: "private"
            },
        }
    },

    computed: {
        ...mapState(['formulaires', 'listActifs'])
    },

    methods: {
        /**
         * Affiche 
         * 
         * @param {object} collecte
         */
        routeToParent() {
            this.$router.go(-1);
        },
    },

    components: {ProgrammationCollecteModal}, //ProgrammationCollecteModal, ProgrammationCollecteForm

    mounted() {

    }
}

</script>
