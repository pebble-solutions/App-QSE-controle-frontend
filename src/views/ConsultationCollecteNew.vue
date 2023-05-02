<template>
    <programmation-collecte-modal
        :collecte="collecteObject"
        :formulaires="formulaires"
        :personnels="listActifs"
        :readonly="read"
        @updated="routeToFormulaire" />
</template>

<script>
import { mapState } from 'vuex'
import ProgrammationCollecteModal from '../components/ProgrammationCollecteModal.vue'

export default {

    data() {
        return {
            read : ['formulaire', 'cible_personnel']
        }
    },

    computed: {
        ...mapState(['formulaires', 'listActifs', 'collecte', 'collectes']),

        /**
         * retourne un objet collecte normé
         * @returns {object}
         */
        collecteObject() {
            let newCollecte = {
                formulaire: this.collecte.information__groupe_id,
                projet_id: this.collecte.projet_id,
                date:this.collecte.date,
                cible_personnel: this.collecte.cible_personnel,
                enqueteur_personnel: this.collecte.enqueteur_personnel,
                previous_id: this.collecte.id,
                previous_result: this.collecte.result_var,
            };

            return newCollecte;
        }
    },

    methods: {
        /**
         * change la route vers le contrôle modifié
         * 
         * @param {object} //collecte
         */
        routeToFormulaire(collecte) {
      
                this.$router.push("/consultation/"+collecte.previous_id);
        },
    },

    components: { ProgrammationCollecteModal },

   
}

</script>