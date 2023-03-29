<template>
    <ProgrammationCollecteModal
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
            
            read : ['formulaire','enqueteur_personnel','cible_personnel']              
            }
    },
    

    computed: {
        ...mapState(['formulaires', 'listActifs','collecte','collectes']),

        /**
         * retourne un objet collecte normé
         * @returns {object}
         */
        collecteObject() {
            let collecte = JSON.parse(JSON.stringify(this.collecte));
            collecte.formulaire = collecte.information__groupe_id;
            console.log(collecte, 'collecte actuelle');
            let nextCollecte = {
                formulaire: collecte.formulaire,
                projet_id: collecte.projet_id,
                date:collecte.date,
                cible_personnel: collecte.cible_personnel,
                enqueteur_personnel: collecte.enqueteur_personnel,
                previous_id: collecte.id,
                previous_result: collecte.result_var,
            };
            // nextCollecte.formulaire = collecte.information__groupe_id;
            // nextCollecte.date = collecte.date;
            // nextCollecte.cible_personnel = collecte.cible_personnel;
            // nextCollecte.enqueteur_personnel = collecte.enqueteur_personnel;
            // nextCollecte.previous_id = collecte.id;

            console.log(collecte.id, collecte.formulaire, collecte.projet_id, collecte.date, collecte.cible_personnel,collecte.enqueteur_personnel, 'champ collecte');
            console.log(nextCollecte,'nextCollecte');
            return nextCollecte;
        }
    },

    methods: {
        /**
         * Affiche 
         * 
         * @param {object} collecte
         */
        routeToFormulaire(collecte) {
            this.$router.push("/collecte/"+collecte.id);
        },

       
    },

    components: { ProgrammationCollecteModal },

    
}

</script>
