<template>
    <div class="container py-2 px-2">
        <Spinner v-if="pending.veille"></Spinner>
        <template v-else>
        
            <template v-if="isCurrentViewIndex">
                <h1 class="fs-3 my-3">Suivi des habilitations</h1>
                
                <div class="card my-2">
                    <div class="card-body">
                        <div class="row align-items-center">
                            <div class="col-md-6 col-lg-4 col-12">
                                <img src="../assets/suivihabilitations.jpg" class="img-fluid" alt="veille sur habilitation" />
                            </div>
                            <div class="col display-6 ">
                                <p class="fs-4 text-start">Utilisez cet espace pour suivre les habilitations de vos opérateurs</p>
                                <ul>
                                    <li class="fs-5 mb-2">Sélectionnez un opérateur dans la liste de gauche pour visualiser les habilitations concernées </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div> 
            </template>
            
            <RouterView />
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
        
        isCurrentViewIndex() {
            return this.$route.name == "Operateur";
        }
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
        
        /**
         * parcourt la list des types d'habilitation en fonction de l'id entré en paramètre
         * et retourne le nom de l'habilitation
         */
        filterhabilitationType(id) {
           let habilitationType = this.habilitationType.find((type) => type.id  == id);
           return habilitationType.nom
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