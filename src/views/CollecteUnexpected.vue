<template>
    <programmation-collecte-modal
        :collecte="collecte"
        :formulaires="formulaires"
        :personnels="listActifs"
        @updated="routeToParent" 
        
        />
    </template>

<script>
import { mapState } from 'vuex'
import ProgrammationCollecteModal from '../components/ProgrammationCollecteModal.vue'

export default {
    
    data() {
        return {
            collecte: {
                formulaire: null,
                cible_personnel: null,
                date: null,
                enqueteur_personnel: null,
                environnement: "private"
            }
        }
    },
    
    computed: {
        ...mapState(['formulaires', 'listActifs','collectes'])
    },

    methods: {
        /**
         * retourne à la route précédente
         */
        routeToParent() {
            this.$router.go(-1);
        },
        
    },

    components: { ProgrammationCollecteModal },

    mounted() {

    }
}

</script>
