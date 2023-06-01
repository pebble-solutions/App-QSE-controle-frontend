<template>
    <div class="container py-2 px-2">
        <Spinner v-if="pending.agent"></Spinner>
        <template v-else-if=" filterListActifs">
            <h2 class="mb-3">
                <span class="me-3 fw-lighter"># {{ $route.params.id }}</span>
                 {{filterListActifs.cache_nom }}
            </h2>
            <!-- <h3>Veille ...</h3> -->
            
            <!-- <h3>Habilitations à contrôler</h3>
                <VigilControl idVeille="8"></VigilControl> -->
                <div class="row">
                    <div class="col-6" v-if="habilitationFromPerso">
                        <h3 class="mx-2">Liste des habilitations</h3>
                        <div class="list-group" v-for="hab in habilitationFromPerso" :key="hab.id">
                            <div class="list-group-item" >
                                <div class="d-flex justify-content-between">
                                    <span> {{returnNameHab(hab.habilitation_type_id)}}</span>
                                    <span>
                                        échéance le  {{ changeFormatDateLit(hab.df) }}
                                    </span>
                                </div>
                                <ProgressBar
                                :dd="new Date(hab.dd)"
                                :df="new Date(hab.df)"
                                ></ProgressBar>
                                <div class="d-flex justify-content-end align-items-center">
                                    <button class="btn btn-sm btn-outline-primary mt-2" @click.prevent="loadCollecte(hab.id)">Veille</button>
                                    <!-- #{{ hab.id}} - {{ hab.habilitation_type_id }} -->
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="col">
                        <div v-if="listControlDone">
                        <h3 class="mx-2">Historique des contrôles </h3>
                            <div class="list-group">
                                <div class="list-group-item d-flex flex-column justify-content-between align-items-between" v-for="control in listControlDone" :key="control.id">
                                    <div class="d-flex justify-content-between alignt-items-center">
                                        <span v-if="control.result_var" class="badge bg-success text-center">{{ control.result_var}}</span> <span v-else>Pas d'évaluation générale</span>
                                        <span class="fw-lighter">le {{ changeFormatDateLit(control.date_done)}}</span>
                                    </div>
                                    <span v-if="control.rapport">{{ control.rapport }} </span>
                                    <span v-else>Pas de rapport final</span>
                                    <span v-if="control.nb_question & control.nb_reponse">{{ control.nb_reponse }} réponses sur  {{ control.nb_question }} questions</span>
                                    <span v-else>Pas de bilan chiffré</span>
                                    <div class="d-flex justify-content-end align-items-center">
                                        <!-- <a class="btn btn-sm btn-outline-primary"><i class="bi bi-eye"></i></a> -->
                                        <span class="text-end fw-lighter">Contrôle réalisé par {{ control.enqueteur_nom }}</span>

                                    </div>
                                </div>
                            </div>
                        </div>
                        <AlertMessage v-else>Aucun contrôle enregistré</AlertMessage>
                        
                    </div>
                </div>
               
            <alert-message v-if="!habilitationFromPerso.length" class="m-3" variant="warning" icon="bi-exclamation-square">Cet opérateur n'a pas été habilité </alert-message>
        </template>
        <alert-message v-else class="m-3" variant="warning" icon="bi-exclamation-square">Personnel non trouvé</alert-message>

        <RouterView></RouterView>
    </div>
   
</template>
<script>
import { mapState } from 'vuex';
import Spinner from '../components/pebble-ui/Spinner.vue';
import {dateFormat} from '../js/collecte';
import ProgressBar from '../components/ProgressBar.vue';
import AlertMessage from '../components/pebble-ui/AlertMessage.vue';
// import VigilControl from '../components/VigilControl.vue';


export default{
    components: {Spinner, ProgressBar, AlertMessage }, //VigilControl
  

    data() {
        return {
            pending: {
                agent:false
            },
            habilitationFromPerso: '',
            listControlDone: ''
        }
    },

    computed: {
        ...mapState(['habilitationType', 'listActifs']),

        /**
         * cherche dans la liste des Actifs le personnel à afficher et retourne le nom
         */
        filterListActifs() {
            let agentId = this.listActifs.find((e) => e.id == this.$route.params.id);
            return agentId
        }

        
    },
    
    methods: {

        /**
         * Envoie une requête pour charger la liste des habilitation d'un personnel
         * en fonction de l'id fourni
         * @param {Number} id du personnel 
         */
        loadHabilitationFromPerso(id) {
            this.pending.agent =true;
            this.$app.apiGet('v2/controle/habilitation', {
                personnel_id : id,
            })
            .then((data) => {
                this.habilitationFromPerso = data;
            })
            .catch(this.$app.catchError).finally(() => this.pending.agent = false);
        },
       

        /**
         * charge les contrôles à réaliser pour l'id personnel renseignée via l'API
         * 
         * @param   {number}    id  l'id de la veille
         * 
         */
         loadControlTodo(id) {
            this.pending.control = true;

            this.$app.apiGet('v2/controle/veille/'+id+'/todo', {CSP_min: 50, CSP_max: 600})
            .then((data) =>{
                this.listControl = data;
            })
            .catch(this.$app.catchError).finally(() => this.pending.control = false);

        },
         /**
         * Envoie une requête pour charger la liste des collectes 
         * en fonction de l'id fourni
         * @param {Number} id du 
         */
         loadCollecte(id) {
            this.pending.agent =true;
            this.$app.apiGet('data/GET/collecte', {
                tli : id,
                done: 'OUI'
            })
            .then((data) => {
                this.listControlDone = data;
                console.log(data, 'listcontroldone')
            })
            .catch(this.$app.catchError).finally(() => this.pending.agent = false);
        },
        
        /**
         * retourne le nom de l'habilitation en fonction de l'id fourni
         */
         returnNameHab(id) {
            let hab = this.habilitationType.find((e) => e.id  == id);
          
                return hab.nom

            
        },
         /**
		 * Modifie le format de la date entrée en paramètre et la retourne 
		 * sous le format 01 févr. 2021
		 * @param {string} date 
		 */

		changeFormatDateLit(el) {
			return dateFormat(el);
		},


    },
    /**
     * Lorsque la route interne est mise à jour, le nouvel élément doit être chargé.
     */
     beforeRouteUpdate(to) {
        if (to.params.id != this.personnel_id) {
            this.listControlDone =''
            
            this.loadHabilitationFromPerso (to.params.id);

        }
    },

    beforeMount () {
        /**
         * charge la list des habilitations du personnel concerné
         */
        this.loadHabilitationFromPerso(this.$route.params.id);
    }
    
}

</script>