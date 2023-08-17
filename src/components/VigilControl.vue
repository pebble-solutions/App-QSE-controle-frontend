<template>
        <spinner v-if="pending.control"></spinner>
        <template v-else>
            <div class="list-group" v-if="listControl.length">
                <div class="list-group-item" v-for="control in listControl" :key="control.id">
                    <div class="row align-items-center">
        
                        <div class="col-3">
                            {{returnName(control)}}
                            <!-- - dernier contrôle le {{changeFormatDateLit(control.date_last)}}  -->
                        </div>
                        <div class="col">
                            <progress-bar :dd="control.date_last" :df="delay(control.date_last)"></progress-bar>
            
                        </div>
                        <div class="col-auto text-end">
                            <router-link :to="'/habilitationHab/'+this.$route.params.id+'/new/'+control.habilitation_id+'/'+idForm+'/'+control.personnel_id" v-slot="{navigate, href}">
                                <a :href="href"  @click="navigate" class="btn btn btn-sm btn-outline-primary">
                                    <i class="bi bi-plus" ></i>
                                    <span class="d-none d-md-inline ms-1">
                                        Programmer
                                    </span>
                                </a>
                            </router-link>
                            <!-- <small>{{control}}</small>   -->
                        </div>
                    </div>
                </div>
            </div>
            <alert-message v-else class="m-3" variant="warning" icon="bi-exclamation-square">Il n'y pas de personnel à contrôler pour cette habilitation</alert-message>

        </template>


</template>
<script>
import { mapState } from 'vuex';
import { dateFormat } from '../js/collecte';
import ProgressBar from './ProgressBar.vue';
import AlertMessage from './pebble-ui/AlertMessage.vue';
import { AssetsAssembler } from '../js/app/services/AssetsAssembler';
import Spinner from '../components/pebble-ui/Spinner.vue';
import { toSqlDate } from '../js/date';


export default{
    props: {
        idVeille:{
            type: Number,
            required: true
        },
        idForm: {
            type:Number,
            required: true
        }
    },

    components: {ProgressBar, AlertMessage, Spinner}, //RouterLink

    computed: {
        ...mapState(['habilitationType','listActifs','veilleConfig'])
    },

    data() {
        return {
            pending: {
                control: false,
            },
            listControl:[],
        }

    },
    watch: {
        idVeille() {
            this.loadControlTodo();
        }
    },

    methods: {
        /**
         * charge les contrôles à réaliser pour l'id veille renseignée via l'API
         */
        loadControlTodo() {
            this.pending.control = true;

            this.$app.apiGet('v2/controle/veille/'+this.idVeille+'/todo', {CSP_min: 50, CSP_max: 600})
            .then(async (data) => {
                let assembler = new AssetsAssembler(data);
                await assembler.joinAsset(this.$assets.getCollection('personnels'), 'personnel_id', 'personnel');
                this.listControl = assembler.getResult();
            })
            .catch(this.$app.catchError).finally(() => this.pending.control = false);

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
         * @param {object}  control objet contenant cle personnel et personnel_id
         * 
         * @return {string}
         */
        returnName(control){
            if (!control.personnel) {
                return control.personnel_id ? `Personnel non trouvé ${control.personnel_id}` : `Personnel non défini`; 
            }
            return control.personnel.cache_nom;
        },

        
        /**
         * return la date de l'expiration du délai de veille (+180j) à partir de la date du dernier contrôle
         * @param {date} date la date du dernier contôle réalise
         */
        delay(date){
            let dd = new Date(date);

            dd.setDate(dd.getDate()+180);
            
            return toSqlDate(dd);
            

        }

    },

    mounted(){
        this.loadControlTodo();
    }
}

</script>