<template>
    <div class="container py-2 px-2">
        <Spinner v-if="pending.veille"></Spinner>
        <template v-else>
        <div class="container py-2">
            
            <h1 class="fs-3 my-3">Consultation des contrôles réalisés</h1>
            <div class="card my-2">
                <div class="card-body">
                    <div class="row align-items-center">
                        <div class="col-md-6 col-lg-4 col-12">
                            <img src="../assets/veilleHabilitation.jpg" class="img-fluid" alt="veille sur habilitation" />
                        </div>
                        <div class="col display-6 ">
                            <p class="fs-4 text-center">Utilisez cet espace pour veiller les contrôles à réaliser</p>
                            <ul>
                                <li class="fs-5 mb-2">Sélectionnez une habilitation dans la liste pour consulter les personnels à contrôler</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>  
        </div>
        
        
    </template>
        
            <!-- <div>
                <img class="img-fluid"  src="../assets/veilleHabilitation.jpg" alt="">
            </div> -->
            <!-- VEILLE{{ veilleConfig }} -->
            
            <!-- <div v-if="listControlTodo">
                <h3>Controles à programmer</h3>
                <div class="list-group" v-for="controlTodo in listControlTodo" :key="controlTodo.habilitation_id" >
                    <div class="list-group-item">
                        <div class="d-flex justify-content-start">
                            <span class="me-4">hab# {{controlTodo.habilitation_id}}</span>
                            <span class="me-4">  {{ filterhabilitationType(controlTodo.habilitation_type_id) }} {{controlTodo.habilitation_type_id}}</span> 
                            <span class="me-4">{{returnName(controlTodo.personnel_id)}}</span>
                            <span class="me-4">dernier contrôle le {{changeFormatDateLit(controlTodo.date_last)}}</span>

                        </div>
                        
                    </div>
                </div>
            </div>
            <AlertMessage v-else>Pas de controle à programmer</AlertMessage> -->
            <!-- <div v-if="veilleConfig" class="list-group">
                <h3>veilles</h3>
                <div class="list-group-item" v-for="veille in veilleConfig" :key=veille.id>
                    #{{ veille.id }} veille {{ veille.nom}} 
                    <button class="btn btn-outline-primary float-end" @click.prevent = loadVeille(veille.id)> charger</button>
                    <div class="">
                        <span class="me-3">pas de {{ veille.control_step}} jours </span>
                        <span class="me-3">taux de  {{ veille.control_rate }}% </span>
                    </div>
                   
                </div>
            </div> -->
           
            
            
            <!-- TABLEAU{{ listControlTodo }} -->
        
    </div>

    
</template>
<script>
import {mapState} from 'vuex';
import Spinner from '../components/pebble-ui/Spinner.vue';
// import AlertMessage from '../components/pebble-ui/AlertMessage.vue';
import {dateFormat} from '../js/collecte';


export default {
    components: {Spinner,},//AlertMessage

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
            // let veille = this.veilleConfig;
            this.$app.apiGet('v2/controle/veille/'+id+'/todo', {
                CSP_min : 50,
                CSP_max :100,
            })
            .then((data) =>{
                if(data.length){
                    this.listControlTodo = this.listControlTodo.concat(data)
                }
                else {
                    confirm('veille à jour')
                }
                // this.listControlTodo.push(data);
            })
            .catch(this.$app.catchError).finally(() => this.pending.listControlTodo = false);
        },
        
        /* parcourt la list des types d'habilitation en fonction de l'id entré en paramètre
        * et retourne le nom de l'habilitation
        */
        filterhabilitationType(id) {
           let habilitationTypeId = this.habilitationType.find((type) => type.id  == id);
           return habilitationTypeId.nom
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
        // returnName(id){
        //     let personnel = this.listActifs.find((e) => e.id == id);
        //     if(!personnel) {
        //         this.pending.agent = true;
        //         this.$app.apiGet('structurePersonnel/GET/'+id, {
        //             environnement: 'private',
        //             // personne: id,
        //         })
        //         .then((data) =>{
        //             let personnel = data;
        //             let fullName = personnel.cache_nom;
        //             return fullName;
        //         })
        //         .catch(this.$app.catchError).finally(() => this.pending.agent = false);

        //         // return 'ce personnel n\'est pas dans la liste'
        //     }
        //     else {
        //         return personnel.cache_nom
        //     }
            
        // }

    },
    
}
</script>