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
            // collecte: {
            //     formulaire: null,
            //     cible_personnel: null,
            //     date: null,
            //     enqueteur_personnel: null,
            //     environnement: "private"
            // },
            // col:{
            //     formulaire:'54',
            //     cible_personnel:'142',
            //     projet: null,
            //     date: null,
            //     enqueteur_personnel: '735',
            //     environnement: "private"
            // },
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
            return collecte;
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

        coll(){
            console.log(this.$route.params.id, 'paramsId');
            console.log(this.collecte, 'collecte')

        }
    },

    components: { ProgrammationCollecteModal },

    
}

</script>
