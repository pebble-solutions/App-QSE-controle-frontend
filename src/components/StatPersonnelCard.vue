<template>
    <div>
    </div>
    <div class="card m-2">
        <div class="card-header">
            <div v-if="stat" class="d-flex justify-content-between">
                <div>
                    <h3>{{requeteStat.cible_personnel}}</h3>
                    <div class="fs-light">du {{changeFormatDateLit(requeteStat.dd)}} au {{changeFormatDateLit(requeteStat.df)}}</div>
                </div>
            </div>
        </div>
        
        <!-- <div class="card-body">
            <div  v-for="(section, index) in sections" :key="'section-'+index" class="accordion" id="'section-'+index">
                
                <div class="accordion-item">
                    <h2 class="accordion-header" id="headingOne">
                        <button class="accordion-button" type="button" data-bs-toggle="collapse"
                        data-bs-target="#collapseOne" aria-expanded="true" aria-controls="collapseOne">
                            {{section}}
                        </button>
                    </h2>
                    <div id="collapseOne" class="accordion-collapse collapse show"
                    aria-labelledby="headingOne" data-bs-parent="'#section-'+index">
                        <div class="accordion-body">
                            <strong>This is the first item's accordion body.</strong>
                            <code>.accordion-body</code> overflow.
                        </div>
                    </div>
                </div>
                <div v-if="stat">
                    

                    {{searchID()}}perso
                    {{searchStatPersonnel()}}stats

                </div>
            </div>
        </div> -->
    </div>
</template>

<script>
import { mapState } from 'vuex';
import { dateFormat } from '../js/collecte';

export default {

    data(){

        return {
            sections: [
                'formulaires',
                'questions',
                'collectes'
            ],
            
        }
    },

    computed: {
        ...mapState(['stat','requeteStat']),
    },

    methods: {
        /**
		 * Modifie le format de la date entrée en paramètre et la retourne 
		 * sous le format 01 févr. 2021
		 * @param {string} date 
		 */

		changeFormatDateLit(el) {
			return dateFormat(el);
		},

        searchID() {
            let req = this.requeteStat;

            return req.cible_personnel;
        },

        searchStatPersonnel() {
            let tata = this.stat.stats;
            let titi='';
            for (const property in tata) {
            titi = tata[property];
            }
            return titi

        }

    },

}
</script>