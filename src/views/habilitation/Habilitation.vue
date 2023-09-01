<template>
    <div class="container py-2 px-2">
        <Spinner v-if="pending.veille"></Spinner>

        <template v-else>  
            <h1 class="fs-3 my-3">Veille par habilitations</h1>

            <div class="card my-2">
                <div class="card-body">
                    <div class="row align-items-center">
                        <div class="col-md-6 col-lg-4 col-12">
                            <img src="../../assets/veilleHabilitation.jpg" class="img-fluid" alt="veille sur habilitation" />
                        </div>

                        <div class="col display-6 ">
                            <p class="fs-4 text-start">
                                Utilisez cet espace pour veiller les contrôles par habilitations
                            </p>

                            <ul>
                                <li class="fs-5 mb-2">
                                    Sélectionnez une habilitation dans la liste de gauche pour visualiser les opérateurs concernés 
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </template>
    </div>
</template>

<script>
import {mapState} from 'vuex';
import {dateFormat} from '../../js/collecte';
import Spinner from '../../components/pebble-ui/Spinner.vue';


export default {
    components: { Spinner },

    data(){
        return {
            pending: {
                veille: false,
                listControlTodo :false
            },
            listControl: true,
            listControlTodo : [],
            average: 2.5,
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