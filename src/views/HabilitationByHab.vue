<template>
    
    <div class="container py-2 px-2">
        <template v-if="findVeilleConfig">
            <h2 class="mb-3">
                <span class="me-3 fw-lighter"># {{ findVeilleConfig.id }} </span>
                Veille {{ filterhabilitationType}}
            </h2>
            <vigil-control v-if="findVeilleConfig.id" :idVeille="findVeilleConfig.id" :idForm="returnFormulaireId"></vigil-control>
        </template>
        <alert-message v-else class="m-3" variant="warning" icon="bi-exclamation-square">Il n'y pas de veille configurée pour cette habilitation </alert-message>
        <!-- {{ veilleConfig }} -->
        {{ listPersonnelHabilite }}
        <router-view></router-view>
    </div>
</template>
<script>
import { mapState } from 'vuex';
import {dateFormat} from '../js/collecte';
import VigilControl from '../components/VigilControl.vue';
import AlertMessage from '../components/pebble-ui/AlertMessage.vue';

// import ProgressBar from '../components/ProgressBar.vue';
// import Spinner from '../components/pebble-ui/Spinner.vue';

export default {
    components: { AlertMessage, VigilControl}, //ProgressBar, Spinner
    


    data() {
        return {
            pending: {
                habilitation: false,
                agent:false,
            },
            listPersonnelHabilite : 'default',
            personnel:'',
            listCollecte:''
        }
    },

    computed: {
        ...mapState(['habilitationType', 'listActifs','veilleConfig']),

        /* parcourt la list des types d'habilitation en fonction de l'id de la route
         * et retourne le nom de l'habilitation
         */
        filterhabilitationType() {
            let habilitationType = this.habilitationType.find((e) => e.id  == this.$route.params.id);
            return habilitationType.nom
        },

        /**
         * parcourt la list des configuraton de veille et retourne celle correspondant à  l'id de la route
         */
        findVeilleConfig() {
            let veilleConfig = this.veilleConfig.find((v) => v.objet_id  == this.$route.params.id);
            return veilleConfig
        },
        returnFormulaireId(){
            let formulaire = this.veilleConfig.find((f) => f.objet_id == this.$route.params.id);
            return formulaire.formulaire_id

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
                habilitation_type_id: id,
            })
            .then((data) =>{
                this.listPersonnelHabilite = data;
            })
            .catch(this.$app.catchError).finally(() => this.pending.habilitation = false);

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
                this.listCollecte = data;
            })
            .catch(this.$app.catchError).finally(() => this.pending.agent = false);
        },

        
         /**
		 * Modifie le format de la date entrée en paramètre et la retourne 
		 * sous le format 01 févr. 2021
		 * @param {string} date 
		 */

		changeFormatDateLit(el) {
			return dateFormat(el);
		},

        /**
         * charge les contrôles à réaliser pour l'id veille renseignée via l'API
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

       

    


        returnName(id){
            let personnel = this.listActifs.find((e) => e.id == id);
            if(!personnel) {
                this.pending.agent = true;
                this.$app.apiGet('structurePersonnel/GET/'+id, {
                    environnement: 'private',
                    // personne: id,
                })
                .then((data) =>{
                    let personnel = data;
                    let fullName = personnel.cache_nom;
                    return fullName;
                })
                .catch(this.$app.catchError).finally(() => this.pending.agent = false);

                // return 'ce personnel n\'est pas dans la liste'
            }
            else {
                return personnel.cache_nom
            }
            
        }


    },
    
    

    
}
</script>