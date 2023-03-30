<template>
    <div v-if="collecte">
        <div class="card my-2">
            <div class="card-header" v-if="timeline">
                <Timeline :collecte="collecte" />
            </div>

            <div class="card-body">
                <div class="row">
                    <div class="mb-2 col">
                        <div class="d-flex align-items-center">
                            <user-image :name="operateur" />
                            <div class="w-100 ps-2">
                                <strong class="d-block">Opérateur :</strong>
                                <span class="fw-lighter">{{operateur}}</span>
                            </div>
                        </div>
                    </div>

                    <div class="mb-2 col border-start border-dark">

                        <div class="d-flex align-items-center">
                            <user-image :name="controleur" />
                            <div class="w-100 ps-2">
                                <strong class="d-block">Contrôleur :</strong>
                                <span class="fw-lighter">{{controleur}}</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="my-2">
                    <strong>Projet :</strong>
                    <span class="fw-lighter ms-1">
                        <template v-if="collecte.projet_label">{{ collecte.projet_label }}</template>
                        <template v-else>Non renseigné</template>
                    </span>
                </div>
                
                <template v-if="isReadable">
                    <div class="my-2" v-if="collecte.commentaire != 'null' && collecte.commentaire">
                        <strong class="d-block">Contexte:</strong>
                        <div class="ms-2 fw-lighter">
                            {{collecte.commentaire}}
                        </div>
                    </div>
                    <div v-else>
                        <strong class="d-block">Pas d'éléments de contexte</strong>
                    </div>
    
                    <div class="my-2" v-if="collecte.rapport != 'null' && collecte.rapport">
                        <strong class="d-block">Commentaire final :</strong>
                        <div class="ms-2 fw-lighter">
                            {{collecte.rapport}}
                        </div>
                    </div>
                    <div v-else>
                        <strong class="d-block">Aucun commentaire final</strong>
                    </div>
    
                    <div class="my-2" v-if="collecte.actions != 'null' && collecte.actions">
                        <strong class="d-block">Actions correctives proposées :</strong>
                        <div class="ms-2 fw-lighter">
                            {{collecte.actions}}
                        </div>
                    </div>
                    <div v-else>
                        <strong class="d-block">Aucune action corrective proposée</strong>
                    </div>
                </template>
                
            </div>
        </div>
        
 
        <div v-if="collecte.documents.length && (isReadable)" class="card my-3">
            <div class="card-body">
                <h5 class="mb-3"><i class="bi bi-cloud-check me-1"></i> Fichiers joints</h5>
                <div class="list-group">
                    <file-item :document="document" v-for="document in collecte.documents" :key="document.id" />
                </div>
            </div>
        </div>

        <div class="card my-2" v-if="isReadable">
            <div class="card-header d-flex align-items-baseline justify-content-between">
                <h4 class="fs-5 card-title">Nombre d'items évalués</h4> 
                <div class="badge fs-6 text-uppercase ms-1" :class="classNameFromSAMI(collecte.result_var)" >
                    {{collecte.nb_reponse}} / {{collecte.nb_question}}
                </div>
            </div>

            <div class="accordion accordion-flush" id="formulaireResume">
                <div v-for="bloc in blocs" :key="'bloc-'+bloc.id" class="accordion-item">
                    <h2 class="accordion-header" :id="'heading-'+bloc.id">
                        <button class="accordion-button" type="button" data-bs-toggle="collapse" :data-bs-target="'#collapse-'+bloc.id" aria-expanded="true" :aria-controls="'collapse-'+bloc.id">
                            <div class="d-flex justify-content-between align-items-center w-100">
                                <div> {{bloc.bloc}} </div>

                                <!-- <div class="btn-group progress progress-ht me-3">
                                    <div class="btn progress-bar bg-success" role="progressbar" style="width: 45%" >8</div>
                                    <div class="btn progress-bar bg-primary" role="progressbar" style="width: 30%" >6</div>
                                    <div class="btn progress-bar bg-warning" role="progressbar" style="width: 20%" >4</div>
                                    <div class="btn progress-bar bg-danger" role="progressbar" style="width: 6%" >2</div>
                                </div> -->
                            </div>
                            <!-- {{bloc.bloc}}  -->
                        </button>
                    </h2>

                    <div :id="'collapse-'+bloc.id" class="accordion-collapse collapse-show" :aria-labelledby="'heading-'+bloc.id">
                        <div class="list-group list-group-flush">
                            <template v-for="question in getBlocQuestions(bloc)" :key="question.id">
                                <div class="list-group-item" v-if="question.corbeille !== 'OUI' || getQuestionReponse(question)">
                                    <div class="d-flex align-items-center justify-content-between">
                                        <span class="d-bloc" :class="{'text-secondary fw-light': getQuestionReponse(question) == null }">
                                            {{question.ligne}}
                                        </span>
                                        <strong class="badge text-uppercase ms-1 fs-6" :class="getClassNameFromQuestion(question)" v-if="['sami', 'integer', 'float'].includes(question.type)">{{getQuestionReponse(question)}}</strong>
                                    </div>

                                    <em v-if="!['sami', 'integer', 'float'].includes(question.type)" class="d-block">
                                        {{ getQuestionReponse(question) }}
                                    </em>

                                    <div class="fs-7 text-muted" v-if="question.corbeille === 'OUI'">
                                        <i class="bi bi-trash me-1"></i> Cette question n'existe plus dans la dernière version du formulaire
                                    </div>
                                    <div>
                                        <span class="fw-lighter">{{getCommentFromQestion(question)}}</span>
                                    </div>
    
                                    <div v-if="getQuestionDocuments(question)" class="my-3">
                                        <h6 class="mb-2"><i class="bi bi-cloud-check"></i> Fichiers joints</h6>
                                        <div class="list-group">
                                            <file-item :document="document" v-for="document in getQuestionDocuments(question)" :key="document.id" />
                                        </div>
                                    </div>
    
                                </div>
                            </template>
                        </div>
                    </div>
                </div>
            </div>
           
        </div>
        <alert-message 
            icon="bi-exclamation-triangle-fill" 
            className="my-3" 
            variant="warning" v-else>
                Ce contrôle n'est pas consultable car il n'est pas terminé.
        </alert-message>

        <!-- <div class="text-center my-3" v-if="!readonly">
            <button type="button" class="btn btn-lg btn-outline-primary" @click="$emit('updateEdit')">
                Modifier les informations
            </button>
        </div> -->
    </div>
