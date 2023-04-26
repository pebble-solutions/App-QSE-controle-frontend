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
         * filtre la list des types d'habilitation en fonction de l'id conserné
         * et retourne le type d'habilitation
         */
        filterhabilitationType() {
            console.log (this.habilitationType, 'nom')
            let habilitationTypeId = this.habilitationType.filter((type) => type.id  == this.$route.params.id);
            console.log(habilitationTypeId, habilitationTypeId[0], 'les deux')
            return habilitationTypeId[0]
        },

        list() {

            let agentHab = this.listPersonnelHabilite;
            agentHab.forEach(element => {
                let nom  = element.personnel_id;
                return nom
            });

            let agent = this.listActifs

            console.log(agent, agentHab, 'perso')
            return agent , agentHab  ;
               
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
            // console.log(habilitationId);
            console.log(this.$route.params.id, 'habilitation id')
            
            this.$app.apiGet('v2/controle/habilitation', {
                habilitation_id: id,
            })
            .then((data) =>{
                console.log(data, 'listPersonnel');
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
                let nom = agent.id;
                console.log(nom,'search')
                return nom
            });
           
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
        // console.log(this.$route.params.id)
        this.loadPersonelByHab(this.$route.params.id);

    }

    
}
</script>