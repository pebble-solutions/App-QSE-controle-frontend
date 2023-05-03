<template>
    <div class="list-group">
        veille n° {{ idVeille }}
        <div class="list-group-item" v-for="control in listControl" :key="control.id">
            
            <div class="d-flex justify-content-between align-items-center" >
                {{ control.personnel_id }}
                <div>
                    {{returnName(control.personnel_id)}}
                </div>
                <div>
                    contrôlé le {{changeFormatDateLit(control.date_last)}} 

                </div>
                <button class="btn btn-outline-primary" @click.prevent="program(returnName(control.personnel_id))">Programmer</button>
            </div>
        </div>
    </div>
</template>
<script>
import { mapState } from 'vuex';
import { dateFormat } from '../js/collecte';

export default{
    props: {
        idVeille:{
            type: Number,
            required: true
        }
    },
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

            this.$app.apiGet('v2/controle/veille/'+id+'/todo', {CSP_min: 0, CSP_max: 500})
            .then((data) =>{
                console.log(data)
                this.listControl = data;
                console.log(this.listControl, 'list')
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
            // if(!personnel) {
            //     this.pending.agent = true;
            //     this.$app.apiGet('structurePersonnel/GET/'+id, {
            //         environnement: 'private',
            //         // personne: id,
            //     })
            //     .then((data) =>{
            //         let personnel = data;
            //         console.log(personnel.id,personnel.cache_nom, data.cache_nom, 'personnel')
            //         let fullName = data.cache_nom;
            //         return fullName;
            //     })
            //     .catch(this.$app.catchError).finally(() => this.pending.agent = false);
            // }
            // else {
            // }
            return personnel.cache_nom
           
        },

        program(nom){
            console.log(nom, 'formulaire')
            confirm('programmer le contrôle de '+nom);
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