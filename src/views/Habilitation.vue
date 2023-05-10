<template>
    <div class="container py-2 px-2">
        <Spinner v-if="pending.veille"></Spinner>
        <template v-else>
            
            <h2 class="my-3">
                Veille habilitation
            </h2>
            <div v-if="veilleConfig">
                <h3>Configurations</h3>
                <div class="list-group" v-for="veille in veilleConfig" :key = veille.id>
                    <div class="list-group-item">
                        <div class="d-flex justify-content-between align-items-center">
                            <span>{{ veille.nom }} </span>
                            <div class="d-flex justify-content-between align-items-center">
                                <span class="me-3">pas de {{ veille.control_step}} jours </span>
                                <span class="me-3">taux de  {{ veille.control_rate }}% </span>
                            </div>
                        </div>
                        <!-- <button class="float-end">Modifier</button> -->
                    </div>
                </div>
            </div>
            <div v-if="listControlTodo">
                <h3>Controles à programmer</h3>
                <div class="list-group" v-for="controlTodo in listControlTodo" :key="controlTodo.habilitation_id" >
                    <div class="list-group-item">
                        <div class="d-flex justify-content-start">
                            <span class="me-4">veille# {{controlTodo.habilitation_id}}</span>
                            <span class="me-4">hablitation : {{controlTodo.habilitation_type_id}}</span> 
                            <span class="me-4">{{returnName(controlTodo.personnel_id)}}</span>
                            <span class="me-4">dernier contrôle le {{changeFormatDateLit(controlTodo.date_last)}}</span>

                        </div>
                        
                    </div>
                </div>
            </div>
            <AlertMessage v-else>Pas de controle à programmer</AlertMessage>
            <div class="list-group">
                <h3>veilles à 90 jours de l'échéance</h3>
                <div class="list-group-item" v-for="veille in veilleConfig" :key=veille.id>
                    {{ veille.nom}} {{ veille.id }}
                    <button class="btn btn-outline-primary float-end" @click.prevent = loadVeille(veille.id)> charger</button>
                    <!-- <div class="list-group" v-for="controlTodo in listControlTodo" :key="controlTodo.habilitation_id" >
                        <div class="list-group-item">
                            <span class="me-4">{{controlTodo.personnel_id}}perso</span>
                            <span class="me-4">{{controlTodo.habilitation_type_id}}habType</span>
                            <span class="me-4">{{controlTodo.habilitation_id}}HabId</span>
                            <span class="me-4">{{controlTodo.date_last}}date</span>
                        </div>
                    </div> -->
                </div>
            </div>
            
            <div>
                <img class="img-fluid"  src="../assets/programmationKN.png" alt="">
            </div>
            
            TABLEAU{{ listControlTodo }}
            VEILLE CONFIG{{ veilleConfig }}
        </template>
    </div>

    
</template>
<script>
import {mapState} from 'vuex';
import Spinner from '../components/pebble-ui/Spinner.vue';
import AlertMessage from '../components/pebble-ui/AlertMessage.vue';
import {dateFormat} from '../js/collecte';


export default {
    components: {Spinner,AlertMessage},

    data(){
        return {
            pending: {
                veille: false,
                listControlTodo :false
            },
            listControl: true,
            listControlTodo : []
        }
    },
    computed: {
        ...mapState(['habilitationType','listActifs','veilleConfig']),

         /* parcourt la list des types d'habilitation en fonction de l'id entré en paramètre
         * et retourne le nom de l'habilitation
         */
         filterhabilitationType(id) {
            let habilitationTypeId = this.habilitationType.find((type) => type.id  == id);
            // console.log(habilitationTypeId, 'hab')
            return habilitationTypeId.nom
        },
        
        
    },
    
    methods:{
        /**
         * charge les veilles à réaliser en fonction d'un id de veille
         * 
         * @param {Number} id id de la veille
         * 
         */
        loadVeille(id){
            this.pending.listControlTodo = true
            let veille = this.veilleConfig;
            console.log(veille, typeof veille, 'veille')
            console.log(veille, 'veilleConfig')
            this.$app.apiGet('v2/controle/veille/'+id+'/todo', {
                CSP_min : 50,
                CSP_max :100,
            })
            .then((data) =>{
                console.log(data, 'data');
                if(data.length){
                    this.listControlTodo = this.listControlTodo.concat(data)
                    console.log(this.listControlTodo, 'listControl')
                }
                else {
                    confirm('pas de contrôle à programmer sous 90 jours')
                }
                // this.listControlTodo.push(data);
            })
            .catch(this.$app.catchError).finally(() => this.pending.listControlTodo = false);
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
         * retourne le nom d'un personnel en fonction de l'id
         * s'il ne trouve pas envoie une requête 
         * @param {Number} id 
         */
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
    
}
</script>