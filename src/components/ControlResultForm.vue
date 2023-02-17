<template>
    <div class="card my-3" v-if="collecte" >
        <div class="card-header">
            <div class="d-flex">
                <h2 class="card-title">Bilan du contrôle</h2>

                <div class="ms-auto">
                    <bloc-navigation></bloc-navigation>
                </div>
            </div>

            <div v-if="stats">
                <ControlSAMIStats :stats="samiStats" :collecte="collecte" />
            </div>
        </div>

        <div class="card-body">
            <h3>Votre évaluation générale pour ce contrôle</h3>

            <FormModuleSAMI :question="{id: 'end'}" v-model:value="itemResponse.result" />

            <div>
                <label for="collecte_rapport" class="fs-5 form-label">Vos remarques complémentaires:</label>
                <textarea class="form-control" id="collecte_rapport" v-model="itemResponse.rapport"></textarea>
            </div>

            <div class="mt-3">
                <label for="collecte_action" class="fs-5 form-label ">Actions correctives proposées:</label>
                <textarea class="form-control" id="collecte_action" v-model="itemResponse.actions"></textarea>
            </div>

            <div class="mt-3">
                <label class="fs-5">Joindre des fichiers</label>
                <dropzone-document
                    :dropzoneId="'dz-file-'+collecte.id" 
                    :toolbar="['open']" 
                    :params="dzParams" 
                    :url="dzUrl" 
                    :documents="collecte.documents" 
                    
                    @upload-success="addDocument($event)"/>
            </div>

            <div class="d-flex  mt-3" @click.prevent="validate()">
                <button type="button" class="d-block w-100 btn btn-lg btn-success" :disabled="pending.validation">
                    <span class="spinner-border spinner-border-sm" role="status" aria-hidden="true" v-if="pending.validation"></span>
                    <i v-else class="bi bi-clipboard-check"></i>
                    Valider
                </button>
            </div>
        </div>
    </div>

    <div v-else>
        <spinner></spinner>
    </div>
</template>

<script>

import {mapActions, mapState} from 'vuex';
import BlocNavigation from './BlocNavigation.vue';
import ControlSAMIStats from './ControlSAMIStats.vue';
import DropzoneDocument from './dropzone/DropzoneDocument.vue';
import FormModuleSAMI from './form/FormModuleSAMI.vue';
import Spinner from './pebble-ui/Spinner.vue';

export default {
    props: {
        stats: Object
    },

    components: { BlocNavigation, Spinner, FormModuleSAMI, ControlSAMIStats, DropzoneDocument },

    data() {
        return {
            samiDict: ['S', 'A', 'M', 'I'],
            itemResponse: {
                result_type: 'sami',
                result: '',
                rapport: '',
                environnement: 'private',
                done: 'OUI',
                actions: ''
            },
            pending: {
                validation: false
            }
        }
    },

    computed: {
        ...mapState(['collecte', 'responses']),

        /**
         * Retourne les statistiques 
         */
        samiStats() {
            return this.stats[this.collecte.information__groupe_id]?.type.sami;
        },

        /**
         * Retourne la liste des paramètres envoyés en post lors du téléchargement de pièces jointes
         * @return {object}
         */
         dzParams() {
            return {
                input_md5: this.collecte.input_md5
            };
        },

        /**
         * Retourne l'URL pour l'envoi de pièce jointe
         * @return {string}
         */
        dzUrl() {
            return this.$app.licence.apiBaseURL+'data/POST/collecte/'+this.collecte.id+'/file';
        }
    },

    methods: {
        ...mapActions(['refreshCollectes', 'refreshCollecte', 'addDocumentToCollecte']),

        /**
         * Envoie les données a l'api pour valider le KN
         */
        validate() {
            this.pending.validation = true;

            if (confirm('Une fois le contrôle validé, vous ne pourrez plus le modifier. Confirmez-vous la validation?')) {
                this.$app.apiPost('data/POST/collecte/'+this.collecte.id, this.itemResponse)
                .then((data) => {
                    return this.refreshCollectes([data]);
                })
                .then(() => {
                    return this.$app.apiGet('data/GET/collecte/'+this.collecte.id, {
                        environnement: 'private'
                    });
                })
                .then((collecte) => {
                    this.refreshCollecte(collecte);
                    this.$router.push({name:'collecteKN', params:{id:this.collecte.id}});
                })
                .catch(this.$app.catchError).finally(() => this.pending.validation = false);
            } else {
                this.pending.validation = false;
            }
        },

        /**
         * Ajout une document à la collection de documents liés à la collecte
         * 
         * @param {object} document Le document à ajouter à la collection
         */
        addDocument(document) {
            this.addDocumentToCollecte(document);
        }
    },

    mounted() {
        if (this.collecte) {
            this.itemResponse.rapport = this.collecte.rapport;
            this.itemResponse.result = this.collecte.result_var;
            
        }

    }
}
</script>