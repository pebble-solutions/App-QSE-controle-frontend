<template>
    <ProgrammationCollecteModal
        :collecte="collecteObject"
        :formulaires="formulaires"
        :personnels="listActifs"
        :readonly="read"

        @updated="routeToFormulaire" />
</template>

<script>

import { mapState, mapActions } from 'vuex'
import ProgrammationCollecteModal from '../components/ProgrammationCollecteModal.vue'

export default {

    data() {
        return {
            pending: {
                collecte: false
            },
            
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
            let nowDate = new Date().toLocaleDateString('fr-FR');
            let nextCollecte = {
                formulaire: collecte.formulaire,
                projet_id: collecte.projet_id,
                date: nowDate,
                cible_personnel: collecte.cible_personnel,
                enqueteur_personnel: collecte.enqueteur_personnel,
                previous_id: collecte.id,
                previous_result: collecte.result_var,
            };
            return nextCollecte;
        }
    },

    methods: {
        ...mapActions(['setCollecte']),
        /**
         * Charge une collecte depuis le serveur dans le store.
         * 
         * @param {number} id L'ID de la collecte à charger
         */
         loadCollecte(id) {
            this.pending.collecte = true;
            this.$app.apiGet('data/GET/collecte/'+id, {
                environnement: 'private'
            })
            .then((data) => {
                this.setCollecte(data);
            }).catch(this.$app.catchError).finally(() => this.pending.collecte = false);
        },
        
        /**
         * change la route en fonction de la date du nouveau contrôle
         * 
         * @param {object} collecte
         */
        routeToFormulaire(collecte) {
            let dateDay = new Date().toLocaleDateString('fr-FR')
            let dateCollecte = new Date(collecte.date).toLocaleDateString('fr-FR')
            if(dateDay == dateCollecte){
                this.$router.push("/collecte/"+collecte.id);
            }
            else {
                this.loadCollecte(collecte.previous_id)
                this.$router.push("/collecte/"+collecte.previous_id);
                // Fonction manquante !n'affiche pas la nouvelle collecte dans la timeline et pas de message indiquant que c'est crée 
            }
           
        },
       
    },

    

    components: { ProgrammationCollecteModal },

    
}

</script>