</template>

<script>
import {classNameFromSAMI, dateFormat} from '../js/collecte';
import UserImage from './pebble-ui/UserImage.vue';
import FileItem from './dropzone/FileItem.vue';
import Timeline from './collecte/Timeline.vue';
import AlertMessage from './pebble-ui/AlertMessage.vue';

export default {
    props: {
        collecte: Object,
        readonly: Boolean,
        timeline: {
            type: Boolean,
            default: true
        }
    },

    computed: {
        /**
         * Racourcis vers la liste des blocs
         * @return {array}
         */
        blocs() {
            return this.collecte?.formulaire.blocs;
        },

        /**
         * Racourcis vers la liste des questions
         * @return {array}
         */
        questions() {
            return this.collecte?.formulaire.questions;
        },

        /**
         * Racourcis vers la liste des réponses
         * @return {array}
         */
        reponses() {
            return this.collecte?.reponses;
        },

        /**
         * Récupere le nom du controleur a partir d'un id
         * 
         * @return {string}
         */
        controleur() {
            return this.collecte.enqueteur_nom ?? 'Opérateur non renseigné';
        },

        /**
         * Récupere le nom du controleur a partir d'un id
         * 
         * @return {string}
         */
        operateur() {
            return this.collecte.cible_nom ?? 'Opérateur non renseigné';
        },

        /**
         * Retourne vrais lorsque le résumé peut être consulté
         * 
         * @return {bool}
         */
        isReadable() {
            return (!this.readonly || this.collecte.locked || this.collecte.done == 'OUI');
        }
    },

    methods: {

        /**
		 * Modifie le format de la date entrée en paramètre et la retourne 
		 * sous le format 01 févr. 2021
		 * @param {string} date 
		 */

		changeFormatDateLit(el) {
			return dateFormat(el);
		},

        /**
         * Si premier index de l'object return true sinon false
         * 
         * @param {Number} index Index de l'object box
         * 
         * @return {boolean}
         */
        getExpanded(index) {
            if (index == 0) {
                return true;
            }

            return false
        },

        /**
         * Retourne la liste des questions dans un bloc.
         * 
         * @param {object} bloc Le bloc à analyser
         * 
         * @return {array}
         */
        getBlocQuestions(bloc) {
            return this.questions.filter(e => e.information__bloc_id == bloc.id);
        },

        /**
         * Retourne la réponse à une question
         * 
         * @param {object} question La question à analyser
         * 
         * @return {string|null}
         */
        getQuestionReponse(question) {
            let reponse = this.reponses.find(e => e.question == question.id);
            return reponse ? reponse.data : null; /// pb?
        },

        /**
         * Retourne une classe CSS pour S A M I en fonction des réponses à une question
         * 
         * @param {object} question La question à analyser
         * 
         * @return {string}
         */
        getClassNameFromQuestion(question) {
            let reponse = this.getQuestionReponse(question);
            return this.classNameFromSAMI(reponse);
        },

        /**
         * Retourne le commentaire de la question fournie
         * 
         * @param {Object} question La question à analyser
         * 
         * @return {string}
         */
        getCommentFromQestion(question) {
            let reponse = this.reponses.find(resp => resp.question == question.id);
            return reponse ? reponse.commentaire : null;
        },

        /**
         * Retourne une classe CSS par rapport à une réponse S A M I
         * 
         * @param {string} reponse S A M I
         * 
         * @return {string}
         */
        classNameFromSAMI(reponse) {
            return classNameFromSAMI(reponse);
        },

        /**
         * Retourne la collection de documents liés à une question
         * 
         * @param {object} question La question à analyser
         * 
         * @return {string|null}
         */
        getQuestionDocuments(question) {
            let reponse = this.reponses.find(e => e.question == question.id);
            return reponse?.documents?.length ? reponse.documents : null;
        },
    },

    components: { UserImage, FileItem, Timeline, AlertMessage }
}
</script>