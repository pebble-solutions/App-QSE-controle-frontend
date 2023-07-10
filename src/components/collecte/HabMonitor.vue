<template>
    <div class="row">
        <div class="col-md-4">
            <div class="card" v-for="hab in habilitationPerso" :key="hab.id">
                habilitation #{{ hab.id }} 
                <ProgressBar :dd="hab.dd" :df="hab.df"></ProgressBar>
            </div>

        </div>
        <div class="col-md-8">
            controles
            <div class="d-flex justify-content-start align-items-center">
                
                <div class="d-flex justify-content-start me-2" v-for=" control in listControlDone" :key="control.id">
                    <span class="me-1">#{{ control.id }} : </span>
                    <span   class="badge" :class="classNameFromSAMI(control.result_var)"> {{control.result_var}}</span>
                </div>
    
            </div>

       </div>
    </div>
    
            
</template>
<script>
// import ProgressBar from '../ProgressBar.vue';
import { dateFormat } from '../../js/collecte';
import ProgressBar from '../ProgressBar.vue';
import { classNameFromSAMI } from '../../js/collecte';

export default {
    components: { ProgressBar },

    props: {
        habId: Number,
    },
   
    data() {
        return {
            pending: {
                control: false
            },
            listControlDone: [],
            habilitationPerso:{},
        }
    },

    methods: {

       

        /**
         * Envoie une requête pour charger la liste des collectes 
         * en fonction de l'id fourni
         * @param {Number} id du 
         */
         loadCollecte(id) {
            this.pending.control=true;
            this.$app.apiGet('data/GET/collecte', {
                tli : id,
                done: 'OUI'
            })
            .then((data) => {
                this.listControlDone = data;
            })
            .catch(this.$app.catchError).finally(() => this.pending.control= false);
        },

         /**
         * Envoie une requête pour charger l'habilitation
         * en fonction de l'id fourni
         * @param {Number} id du 
         */
         loadHabilitation(id) {
            this.pending.control=true;
            this.$app.apiGet('v2/controle/habilitation', {
                id : id,
                
            })
            .then((data) => {
                this.habilitationPerso = data;
            })
            .catch(this.$app.catchError).finally(() => this.pending.control= false);
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
         * Retourne une classe CSS par rapport à une réponse S A M I
         * 
         * @param {string} reponse S A M I
         * 
         * @return {string}
         */
		classNameFromSAMI(reponse) {
            return classNameFromSAMI(reponse);
        },

       
    },

    

    mounted () {
        /**
         * charge la liste des controls
         */
        this.loadCollecte(this.habId);
        this.loadHabilitation(this.habId)
    }

}
</script>