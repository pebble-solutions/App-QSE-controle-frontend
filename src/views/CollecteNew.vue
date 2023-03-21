<template>
    <programmation-collecte-modal
        :collecte="collecte"
        :formulaires="formulaires"
        :personnels="listActifs"
        
        @updated="routeToFormulaire" />
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
         * Affiche 
         * 
         * @param {object} collecte
         */
        routeToFormulaire(collecte) {
            this.$router.push("/programmation/"+collecte.information__groupe_id);
        },
    },

    components: { ProgrammationCollecteModal },

    mounted() {

    }
}

</script>
