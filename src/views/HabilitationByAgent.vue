<template>
    <div class="container py-2 px-2">
        <Spinner v-if="pending.agent"></Spinner>
        <template v-else>
            <div class="d-flex align-items-baseline">
                <span class="me-3 fw-lighter"># {{ $route.params.id }}</span>
                <h2 class="mb-3">
                     {{filterListActifs.cache_nom }}
                </h2>
            </div>

                <div class="row">
                    <div class="col-12 col-md-6" >
                        <h3 class="mx-2">Liste des habilitations</h3>
                        <div class="list-group" v-for="hab in habilitationFromPerso" :key="hab.id">
                            <RouterLink :to="'/operateur/'+$route.params.id+'/'+hab.id" custom v-slot="{ navigate, href, isActive }">
                                <a :href="href" @click="navigate"  class="list-group-item list-group-item-action mb-2" :class="{'active': isActive}">
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
                                </a>
                            </RouterLink>
                            
                        </div>
                    </div>
                    <div class="col"> 
                      <RouterView></RouterView>
                    </div>
                </div>
                
                <alert-message v-if="!habilitationFromPerso.length" class="m-3" variant="warning" icon="bi-exclamation-square">Cet opérateur n'a pas été habilité </alert-message>
            </template>
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
            this.pending.agent=true;
            this.$app.apiGet('v2/controle/habilitation', {
                personnel_id : id,
            })
            .then((data) => {
                this.habilitationFromPerso = data;
            })
            .catch(this.$app.catchError).finally(() => this.pending.agent=false);
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