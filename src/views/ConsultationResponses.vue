<template>
    <app-modal
        v-if="collecte"
        :title="('Kn n°'+collecte.id)"
        :footer="false"
        size="lg"
        @modal-hide="backPreviousRoute()"
        className='modal-dialog-scrollable'>
        
        <spinner v-if="pending.collecte"></spinner>
        <template v-else>
            <!-- <div>
                <div v-if="!edit" class="d-flex justify-content-end align-items-center">
                    <button  class="btn btn-success" @click="edit = true">
                        Modifier
                    </button>
                </div>

                <div v-else class="d-flex justify-content-between align-items-center">
                    <h2>Mode Edition</h2>

                    <button class="btn btn-primary" @click="updateCollecte()">
                        Enregistrer les modifications
                    </button>
                </div>
            </div> -->

            <consultation-collecte-resume 
                :collecte="collecte"
                :readonly="true"
                v-if="collecte && !edit" 
                
                @update-edit="updateEdit"/>

            <edit-collecte-ressume 
                :collecte="collecte"
                v-if="collecte && edit"
                @cancel-edit="updateEdit"
            />
        </template>
    </app-modal>
</template>

<script>

import { mapActions, mapState } from 'vuex';
import ConsultationCollecteResume from '../components/ConsultationCollecteResume.vue'
import EditCollecteRessume from "../components/EditCollecteResume.vue"
import AppModal from '../components/pebble-ui/AppModal.vue'
import Spinner from '../components/pebble-ui/Spinner.vue';

export default {

    data() {
        return {
            pending: {
                collecte: true,
                edit: false,
            },
            edit: false
        }
    },

    
    computed: {
        ...mapState(['collecte'])
    },
    
    methods: {
        ...mapActions(['setCollecte']),
        
        /**
         * Put back the url route before the modal route
         */
        backPreviousRoute() {
            this.$router.push({name:"consultationFormulaire", params: {id: this.$route.params.id}});
        },
        
        /**
         * Charge une collecte depuis le serveur dans le store.
         * 
         * @param {number} id L'ID de la collecte à charger
         */
        loadCollecte(id) {
            this.pending.collecte = true;
            this.$app.apiGet('data/GET/collecte/'+id, {
                environnement: 'private',
                afficher_corbeille: 'aussi'
            })
            .then((data) => {
                this.setCollecte(data);
            }).catch(this.$app.catchError).finally(() => this.pending.collecte = false);
        },

        /**
         * Mets a jours les donnée de la collecte
         */
        updateCollecte() {
            this.pending.saveEdition = true;
            this.edit = false;

            this.pending.saveEdition = false;
        },

        updateEdit() {
            this.edit = !this.edit; 
        }
    },

    components: {AppModal, ConsultationCollecteResume, EditCollecteRessume, Spinner},
    
    mounted() {
        this.loadCollecte(this.$route.params.idCollecte);
    }

}

</script>