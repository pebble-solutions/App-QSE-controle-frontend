<template>

    <div class="accordion-item" v-if="inited">

        <h3 class="accordion-header" :id="headerId">
            <button class="accordion-button" type="button" data-bs-toggle="collapse" :data-bs-target="'#'+bodyId" aria-expanded="true" :aria-controls="bodyId">
                <span>{{question.ligne}}</span>
                <span v-if="question.obligatoire == 'OUI'" class="badge bg-warning mx-2 text-dark">Obligatoire</span>

                <FormModuleSAMIHeader :value="value" v-if="question.type == 'sami'" />
            </button> 
        </h3>

        <div :id="bodyId" class="accordion-collapse collapse show" :aria-labelledby="headerId">
            <div class="accordion-body">

                <div>
                    <h5>Informations sur cette question : </h5>
                    <p>Note dernier controle sur la question n°{{ this.question.id }}</p>
                    <p>Date du dernier control sur la question n°{{ this.question.id }}</p>
                    <p class="text-danger">"Non Contrôlé"</p>
                    <p>Barre de progression (FIS), avec la note moyenne individuelle et collective de chaque item.</p>
                    {{ stat }}
                </div>

                <div class="fst-italic" v-if="question.indication">{{ question.indication }}</div>

                <FormModuleSAMI :question="question" v-model:value="value" v-if="question.type == 'sami'" />
                <form-module-text :question="question" v-model:value="value" v-else-if="['text', 'textarea'].includes(question.type)" />
                <form-module-number :question="question" v-model:value="value" v-else-if="['integer', 'float'].includes(question.type)" />
                <form-module-date :question="question" v-model:value="value" v-else-if="['date', 'datetime'].includes(question.type)" />
                <FormModuleNone v-else />

                <textarea rows="3" class="form-control mt-3"  placeholder="Votre commentaire" v-model="commentaire" v-if="acceptComment"></textarea>

                <dropzone-comp 
                    :dropzoneId="dzId" 
                    :toolbar="['open']" 
                    :params="dzParams" 
                    :url="dzUrl" 
                    :documents="itemResponse.documents" 
                    
                    @upload-success="addDocument($event)"
                    @removed-document="removeDocument($event)"

                    v-if="inited"
                    />

            </div>
        </div>
    </div>

</template>

<script>
import { mapActions, mapState } from 'vuex';
import DropzoneComp from '../dropzone/DropzoneDocument.vue';
import FormModuleDate from './FormModuleDate.vue';
import FormModuleNone from './FormModuleNone.vue';
import FormModuleNumber from './FormModuleNumber.vue';
import FormModuleSAMI from './FormModuleSAMI.vue';
import FormModuleSAMIHeader from './FormModuleSAMIHeader.vue';
import FormModuleText from './FormModuleText.vue';

export default {

    props: {
        question: Object,
        collecte: Object,
        stat: Object
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
        },

        /**
         * Retourne true si le champ accepte un commentaire
         * @return {bool}
         */
        acceptComment() {
            const types = {
                sami: 'comment_sami',
                text: 'comment_text',
                textarea: 'comment_textarea',
                integer: 'comment_number',
                float: 'comment_number',
                date: 'comment_date',
                datetime: 'comment_date'
            };

            return this.collecte.formulaire[types[this.question.type]];
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

            let val = response ? response.reponse : null;

            if (this.question.type === 'float') {
                val = parseFloat(val);
            }
            if (this.question.type === 'integer') {
                val = parseInt(val);
            }
            
            this.itemResponse = {
                question: this.question.id,
                reponse: response ? val : null,
                commentaire: response ? response.commentaire : null,
                bloc: this.question.information__bloc_id,
                documents: response ? response.documents : []
            };

            if (response) {
                this.commentaire = response.commentaire;
                this.value = val;
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
        },

        /**
         * Retire un document à la collection de documents liés à la réponse active.
         * @param {object} document Le document à retirer
         */
        removeDocument(document) {
            const index = this.itemResponse.documents.findIndex(e => e.id == document.id);
            if (index !== -1) {
                this.itemResponse.documents.splice(index, 1);
                this.refreshResponse(this.itemResponse);
            }
        }
    },

    mounted() {
        this.initValues();
    },

    components: { FormModuleSAMI, FormModuleSAMIHeader, FormModuleNone, DropzoneComp, FormModuleText, FormModuleNumber, FormModuleDate }
}

</script>