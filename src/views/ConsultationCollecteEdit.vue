<template>
    <AppModal 
        :title="'Modification des informations du controle #' + $route.params.idCollecte"
        size="lg"
        @submit="saveCollecte()" 
        @modal-hide="routeToParent()" 
        :submitBtn="true" 
        :cancelBtn="true">

        <FormEditCollecteAdmin :collecte="collecte" @modification="collecteChange" @stringdate="justificationDate"></FormEditCollecteAdmin>

        <div class="card" v-if="noteContent">
            <div class="card-body">
                <h5 class="card-title">Note de la collecte #{{ $route.params.idCollecte }}</h5>
                <h6 class="card-subtitle mb-2 text-muted">Note justificative</h6>
                <p class="card-text">{{ noteContent }}</p>
            </div>
        </div>

    </AppModal>
</template>

<script>

import { mapState, mapActions } from 'vuex'
import AppModal from '../components/pebble-ui/AppModal.vue'
import FormEditCollecteAdmin from '../components/collecte/FormEditCollecteAdmin.vue'

export default {

    data() {
        return {
            collecteModifie: {},
            dateDoneModifString: null,
            noteContent: null
        }
    },

    computed: {
        ...mapState(['collecte', 'login']),
    },

    methods: {

        ...mapActions(['refreshCollecte']),

        createNote(){
            let modification = [];

            if (this.collecte.enqueteur_nom != this.collecteModifie.enqueteur_nom){
                modification.push(" Changement de contrôleur de "+ this.collecte.enqueteur_nom + " vers " + this.collecteModifie.enqueteur_nom)
            } 
            if (this.collecte.cible_nom != this.collecteModifie.cible_nom){
                modification.push(" Changement d'opérateur de " + this.collecte.cible_nom + " vers " + this.collecteModifie.cible_nom)
            }
            if (this.dateDoneModifString){
                modification.push(this.dateDoneModifString)
            }
    
            if(modification.length){
                let note = this.login.login + " à modifié le contrôle :";
                this.noteContent = note + modification;
            }
        },
        
        /**
         * Met a jour les valeurs des données de la collecte et créer les notes associées aux modifications
         */
        saveCollecte(){
            this.$app.apiPatch('v2/collecte/'+id+'/admin', {
                    comment : this.noteContent,
                    enqueteur_nom : this.collecteModifie.enqueteur_nom,
                    cible_nom : this.collecteModifie.cible_nom
                })
                .then((data) =>{
                    this.refreshCollecte(data);
                })
                .catch(this.$app.catchError).finally(() => this.routeToParent());
        },

        collecteChange(payload){
            this.collecteModifie = payload;
            this.createNote()
        },

        justificationDate(payload){
            this.dateDoneModifString = payload;
            this.createNote()
        },

        /**
         * Retourne a la vue précédente
         */
        routeToParent() {
            this.$router.push({ path: '/consultation/' + this.$route.params.idCollecte })
            // this.$router.back();
        },
    },

    components: { AppModal, FormEditCollecteAdmin }
}

</script>
