<template>
    
    <div class="container py-2 px-2">
        <spinner v-if="pending.habilitation"></spinner>
        <template v-else>
            <h2>{{ filterhabilitationType.nom }} </h2>
            <br>
            <h3> Personnels à contrôler</h3>
            <div></div>
            <h3>Personnels habilités</h3>
            <div class="list-group" >
                <div class="list-group-item" v-for="carac in listPersonnelHabilite" :key="carac.id">

                    <div class="d-flex justify-content-between">
                        <span class="me-2">{{ carac.personnel_id }}</span>
                        <span class="me-2">habilité  du {{ changeFormatDateLit(carac.dd) }} au  {{ changeFormatDateLit(carac.df)   }}</span>
                    </div>
                    {{ list }}
                    <progress-bar
                    :dd="carac.dd"
                    :df="carac.df"
                    ></progress-bar>
                    <!-- <div class="progress" role="progressbar" aria-label="Example with label" aria-valuenow="25" aria-valuemin="0" aria-valuemax="100">
                         <div class="progress-bar" style="width: 25%">25%</div>
                    </div> -->

                </div>
                
            </div>
            <!-- <div> {{ listPersonnelHabilite }} </div> -->
            <br>
            <br><br>
           list {{ list }}
           searchName {{ searchName() }}

           {{ this.nom }}
        </template>
    </div>
</template>
<script>
import { mapState } from 'vuex';
import {dateFormat} from '../js/collecte';
import ProgressBar from '../components/ProgressBar.vue';

import Spinner from '../components/pebble-ui/Spinner.vue';
import ConsultationProjetCollecte from './ConsultationProjetCollecte.vue';

export default {
    components: {Spinner, ProgressBar},

    data() {
        return {
            pending: {
                habilitation: false
            },
            listPersonnelHabilite : 'default',
            nom:''
        }
    },

    computed: {
        ...mapState(['habilitationType', 'listActifs']),

        /**
         * filtre la list des types d'habilitation en fonction de l'id concerné
         * et retourne le type d'habilitation
         */
        filterhabilitationType() {
            let habilitationTypeId = this.habilitationType.filter((type) => type.id  == this.$route.params.id);
            return habilitationTypeId[0]
        },

        returnName(id) {
            
            let personelId = id;
            let listAgents = this.listActifs;
            listAgents.forEach(e =>{
                if(e.id === personelId){
                    return e.cache_nom
                }
            })


               
            }
        
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
            // let habilitationId = id;
            
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

        searchName(){
        this.listActifs.forEach(agent => {
                let nom = agent.cache_nom;
                console.log(nom,'nom')
            });
           console.log(this.nom)
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