<template>
    <AppModal 
        :title="'Modification des informations du controle #' + $route.params.idCollecte"
        size="lg"
        @submit="saveCollecte()" 
        @modal-hide="routeToParent()"
        :submitBtn="valueButton"
        :cancelBtn="true">

        <HeadersForm :collecte="collecte" :personnels="personnels" @modification="collecteChange" @stringdate="justificationDate" />

        <div v-if="noteContent">
            <div class="card">
                <div class="card-body">
                    <h5 class="card-title">Note de la collecte #{{ $route.params.idCollecte }}</h5>
                    <h6 class="card-subtitle mb-2 text-muted">Note justificative</h6>
                    <p class="card-text">{{ noteContent }}</p>
                </div>
            </div>
    
            <div class="mb-3 mt-3">
                <label for="formComment" class="form-label fs-5 ms-2">Justification</label>
                <i class="bi bi-exclamation-triangle text-warning ms-3" v-if="!comment"></i>
                <textarea class="form-control" id="formComment" rows="3" placeholder="Veuillez entrez une justification..." v-model="comment" required></textarea>
            </div>
        </div>

    </AppModal>
</template>

<script>

import { mapState, mapActions } from 'vuex'
import AppModal from '../../components/pebble-ui/AppModal.vue'
import HeadersForm from '../../components/collecte/HeadersForm.vue'

export default {

    data() {
        return {
            collecteModifie: {},
            dateStartModifString: null,
            noteContent: null,
            comment: null
        }
    },

    computed: {
        ...mapState(['collecte', 'login', 'personnels']),

        /**
         * Retourne la veleur du bouton enregistrer 
         *  - true si une valeur à été modifié
         *  - false sinon
         */
        valueButton() {
            if(this.noteContent){
                return true;
            } else {
                return false
            }
        }
    },

    methods: {

        ...mapActions(['setCollecteHeaders', 'updateSearchResults']),

        /**
         * Modifie la valeur de la note à afficher
         */
        createNote() {
            let modification = [];
            this.noteContent = null;

            if (this.collecte.enqueteur__structure__personnel_id != this.collecteModifie.enqueteur__structure__personnel_id){
                modification.push(" Changement de contrôleur de "+ this.collecte.enqueteur_nom + " vers " + this.collecteModifie.enqueteur_nom)
            }
            if (this.collecte.cible__structure__personnel_id != this.collecteModifie.cible__structure__personnel_id){
                modification.push(" Changement d'opérateur de " + this.collecte.cible_nom + " vers " + this.collecteModifie.cible_nom)
            }
            if (this.dateStartModifString){
                modification.push(this.dateStartModifString)
            }

            if(modification.length){
                let note = this.login.login + " à modifié le contrôle :";
                this.noteContent = note + modification;
            }
        },


        /**
         * Met a jour les valeurs des données de la collecte et créer les notes associées aux modifications
         */
        saveCollecte() {
            this.$app.api.patch('v2/collecte/'+ this.$route.params.idCollecte +'/headers', {
                comment : this.comment,
                enqueteur__structure__personnel_id : this.collecteModifie.enqueteur__structure__personnel_id,
                enqueteur_nom : this.collecteModifie.enqueteur_nom,
                cible__structure__personnel_id : this.collecteModifie.cible__structure__personnel_id,
                cible_nom : this.collecteModifie.cible_nom,
                date_start : this.collecteModifie.date_start
            })
            .then((data) =>{
                this.setCollecteHeaders(data);
                this.updateSearchResults([data]);
            })
            .catch(this.$app.catchError).finally(() => this.routeToParent());
        },

        /**
         * Met a jour la valeur de la collecte modifié lors de la reception de l'evenement associé
         * 
         * @param {Object} payload 
         */
        collecteChange(payload) {
            this.collecteModifie = payload;
            this.createNote()
        },

        /**
         * Met a jour la phrase de de la note lors de la modification de la date
         * 
         * @param {Object} payload 
         */
        justificationDate(payload) {
            this.dateStartModifString = payload;
            this.createNote()
        },

        /**
         * Retourne a la vue précédente
         */
        routeToParent() {
            this.$router.back()
        }
    },

    components: { AppModal, HeadersForm }
}

</script>
