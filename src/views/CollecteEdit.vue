<template>
    
    <programmation-collecte-modal
        :collecte="collecte"
        :formulaires="formulaires"
        :personnels="listActifs"
        
        @updated="routeToFormulaire"
        @deleted="routeToFormulaire"
        v-if="collecte" />
    
</template>

<script>

import { mapState } from 'vuex';
import ProgrammationCollecteModal from '../components/ProgrammationCollecteModal.vue';

export default {

    data() {
        return {
            collecte: null
        }
    },

    computed: {
        ...mapState(['collectes', 'formulaires', 'listActifs'])
    },

    components:{ProgrammationCollecteModal},

    methods: {
        /**
         * Récupère une collecte depuis le store
         * 
         * @param {number|null} collecte_id L'ID de la collecte à récupérer
         */
        getCollecte(collecte_id) {
            if (collecte_id != 0) {
                this.collecte = this.collectes.find(e => e.id == collecte_id);
                if (!this.collecte) {
                    alert("Aucune collecte trouvée!");
                }
            }
            else {
                this.collecte = {
                    formulaire: this.$route.params.id,
                    cible_personnel: null,
                    date: null,
                    enqueteur_personnel: null,
                    environnement: "private"
                };
            }
        },

        /**
         * Affiche la liste des KN programé sur le formulaire
         * 
         * @param {object} collecte
         */
        routeToFormulaire(collecte) {
            this.$router.push("/programmation/"+collecte.information__groupe_id);
        },
    },

    mounted() {
        this.getCollecte(this.$route.params.idCollecte);
    }
}
</script>



