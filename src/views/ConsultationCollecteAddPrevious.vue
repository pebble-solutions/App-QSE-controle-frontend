<template>
    <AppModal 
        :title="'Modification des informations du controle #' + $route.params.idCollecte"
        size="lg"
        @submit="saveCollecte()" 
        @modal-hide="routeToParent()"
        :submitBtn="valueButton"
        :cancelBtn="true">

       <AddPreviousForm :collecte="collecte" :collectes="collectes" :parentPreviousId="previous_id" @modification="perviousIdChange" v-if="!pending.collectes"/>

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
import AppModal from '../components/pebble-ui/AppModal.vue'
import AddPreviousForm from '../components/collecte/AddPreviousForm.vue'

export default {

    data() {
        return {
            collectes : [],
            previous_id: null,
            noteContent: null,
            comment: null,
            pending : {
                collectes : false
            }
        }
    },

    computed: {
        ...mapState(['collecte', 'login']),

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
            this.noteContent = null;
            this.noteContent = this.login.login + " à modifié le contrôle : Ajout d'un kn bouclé avec celui-ci -- #" + this.previous_id + " -> #" + this.$route.params.idCollecte;
        },

        /**
         * Met a jour les valeurs des données de la collecte et créer les notes associées aux modifications
         */
        saveCollecte() {
            this.$app.api.patch('v2/collecte/'+ this.$route.params.idCollecte +'/headers', {
                comment : this.comment,
                previous_id : this.previous_id
            })
            .then((data) =>{
                this.setCollecteHeaders(data);
                this.updateSearchResults([data]);
            })
            .catch(this.$app.catchError).finally(() => this.routeToParent());
        },

        /**
         * Met a jour la valeur du previous_id modifié lors de la reception de l'evenement associé
         * 
         * @param {Object} payload 
         */
        perviousIdChange(payload) {
            this.previous_id=payload;
            this.createNote()
        },

         /**
         * Retourne la liste des collectes depuis l'ID d'un personnel
         * 
         * @param {number} id ID d'un personnel
         * 
         * @return {object}
         */
         async getCollectes(){

            this.pending.collectes = true;

            let options = {
                personnel_id__operateur: this.collecte.cible__structure__personnel_id,
                information__groupe_id: this.collecte.information__groupe_id,
                sans_bouclage: true,
                done: 'OUI'
            }

            let tmpCollectes

            try {
                tmpCollectes = await this.$app.api.get('v2/collecte', options);
            }
            catch (e) {
                this.$app.catchError(e);
            }
            finally {
                this.collectes = tmpCollectes.reverse();
                this.previous_id = this.collectes[0].id;
                this.pending.collectes = false;
            }
        },

        /**
         * Retourne a la vue précédente
         */
        routeToParent() {
            this.$router.back()
        }
    },

    mounted() {
        this.getCollectes();
    },

    components: { AppModal, AddPreviousForm }
}

</script>
