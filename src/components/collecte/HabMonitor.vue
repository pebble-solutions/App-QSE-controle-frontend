<template>
    <div class="list-group">
        <h3>
            <span class="fw-lighter" >#{{habId}}</span>
            hab ........
            
        </h3>
        <div class="row">
            <div class="col">
                <div class="card mb-2">
                    <!-- échéance habilitation: {{formatDayDate(hab.df)  }}
                        <progress-bar :dd=hab.dd :df=hab.df></progress-bar> -->
                    </div>
                    
                </div>
                <div class="col">
                <div class="card d-flex justify-content-start mb-2" v-for=" control in listControlDone" :key="control.id">
                        <span class="badge text-bg-success me-1">{{ control.result_var }}</span>
                </div>
                
            </div>
            <div class="col">
                <div class="card mb-2">
                    <!-- échéance controle:  {{formatDayDate(control.delay)  }}
                    <progress-bar :dd="control.date_last" :df="control.delay"></progress-bar> -->
                </div>
                
            </div>
            
        </div>
    </div>
</template>
<script>
// import ProgressBar from '../ProgressBar.vue';
import { dateFormat } from '../../js/collecte';

export default {
    // components: { ProgressBar },

    props: {
        habId: Number,
    },
   
    data() {
        return {
            pending: {
                control: false
            },
            listControlDone: [],
        }
    },

    methods: {

        // /**
        //  * Retourne une classe CSS par rapport à une réponse S A M I
        //  * 
        //  * @param {string} reponse S A M I
        //  * 
        //  * @return {string}
        //  */
		// classNameFromSAMI(reponse) {
        //     return classNameFromSAMI(reponse);
        // },

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
		 * Modifie le format de la date entrée en paramètre et la retourne 
		 * sous le format 01 févr. 2021
		 * @param {string} date 
		 */

		changeFormatDateLit(el) {
			return dateFormat(el);
		},
    },

    

    mounted () {
        /**
         * charge la liste des collectes
         */
        this.loadCollecte(this.habId);
    }

}
</script>