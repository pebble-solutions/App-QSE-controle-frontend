<template>
    
    <div class="container py-2 px-2">
        <!-- <spinner v-if="pending.habilitation"></spinner> -->
        

            <div v-if="findVeilleConfig">
                <h2 class="mb-3">
                    <span class="me-3 fw-lighter"># {{ findVeilleConfig.id }} </span>
                    Veille {{ filterhabilitationType}}
                </h2>
                <div class="row">
                        <h3>Échéances contrôles à programmer</h3>
                        <vigil-control v-if="findVeilleConfig.id" :idVeille="findVeilleConfig.id" :idForm="returnFormulaireId"></vigil-control>
                </div>
            </div>
            <alert-message v-else class="m-3" variant="warning" icon="bi-exclamation-square">Il n'y pas de veille configurée pour cette habilitation </alert-message>
            <!-- <router-view></router-view> -->
            <hr>
            <div class="row">
                <div class="col-12 col-md-6">
                    <h3>Liste des personnels habilités</h3>
                    <div v-if="listPersonnelHabilite">
                    
                        <div  class="list-group" v-for="perso in listPersonnelHabilite" :key="perso.id">
                            <router-link :to="'/habilitationHab/'+$route.params.id+'/'+perso.id" custom v-slot="{navigate,href,isActive}">
                                <a :href="href" @click="navigate" :class="{'active': isActive}" class="list-group-item list-group-item-action mb-2">
                                    <div class="d-flex justify-content-between">
                                        <span>
                                            {{ returnName(perso) }}
                                        </span>
                                        <span>
                                            {{ perso.id }}
                                        </span>
                                        <span>
                                            échéance le {{ changeFormatDateLit(perso.df) }}
                                        </span>
                                    </div>
                                
                                    
                                    <progress-bar
                                    :dd="new Date(perso.dd)"
                                    :df="new Date(perso.df)"
                                    ></progress-bar>
                                    <!-- <button class="btn btn-sm btn-outline-primary" @click.prevent="loadCollecte(perso.id)">
                                        controles
                                    </button> -->
                                </a>
                            </router-link>
                        </div>
                    </div>
                </div>
                        <div class="col">
                            <router-view></router-view>
                        </div>
                
                    
            </div>
        
    </div>
</template>
<script>
import { mapState } from 'vuex';
import {dateFormat} from '../js/collecte';
import VigilControl from '../components/VigilControl.vue';
import AlertMessage from '../components/pebble-ui/AlertMessage.vue';
import { AssetsAssembler } from '../js/app/services/AssetsAssembler';
import ProgressBar from '../components/ProgressBar.vue';

// import ProgressBar from '../components/ProgressBar.vue';
// import Spinner from '../components/pebble-ui/Spinner.vue';

export default {
    components: { AlertMessage, VigilControl, ProgressBar }, // Spinner
    


    data() {
        return {
            pending: {
                habilitation: false,
                agent:false,
            },
            listPersonnelHabilite : '',
            personnel:'',
            listCollecte:'',
            listControl:''
        }
    },

    computed: {
        ...mapState(['habilitationType', 'listActifs','veilleConfig']),

        /* parcourt la list des types d'habilitation en fonction de l'id de la route
         * et retourne le nom de l'habilitation
         */
        filterhabilitationType() {
            let habilitationTypeId = this.habilitationType.find((e) => e.id  == this.$route.params.id);
            return habilitationTypeId.nom
        },

        /**
         * parcourt la list des configuraton de veille et retourne celle correspondant à  l'id de la route
         */
        findVeilleConfig() {
            let veilleConfigId = this.veilleConfig.find((v) => v.objet_id  == this.$route.params.id);
            return veilleConfigId
        },
        returnFormulaireId(){
            let formulaireId = this.veilleConfig.find((f) => f.objet_id == this.$route.params.id);
            return formulaireId.formulaire_id

        }

        
    },

    methods: {
        /**
         * Retourne une classe CSS par rapport à une réponse S A M I
         * 
         * @param {string} reponse S A M I
         * 
         * @return {string}
         */
		classNameFromSAMI(reponse) {
            if (typeof reponse === 'string') {
                if (reponse.toLowerCase() == 's') return 'text-bg-success';
                else if (reponse.toLowerCase() == 'a') return 'text-bg-primary';
                else if (reponse.toLowerCase() == 'm') return 'text-bg-warning';
                else if (reponse.toLowerCase() == 'i') return 'text-bg-danger';
            }
            return 'text-bg-secondary';
        },
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
                active: 1,
            })
            .then(async (data) =>{
                let assembler =new AssetsAssembler(data);
                await assembler.joinAsset(this.$assets.getCollection('personnels'), 'personnel_id', 'personnel');
                this.listPersonnelHabilite = assembler.getResult();
            })
            .catch(this.$app.catchError).finally(() => this.pending.habilitation = false);

        },
         /**
         * Envoie une requête pour charger la liste des collectes 
         * en fonction de l'id fourni
         * @param {Number} id de l'habilitation du personnel
         */
         loadCollecte(id) {
            this.pending.agent =true;
            this.$app.apiGet('data/GET/collecte', {
                tli : id,
                // done: 'OUI'
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
         * retourne le nom du personnel ou bine personnel non trouvé
         * 
         * @param {object}  perso objet contenant cle personnel et personnel_id
         * 
         * @return {string}
         */
         returnName(perso){
            if (!perso.personnel) {
                return perso.personnel_id ? `Personnel non trouvé ${perso.personnel_id}` : `Personnel non défini`; 
            }
            return perso.personnel.cache_nom;
        },
        
        
        
        
        
    },
    beforeRouteUpdate(to) {
        if(to.params.id != this.habilitation_type_id) {
            this.loadPersonelByHab(to.params.id)
        }
    },
    mounted(){
        this.loadPersonelByHab(this.$route.params.id)
    }

   
  
    

    
}
</script>