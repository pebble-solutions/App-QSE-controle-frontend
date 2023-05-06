<template>
    <div class="list-group" v-if="idVeille">
        veille n° {{ idVeille }}
        <div class="list-group-item" v-for="control in listControl" :key="control.id">
            
            <div class="d-flex justify-content-between align-items-center" >
                <div class="d-flex justify-content-between align-items-center w-100 me-4" >
                        
                    <span v-if="returnName(control.personnel_id)">
                        {{returnName(control.personnel_id)}}
                        <!-- - dernier contrôle le {{changeFormatDateLit(control.date_last)}}  -->
                    </span>
                    <span v-else> {{ control.personnel_id }} 
                        <!-- dernier contrôle le {{changeFormatDateLit(control.date_last)}} -->
                    </span>
                    <progress-bar :dd="control.date_last" :df="delay(control.date_last)"></progress-bar>
                </div>

                <button class="btn btn-outline-primary" @click.prevent="program(returnName(control.personnel_id))">
                    <span class="d-none d-md-block">Programmer</span>
                </button>
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
        }
    },

    components: {ProgressBar},

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

            this.$app.apiGet('v2/controle/veille/'+id+'/todo', {CSP_min: 0, CSP_max: 100})
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
            
            return personnel.cache_nom
           
        },

        program(nom){
            // console.log(nom, 'formulaire')
            confirm('programmer le contrôle de '+nom);
        }, 

        delay(date){
            // console.log(date, 'dd')
            const dd = new Date(date);

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