<template>
    <div class="list-group" v-if="idVeille">
        veille n° {{ idVeille }} formulaire {{ idForm }}
        <div class="list-group-item" v-for="control in listControl" :key="control.id">
            
            <div class="row" >
                <div class="d-flex align-items-center justify-content-between">
                    <div class="col-3 me-2" v-if="returnName(control.personnel_id)">
                        {{returnName(control.personnel_id)}}
                        <!-- - dernier contrôle le {{changeFormatDateLit(control.date_last)}}  -->
                    </div>
                    
                    <div class="col-6 me-2">
                        <progress-bar :dd="new Date(control.date_last)" :df="delay(control.date_last)"></progress-bar>
                    </div>
                    <div class="col me-2">
                        <router-link :to="'/habilitationHab/'+this.$route.params.id+'/new/'+control.habilitation_id+'/'+idForm+'/'+control.personnel_id" v-slot="{navigate, href}">
                            <a :href="href"  @click="navigate" class="btn btn btn-sm btn-outline-primary">
                                <i class="bi bi-plus" ></i>
                                <span class="d-none d-md-inline ms-1">
                                    Programmer
                                </span>
                            </a>
                        </router-link>
                        
                        <small>{{control}}</small>  
                    </div>
                    
                </div>
                <!-- <button class="btn btn-outline-primary" @click.prevent="program(control.personnel_id, control.habilitation_id)">
                    <span class="d-none d-md-block">Programmer</span>
                </button> -->


            </div>
        </div>
    </div>
</template>
<script>
import { mapState } from 'vuex';
import { dateFormat } from '../js/collecte';
import ProgressBar from './ProgressBar.vue';


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

    components: {ProgressBar, }, //RouterLink

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

    methods: {
        /**
         * charge les contrôles à réaliser pour l'id veille renseignée
         * 
         * @param   {number}    id  l'id de la veille
         * 
         */
        loadControlTodo(id) {
            this.pending.control = true;

            this.$app.apiGet('v2/controle/veille/'+id+'/todo', {CSP_min: 50, CSP_max: 100})
            .then((data) =>{
                // console.log(data)
                this.listControl = data;
                // console.log(this.listControl, 'list')
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

        returnName(id){
            let personnel = this.listActifs.find((e) => e.id == id);
            if(personnel){
                return personnel.cache_nom
            }
            else return id            
           
        },

        program(id, hab_id){
            console.log(id,hab_id, 'collecte modal')
            // confirm('programmer un nouveau contrôle de '+id+'?');
            // this.$router.push("/habilitationHab/"+this.$route.params.id+'/new', { veille: false,
            //     collecte: {
            //         formulaire: null,
            //         cible_personnel: id,
            //         date: null,
            //         enqueteur_personnel: null,
            //         environnement: "private",
            //         tlc: 'CharacteristicPersonnel',
            //         tli: hab_id
            //     },  
            // });
            // this.$router.push({name: 'NewCollecteVeille', 
            // params:{
            //     collecte: {
            //         formulaire: null,
            //         cible_personnel: id,
            //         date: null,
            //         enqueteur_personnel: null,
            //         environnement: "private",
            //         tlc: 'CharacteristicPersonnel',
            //         tli: hab_id
            //      }
            // });


        }, 

        delay(date){
            // console.log(date, 'dd')
            let dd = new Date(date);

            dd.setDate(dd.getDate()+180);
            // console.log(dd, typeof dd)
            
            return dd
            

        }

    },

    // beforeMount() {

    //     this.loadControlTodo(idVeille);
    // }
    mounted(){
        this.loadControlTodo(this.idVeille)
    }
}

</script>