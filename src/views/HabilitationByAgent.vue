<template>
    <div class="container py-2 px-2">
        <Spinner v-if="pending.agent"></Spinner>

        <div v-else>
            <div class="d-flex align-items-baseline">
                <span class="me-3 fw-lighter"># {{ $route.params.id }}</span>

                <h2 class="mb-3">
                    {{ currentPersonnel.cache_nom }}
                </h2>
            </div>

            <div class="row">
                <div class="col-12 col-md-6" >
                    <h3 class="mx-2">Liste des habilitations</h3>

                    <div class="list-group" v-for="hab in habilitationFromPerso" :key="hab.id">
                        <RouterLink :to="'/operateur/'+$route.params.id+'/'+hab.id" custom v-slot="{ navigate, href, isActive }">
                            <a :href="href" @click="navigate"  class="list-group-item list-group-item-action mb-2" :class="{'active': isActive}">
                                <div class="d-flex justify-content-between">
                                    <span> {{ returnNameHab(hab.habilitation_type_id) }}</span>

                                    <span>
                                        échéance le  {{ changeFormatDateLit(hab.df) }}
                                    </span>
                                </div>

                                <ProgressBar :dd="hab.dd" :df="hab.df"></ProgressBar>
                            </a>
                        </RouterLink>
                    </div>
                </div>

                <div class="col"> 
                    <RouterView @formulaire="getFormulaire"></RouterView>
                </div>
            </div>

            <div v-if="hasStats">
                <h3>Stats</h3>
                
                <StatsQuestionControlleByHabilitation :stats="stats" :groups-and-questions="groupsAndQuestions"/>
            </div>
            
            <alert-message v-if="!habilitationFromPerso.length" class="m-3" variant="warning" icon="bi-exclamation-square">Cet opérateur n'a pas été habilité </alert-message>
        </div>
    </div>

        
</template>


<script>
import { mapState } from 'vuex';
import Spinner from '../components/pebble-ui/Spinner.vue';
import {dateFormat} from '../js/collecte';
import ProgressBar from '../components/ProgressBar.vue';
import AlertMessage from '../components/pebble-ui/AlertMessage.vue';
import StatsQuestionControlleByHabilitation from '../components/StatsQuestionControlleByHabilitation.vue';


export default{
    components: { Spinner, ProgressBar, AlertMessage, StatsQuestionControlleByHabilitation },

    data() {
        return {
            pending: {
                agent: false,
                groupsAndQuestions: true,
                formulaireStats: true
            },
            habilitationFromPerso: '',
            listControlDone: '',
            stats:{},
            groupsAndQuestions: {},
            formulaireId: null
        }
    },

    computed: {
        ...mapState(['habilitationType', 'listActifs']),

        /**
         * retourne les informations du personnel depuis l'id passé dans l'url
         * 
         * @return {object}
         */
        currentPersonnel() {
            return this.listActifs.find((e) => e.id == this.$route.params.id);
        },

        /**
         * return true si les données de groupsAndQuestions et formulaireStats ont été recupere via l'api
         * 
         * @return {boolean}
         */
        hasStats() {
            if (this.pending.groupsAndQuestions || this.pending.formulaireStats || !this.formulaireId) {
                return false;
            }
            
            return true;
        }
    },

    watch: {
        /**
         * Lance la methode getGroupsAndQuestions pour recuperer au pret de l'api les blocs et lignes
         * 
         * @param {number} newVal id de information groupe (forumlaire)
         */
        formulaireId(newVal) {
            this.getGroupsAndQuestions(newVal);
            this.loadFormulaireStats(newVal);
        }
    },
    
    methods: {
        /**
         * Envoie une requête pour charger la liste des habilitation d'un personnel
         * en fonction de l'id fourni
         * 
         * @param {Number} id du personnel 
         * 
         * @return {proxy}
         */
        loadHabilitationFromPersonnel(id) {
            this.pending.agent = true;
            this.$app.apiGet('v2/controle/habilitation', {
                personnel_id : id,
            })
            .then((data) => {
                this.habilitationFromPerso = data;
            })
            .catch(this.$app.catchError).finally(() => this.pending.agent = false);
        },
       
        /**
         * Récupere l'id de information groupe (du formulaire)
         * 
         * @param {number} payload id de information groupe
         */
        getFormulaire(payload) {
            this.formulaireId = payload;
        },

        /**
         * Récupere les blocs et question (ligne) du formulaire
         * 
         * @param {number} formulaireId ID du formulaire
         * 
         * @return {proxy}
         */
        getGroupsAndQuestions(formulaireId) {
            this.pending.groupsAndQuestions = true;

            this.$app.api.get(`v2/information-groupe/${formulaireId}`, {
                blocsandlignes: 1,
                ppp: "private"
            }).then((data) => {
                this.groupsAndQuestions = data;
            }).catch(this.$app.catchError).finally(() => this.pending.groupsAndQuestions = false);
        },

        /**
         * Récupere les stats du formulaire 
         * 
         * @param {number} formulaireId ID du formulaire
         * 
         * @return {proxy}
         */
        loadFormulaireStats(formulaireId) {
            this.pending.formulaireStats = true;

            // console.log(formulaireId);

            this.$app.api.get(`v2/information-groupe/${formulaireId}/stats`, {
                "personnel_ids": this.currentPersonnel.id
            }).then((data) => {
                this.stats = data;
            }).catch(this.$app.catchError).finally(() => this.pending.formulaireStats = false);
        },
       
        /**
         * retourne le nom de l'habilitation en fonction de l'id fourni
         * 
         * @param {number} id   ID de l'habilitation a chercher
         */
        returnNameHab(id) {
            let hab = this.habilitationType.find((e) => e.id  == id);
          
            return hab.nom;            
        },

        /**
		 * Modifie le format de la date entrée en paramètre et la retourne 
		 * sous le format 01 févr. 2021
         * 
		 * @param {string} el 
         * 
         * @return {string}
		 */
		changeFormatDateLit(el) {
			return dateFormat(el);
		},

        /**
         * Reset les variable et pending d'une question d'un ontrolle
         */
        resetStats() {
            this.groupsAndQuestions = [];
            this.stats = [];
            this.pending.formulaireStats = true;
            this.pending.groupsAndQuestions = true;
        }
    },

    /**
     * Lorsque la route interne est mise à jour, le nouvel élément doit être chargé.
     */
    beforeRouteUpdate(to) {
        if (to.params.id != this.currentPersonnel.id) {
            this.loadHabilitationFromPersonnel(to.params.id);
            //this.resetStats();
        }
    },

    beforeMount() {
        /**
         * charge la list des habilitations du personnel concerné
         */
        this.loadHabilitationFromPersonnel(this.$route.params.id);
    }
}



</script>