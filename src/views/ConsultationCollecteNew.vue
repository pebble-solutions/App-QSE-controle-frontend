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
            read : ['formulaire','cible_personnel']
        }
    },

    computed: {
        ...mapState(['formulaires', 'listActifs', 'collecte','collectes']),

        /**
         * retourne un objet collecte normé
         * @returns {object}
         */
         collecteObject() {
            let collecte = JSON.parse(JSON.stringify(this.collecte));
            collecte.formulaire = collecte.information__groupe_id;
            
            console.log(collecte)
            let newCollecte = {
                formulaire: collecte.formulaire,
                projet_id: collecte.projet_id,
                date:collecte.date,
                cible_personnel: collecte.cible_personnel,
                enqueteur_personnel: collecte.enqueteur_personnel,
                previous_id: collecte.id,
                previous_result: collecte.result_var,
            };
           console.log(this.collecte);
            return newCollecte;
        }
    },

    methods: {
        /**
         * Affiche 
         * 
         * @param {object} //collecte
         */
        routeToFormulaire(collecte) {
            // alert('le nouveau contrôle est programmé')
            this.$router.push("/consultation/"+collecte.previous_id);
        },
    },

    components: { ProgrammationCollecteModal },

   
}

</script>