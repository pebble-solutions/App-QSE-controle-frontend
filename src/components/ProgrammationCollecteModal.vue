<template>
    
    <AppModal size="lg" 
        :title="title" 
        @submit="record()"  
        @modal-hide="routeToParent()" 
        @delete="deleteCollecte()"
        
        :submit-btn="true" 
        :cancel-btn="true" 
        :delete-btn="collecte.id ? true : false"
        :pending="pending.collecte"
        :pending-delete="pending.delete">

            <FormCollecte
                :collecte="collecte"
                :personnels="personnels"
                :formulaires="formulaires"
                :readonly="readonly"

                @update-collecte="updateCollecte"
                v-if="collecte" />
        
    </AppModal>

</template>

<script>

import { mapActions } from 'vuex';
import AppModal from './pebble-ui/AppModal.vue';
import FormCollecte from './ProgrammationCollecteForm.vue';

export default {

    props: {
        collecte: Object,
        personnels: Array,
        formulaires: Array,
        readonly: Array
    },

    data() {
        
        return {
            pending: {
                collecte : false,
                delete: false
            },
            tmpCollecte: null
        }
        
    },

    computed: {
        /**
         * Retourne le titre de la modale en fonction du contexte
         * 
         * @return {string}
         */
        title() {
            return this.collecte.id ? "Modifier un contrôle programmé": "Programmation d'un contrôle";
        }
    },

    emits: ['deleted', 'updated'],

    methods: {

        ...mapActions(['refreshCollectes', 'removeCollecte', 'refreshNbTodoFormulaires']),

        /**
         * Met à jour les informations d'une collecte
         * 
         * @param {object} val Les nouvelles valeurs de la collecte
         */
        updateCollecte(val) {
            this.tmpCollecte = val;
        },

        /**
         * Supprime la collecte sur le serveur
         */
        deleteCollecte() {
            this.pending.delete = true;
            this.$app.apiPost('data/DELETE/collecte/'+this.collecte.id).then(() => {
                this.removeCollecte(this.collecte);
                this.$emit("deleted", this.collecte);
            }).finally(() => this.pending.delete = false);
        },

        /**
         * Enregistre les modifications de la programmation
         */
        record() {
            this.pending.collecte = true;
            this.tmpCollecte.environnement = 'private';
            this.$app.apiPost('data/POST/collecte', this.tmpCollecte).then(data => {
                this.refreshCollectes([data]);
                this.refreshNbTodoFormulaires(data.information__groupe_id);
                this.$emit('updated', data);
            }).catch(this.$app.catchError).finally(() => this.pending.collecte = false);
        },

        /**
         * Retourne à la vue précédente
         */
        routeToParent() {
            this.$router.go(-1);
        }
    },

    components:{AppModal, FormCollecte},

    mounted() {
        this.tmpCollecte = JSON.parse(JSON.stringify(this.collecte));
    }


}
</script>



