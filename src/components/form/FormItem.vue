<template>

    <div class="accordion-item">

        <h3 class="accordion-header" :id="headerId">
            <button class="accordion-button" type="button" data-bs-toggle="collapse" :data-bs-target="bodyId" aria-expanded="true" :aria-controls="bodyId">
                <span>{{question.ligne}}</span>
                <span v-if="question.obligatoire == 'OUI'" class="badge bg-warning mx-2 text-dark">Obligatoire</span>

                <FormModuleSAMIHeader :value="value" />
            </button>
        </h3>

        <div :id="bodyId" class="accordion-collapse collapse show" :aria-labelledby="headerId">
            <div class="accordion-body">

                <div class="fst-italic" v-if="question.indication">{{ question.indication }}</div>

                <FormModuleSAMI :question="question" v-model:value="value" v-if="question.type == 'sami'" />
                <FormModuleNone v-else />

                <textarea rows="3" class="form-control mt-3"  placeholder="Votre commentaire" v-model="commentaire"></textarea>

                <dropzone-comp 
                    :dropzoneId="dzId" 
                    :toolbar="['open']" 
                    :params="dzParams" 
                    :url="dzUrl" 
                    :documents="itemResponse.documents" 
                    
                    @upload-success="addDocument($event)"

                    v-if="inited"
                    />

            </div>
        </div>
    </div>

</template>

<script>
import { mapActions, mapState } from 'vuex';
import DropzoneComp from '../dropzone/DropzoneDocument.vue';
import FormModuleNone from './FormModuleNone.vue';
import FormModuleSAMI from './FormModuleSAMI.vue';
import FormModuleSAMIHeader from './FormModuleSAMIHeader.vue';

export default {

    props: {
        question: Object,
        collecte: Object
    },

    data() {
        return {
            itemResponse: {
                question: null,
                reponse: null,
                commentaire: null,
                bloc: null,
                documents: []
            },
            value: null,
            commentaire: '',
            inited: false
        }
    },

    watch: {
        /**
         * Lorsque le commentaire est mis à jour, le store doit être actualisé.
         * @param {string} val La nouvelle valeur du commentaire
         */
        commentaire(val) {
            this.refreshCommentaire(val);
        },

        /**
         * Lorsque la valeur est mise à jour, le store doit être actualisé.
         * @param {string} val La nouvelle valeur
         */
        value(val) {
            this.refreshValue(val);
        }
    },

    computed: {
        ...mapState(['responses']),

        /**
         * Retourne l'ID unique du header
         * @return {string}
         */
        headerId() {
            return `formItemHeader-${this.question.id}`;
        },

        /**
         * Retourne l'ID unique du contenu de l'élément
         * @return {string}
         */
        bodyId() {
            return `formItemBody-${this.question.id}`;
        },

        /**
         * Retourne l'ID unique de la boite de dépôt de fichiers du formulaire.
         * @return {string}
         */
        dzId() {
            return `dz-item-${this.question.id}`;
        },

        /**
         * Retourne la liste des paramètres envoyés en post lors du téléchargement de pièces jointes
         * @return {object}
         */
        dzParams() {
            return {
                question_id: this.question.id,
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
        ...mapActions(['refreshResponse']),

        /**
         * enregistre le commentaire de l'item
         */
        refreshCommentaire(val) {
            if (this.itemResponse.commentaire != val) {
                this.itemResponse.commentaire = val;
                this.refreshResponse(this.itemResponse);
            }
        },

        /**
         * Rafraichie la valeur de la réponse dans le store.
         * 
         * @param {string} value
         */
        refreshValue(value) {
            this.itemResponse.reponse = value;
            this.refreshResponse(this.itemResponse);
        },

        /**
         * Initialise un objet tampon pour stocker les informations de la réponse.
         */
        initValues() {
            this.inited = false;
            
            const response = this.responses.find(e => e.question == this.question.id);
            
            this.itemResponse = {
                question: this.question.id,
                reponse: response ? response.reponse : null,
                commentaire: response ? response.commentaire : null,
                bloc: this.question.information__bloc_id,
                documents: response ? response.documents : []
            };

            if (response) {
                this.commentaire = response.commentaire;
                this.value = response.reponse;
            }

            this.inited = true;
        },

        /**
         * Ajoute un document à la collection des documents liés à la réponse active.
         * @param {object} document Le document à ajouter
         */
        addDocument(document) {
            this.itemResponse.documents.push(document);
            this.refreshResponse(this.itemResponse);
        }
    },

    mounted() {
        this.initValues();
    },

    components: { FormModuleSAMI, FormModuleSAMIHeader, FormModuleNone, DropzoneComp }
}

</script>