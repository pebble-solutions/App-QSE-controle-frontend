<template>
    
    <div class="container py-2 px-2">
        <spinner v-if="pending.habilitation"></spinner>
        <template v-else>
            <h2>{{ filterhabilitationType}} </h2>
            <br>
            <h3> Personnels à contrôler</h3>
            <div class="list-group">
                <div class="list-group-item">
                    échéance - nom de l'agent à contrôler - motif - bouton action
                </div>
            </div>
            <div></div>
            <h3>Personnels habilités</h3>
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
                        <span class="me-2">échéance le   {{ changeFormatDateLit(carac.df)   }}</span>
                    </div>
                    <progress-bar
                    :dd="carac.dd"
                    :df="carac.df"
                    ></progress-bar>
                    <!-- <div class="progress" role="progressbar" aria-label="Example with label" aria-valuenow="25" aria-valuemin="0" aria-valuemax="100">
                         <div class="progress-bar" style="width: 25%">25%</div>
                    </div> -->

                </div>
            </div>
           


        </template>
    </div>
</template>
<script>
import { mapState } from 'vuex';
import {dateFormat} from '../js/collecte';
import ProgressBar from '../components/ProgressBar.vue';

import Spinner from '../components/pebble-ui/Spinner.vue';

export default {
    components: {Spinner, ProgressBar},
    


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
        ...mapState(['habilitationType', 'listActifs']),

        /**
         * filtre la list des types d'habilitation en fonction de l'id concerné
         * et retourne le type d'habilitation
         */
        filterhabilitationType() {
            let habilitationTypeId = this.habilitationType.find((type) => type.id  == this.$route.params.id);
            return habilitationTypeId.nom
        },

       
        
    },

    methods: {
        /**
         * charge le personnel habilité en fonction du type d'habilitation recherché
         * et l'enregistre dans le store
         * 
         * @param   {number}    id  l'id du type d'habilitation
         */
        
        loadPersonelByHab(id) {
            this.pending.habilitation = true;
            
            this.$app.apiGet('v2/controle/habilitation', {
                habilitation_id: id,
            })
            .then((data) =>{
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
                    console.log(personnel.id,personnel.cache_nom, data.cache_nom, 'personnel')
                    let fullName = data.cache_nom;
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
        if (to.params.id != this.habilitation_id) {
            
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