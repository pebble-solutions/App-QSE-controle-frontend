<template>
    <div class="container py-2 px-2">
        <Spinner v-if="pending.veille"></Spinner>
        <template v-else>
            
        <h1 class="fs-3 my-3">Veille par habilitations</h1>
        
            <div class="card my-2">
                <div class="card-body">
                    <div class="row align-items-center">
                        <div class="col-md-6 col-lg-4 col-12">
                            <img src="../assets/veilleHabilitation.jpg" class="img-fluid" alt="veille sur habilitation" />
                        </div>
                        <div class="col display-6 ">
                            <p class="fs-4 text-start">Utilisez cet espace pour veiller les contrôles par habilitations</p>
                            <ul>
                                <li class="fs-5 mb-2">Sélectionnez une habilitation dans la liste de gauche pour visualiser les opérateurs concernés </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>  
            
            <!-- <div v-if="veilleConfig" class="my-4">
                <h3>Configuration des veilles</h3>
                <div class="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
                    <div class="col" v-for="veille in veilleConfig" :key=veille.id>
                        <div class="card" >
                            <div class="card-header">
                             <span class="me-1">{{ veille.nom}}</span><span class="fw-lighter">Veille #{{ veille.id }}</span> 
                            </div>
                            <div class="card-body">
                                <div class="me-3">pas de {{ veille.control_step}} jours </div>
                                <div class="me-3">taux de  {{ veille.control_rate }}% </div>
                                <button class="btn btn-outline-primary float-end" @click.prevent = configVeille(veille.id)>Modifier</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div> -->
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
            </div> -->
        </template>
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
         * envoie une requete de modification de la veille
         * @param {number} id id de la veille à configurer
         */

         configVeille(id) {
            alert("souhaitez-vous modifier la veille #"+id)
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
        

    },
    
}
</script>