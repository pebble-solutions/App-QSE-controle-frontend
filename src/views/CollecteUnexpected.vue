<template>
    <programmation-collecte-modal
        :collecte="collecte"
        :formulaires="formulaires"
        :personnels="listActifs"
        @updated="routeToFormulaire" 
        
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
        ...mapState(['formulaires', 'listActifs'])
    },

    methods: {
        /**
         * Affiche la liste des KN programé sur le formulaire
         * 
         * @param {object} collecte
         */
        routeToFormulaire() {
            this.$router.push("/collecte/");
        },
    },

    components: { ProgrammationCollecteModal },

    mounted() {

    }
}

</script>
