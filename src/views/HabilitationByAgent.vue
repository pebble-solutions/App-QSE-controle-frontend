<template>
    <div class="container py-2 px-2">
        <Spinner v-if="pending.agent"></Spinner>
        <template v-else>
            
                    <h2>{{ filterListActifs }} </h2>
               
            <br>
            <h3>Habilitations à contrôler</h3>
                <VigilControl idVeille="8"></VigilControl>
            
            <div class="list-group">
                <div class="list-group-item">
                    <div class="d-flex justify-content-between align-items-center">

                    échéance - nom de l'habilitation à contrôler - motif -<button class="btn btn-outline-primary">Programmer</button>
                    </div>
                </div>
            </div>
            <h3>Liste des habilitations</h3>
            <div class="list-group">
                <div class="list-group-item">
                    habilitation - échéance - indicateur de  validité - les contrôles - indicateur de  veille
                </div>
            </div>
            <div class="list-group">
                <div class="list-group-item" v-for="hab in habilitationFromPerso" :key="hab.id">
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
                
                </div>
            </div>
        </template>
    </div>
   
</template>
<script>
import { mapState } from 'vuex';
import Spinner from '../components/pebble-ui/Spinner.vue';
import {dateFormat} from '../js/collecte';
import ProgressBar from '../components/ProgressBar.vue';
import VigilControl from '../components/VigilControl.vue';


export default{
    components: {Spinner, ProgressBar, VigilControl},
  

    data() {
        return {
            pending: {
                agent:false
            },
            habilitationFromPerso: '',
        }
    },

    computed: {
        ...mapState(['habilitationType', 'listActifs']),

        /**
         * cherche dans la liste des Actifs le personnel à afficher et retourne le nom
         */
        filterListActifs() {
            let agentId = this.listActifs.find((e) => e.id == this.$route.params.id);
            return agentId.cache_nom
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