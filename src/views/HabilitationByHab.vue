<template>
    
    <div class="container py-2 px-2">
        <spinner v-if="pending.habilitation"></spinner>
        <template v-else>
            <div class="row">
                <div class="col-12 col-lg-8">
                    <h2>{{ filterhabilitationType}} </h2>
                </div>
                <div v-if="findVeilleConfig" class="col">
                    <div class="card">
                        <div class="card-header">veille n° {{ findVeilleConfig.id }}</div>
                        <div class="card-body" >
                                <div>pas de veille : {{ findVeilleConfig.control_step }} jours</div>
                                <div>taux de veille : {{ findVeilleConfig.control_rate }} %</div>
                        </div>
                        <button class="btn btn-outline-primary">Modifier</button>
                    </div>
                </div>
                <alert-message v-else>la veille n'est pas configurée</alert-message>



            </div>
            <h3  class="my-3"> Personnels à contrôler:</h3>
            
               
                <vigil-control v-if="findVeilleConfig.id" :idVeille="findVeilleConfig.id"></vigil-control>
                <template v-else>pas de veille</template>
               
            
            <h3  class="my-3">Personnels habilités:</h3>
            <div class="list-group">
                <div class="list-group-item">
                    Agent - échéance - indicateur de validité  - les contrôles - indicateur de veille
                </div>
            </div>
            <div class="list-group" >
                <div class="list-group-item" v-for="carac in listPersonnelHabilite" :key="carac.id">

                    <div class="d-flex justify-content-between">
                        <span  class="me-2">{{ returnName(carac.personnel_id) }} {{ carac.personnel_id }}</span>

                        <!-- <span class="me-2">{{ carac.personnel_id }}</span> -->
                        <span class="me-2">échéance le   {{ changeFormatDateLit(carac.df)}}</span>
                    </div>
                    <progress-bar
                    :dd="new Date(carac.dd)"
                    :df="new Date(carac.df)"
                    ></progress-bar>
                </div>
            </div>
           


        </template>
    </div>
</template>
<script>
import { mapState } from 'vuex';
import {dateFormat} from '../js/collecte';
import ProgressBar from '../components/ProgressBar.vue';
import VigilControl from '../components/VigilControl.vue';

import Spinner from '../components/pebble-ui/Spinner.vue';
import AlertMessage from '../components/pebble-ui/AlertMessage.vue';

export default {
    components: { Spinner, ProgressBar, AlertMessage, VigilControl},
    


    data() {
        return {
            pending: {
                habilitation: false,
                agent:false,
            },
            listPersonnelHabilite : 'default',
            personnel:'',
            
        }
    },

    computed: {
        ...mapState(['habilitationType', 'listActifs','veilleConfig']),

        /* parcourt la list des types d'habilitation en fonction de l'id de la route
         * et retourne le nom de l'habilitation
         */
        filterhabilitationType() {
            let habilitationTypeId = this.habilitationType.find((type) => type.id  == this.$route.params.id);
            // console.log(habilitationTypeId, 'hab')
            return habilitationTypeId.nom
        },
        /**
         * parcourt la list des configuraton de veille et retourne celle correspondant à  l'id de la route
         */

        findVeilleConfig() {
            let veilleConfigId = this.veilleConfig.find((e) => e.objet_id  == this.$route.params.id);
            console.log(veilleConfigId, 'veille')
            return veilleConfigId
        }

       
        
    },

    methods: {
        /**
         * charge le personnel habilité en fonction du type d'habilitation renseigné
         * et 
         * t
         * @param   {number}    id  l'id du type d'habilitation
         */
        
        loadPersonelByHab(id) {
            this.pending.habilitation = true;
            
            this.$app.apiGet('v2/controle/habilitation', {
                habilitation_id: id,
            })
            .then((data) =>{
                console.log(data ,'list pers habilité')
                this.listPersonnelHabilite = data;
            })
            .catch(this.$app.catchError).finally(() => this.pending.habilitation = false);

        },

        
         /**
		 * Modifie le format de la date entrée en paramètre et la retourne 
		 * sous le format 01 févr. 2021
		 * @param {string} date 
		 */

		changeFormatDateLit(el) {
			return dateFormat(el);
		},

       

    


        returnName(id){
            // console.log(id, 'id')
            let personnel = this.listActifs.find((e) => e.id == id);
            // console.log(personnel, 'perso');
            if(!personnel) {
                this.pending.agent = true;
                this.$app.apiGet('structurePersonnel/GET/'+id, {
                    environnement: 'private',
                    // personne: id,
                })
                .then((data) =>{
                    let personnel = data;
                    // console.log(personnel.id,personnel.cache_nom, data.cache_nom, 'personnel')
                    let fullName = personnel.cache_nom;
                    return fullName;
                })
                .catch(this.$app.catchError).finally(() => this.pending.agent = false);

                // return 'ce personnel n\'est pas dans la liste'
            }
            else {
                return personnel.cache_nom
            }
            // if(personnel.length > 0){
            //     console.log(personnel, 'personnel0');
            //     // return 'pas de personnel'
            //     return personnel[0].cache_nom;

            // } 
            // else {
            //     console.log(personnel, 'personnelsinonpas trouvé');

            //     return 'pas trouvé';
            // }
        }


    },
    /**
     * Lorsque la route interne est mise à jour, le nouvel élément doit être chargé.
     */
     beforeRouteUpdate(to) {
        if (to.params.id != this.$route.params.id) {
            
            this.loadPersonelByHab(to.params.id);

        }
    },


    beforeMount() {

        /**
         * charge la list des personnels habilités correspondant à l'id du type d'habilitation
         */
        this.loadPersonelByHab(this.$route.params.id);

    }

    
}
</script>