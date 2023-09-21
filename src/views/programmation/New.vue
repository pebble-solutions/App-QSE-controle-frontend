<template>
    <programmation-collecte-modal
        :collecte="collecte"
        :formulaires="formulaires"
        :personnels="personnels"
        
        @updated="routeToFormulaire" />
</template>

<script>

import { mapState } from 'vuex'
import ProgrammationCollecteModal from '../../components/ProgrammationCollecteModal.vue'

export default {

    data() {
        return {
            collecte: {
                formulaire:'',
                cible_personnel: null,
                date: null,
                enqueteur_personnel: null,
                environnement: "private",
                tlc: '',
                tli: ''
            }
        }
    },

    computed: {
        ...mapState(['formulaires', 'personnels','habilitationType','veilleConfig'])
    },

    methods: {
        /**
         * Redirige vers la liste des collectes sur un formulaire donné 
         * 
         * @param {object} collecte
         */
        routeToFormulaire(collecte) {
            this.$router.push("/programmation/"+collecte.information__groupe_id);
        },
    },

    components: { ProgrammationCollecteModal }
}

</script>
