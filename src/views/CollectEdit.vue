<template>
    
        <AppModal size="lg" :title="title" @submit="createCollecte()" @modal-hide="routeToParent()" :submitBtn="true" :cancelBtn="true" :pending="pending.programmationKn">
            <FormCollecte
            :collkn="collecte"
            @edit-formulaire="editFormulaire"
            @edit-cible-personnel="editCiblePersonnel"
            @edit-enqueteur-personnel="editEnqueteurPersonnel"
            @edit-date="editDate"
            @update-collecte="updateCollecte"
            v-if="collecte"></FormCollecte>
        </AppModal>
    
</template>

<script>

import { mapActions, mapState } from 'vuex';
import AppModal from '../components/pebble-ui/AppModal.vue';
import FormCollecte from '../components/FormCollecte.vue';

export default {
    
    data() {
        
        return {
            
            pending: {
                programmationKn : false
            },
            collecte: {
                id:'',
                formulaire: '',
                cible_personnel: '',
                enqueteur_personnel: '',
                date: '',
                environnement: 'private'
            },
            
            defaultCollecte: {
                id:'',
                formulaire: '',
                cible_personnel: '',
                enqueteur_personnel: '',
                date: '',
                environnement: 'private'
            }

        }
        
    },
    computed: {
        ...mapState(['OpenedElement','collectes']),

        title() {
            return this.$route.params.id?'Modification progammation KN': 'Nouvelle programmation KN';
        }
    },
    
    methods: {

        ...mapActions(['refreshCollectes']),

        updateCollecte(val){
            this.collecte = val;
            console.log('updatecollecte', this.collecte)
        },

        /**
         * Affecte la valeur du formulaire à la collecte stockée dans data
         * 
         * @param {String} val Nouveau formulaire
         */
        editFormulaire(val) {
            this.collecte.formulaire = val;
            console.log('editFormulaire', this.collecte.formulaire);
        },
        /**
         * Affecte la valeur de l'opérateur stocké dans data
         * 
         * @param {String} val Nouvel opérateur
         */
        editCiblePersonnel(val) {
            this.collecte.cible_personnel = val;
            console.log('editcible', this.collecte);
        },
        /**
         * Affecte la valeur de l'enqueteur stocké dans data
         * 
         * @param {String} val Nouvel enqueteur
         */
        editEnqueteurPersonnel(val) {
            this.collecte.enqueteur_personnel = val;
            console.log('editprenom', this.collecte.enqueteur_personnel);
        },
        /**
         * Affecte la valeur de la nouvelle date stocké dans data
         * 
         * @param {date} val Nouvel date
         */
        editDate(val) {
            this.collecte.date = val;
            console.log('editprenom', this.collecte.date);
        },

        /**
         * crée une nouvelle collecte  sur le serveur
         * 
         */
        createCollecte(){
            console.log("creation en cours : ", this.collecte)
                        
            this.$app.apiPost('data/POST/collecte', this.collecte)
            .then((data) => {
                console.log(data, 'collecte crée')
                this.updateCollecte(data)
                // this.$emit('newKn');
                alert ('collecte crée', data, this.collecte);
                // this.collecte.formulaire = null;
                // this.collecte.cible_personnel = null;
                // this.collecte.enqueteur_personnel = null,
                // this.collecte.date = null;
                this.routeToParent();
            })
            .catch(this.$app.catchError);
        }, 
        getCollecte() {
            console.log(this.$route);
            if(this.$route.params.id){
                console.log('collectes', this.collectes);
                let coll = this.collectes.find(e => e.id == this.$route.params.id);
                console.log('coll', coll);
                console.log(this.collecte, 'collecte')
                this.collecte.id = coll.id;
                this.collecte.formulaire = coll.information__groupe_id;
                this.collecte.cible_personnel = coll.cible__structure__personnel_id;
                this.collecte.enqueteur_personnel = coll.enqueteur__structure__personnel_id;
                this.collecte.date = coll.date;
                console.log('getcollecte',this.collecte);
                console.log('getColl', coll)
            }
            else{ 
                console.log(this.collecte,'defaut')
            }
        },
        

        /**
         * retourne à la route précédente
         */
        routeToParent() {
            this.$router.go(-1);
        },
    },

    components:{AppModal, FormCollecte},

    beforeRouteUpdate(to){
        this.getCollecte(to.params.id);
    },
    mounted() {
        this.getCollecte(this.$route.params.id);
        console.log('route params id', this.$route.params.id);
        console.log('collecte monte', this.collecte);
    }
    

}
</script>



