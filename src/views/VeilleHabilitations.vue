<template>

    <div v-if="echeancier">
        <div v-if="echeancier.priorite == false">

            <div  v-for="habilitation in filtredHabilitations()" :key="habilitation" class="my-3">
                <tabEcheancierPersonnel
                    :operateurs = "filtredOp()"
                    :periode = "periode"
                    :habilitation = "habilitation"
                    :kns = "filtredkns(habilitation.id, 'habilitation')"
                    :contrats = "contrats"
                />

            </div>
        </div>

        <div v-for="personnel in filtredOp()" :key="personnel" class="my-3" v-else>
            <tabEcheancierHabilitation 
                :personnel="personnel" 
                :kns = "filtredkns(personnel.id, 'personnel')" 
                :periode="periode" 
                :habilitations="filtredHabilitations()"
            />
        </div>
    </div>
    <div class="container py-2" v-else>
        
        <h1 class="fs-3 my-3">Consultation de l'échéancier</h1>
        <div class="card my-2">
            <div class="card-body">
                <div class="row align-items-center">
                    <div class="col-md-6 col-lg-4 col-12">
                        <img src="../assets/echeancier.jpg" class="img-fluid" alt="consultation de l'échéancier" />
                    </div>
                    <div class="col display-6 ">
                        <p class="fs-4 text-center">Utilisez cet espace pour consulter l'échéancier des habilitations</p>
                        <ul>
                            <li class="fs-5 mb-2">Sélectionnez une date de debut et une date de fin de période</li>
                            <li class="fs-5 mb-2">Vous pouvez effectuer une recherche par habilitations</li>
                            <li class="fs-5 mb-2">Vous pouvez effectuer une recherche par opérateurs</li>
                            <li class="fs-5 mb-2">Vous pouvez grouper vos résultats par opérateurs ou par habilitations</li>
                        </ul>
                    </div>
                </div>
            </div>
        </div> 
    </div>


  </template>

<script>

import tabEcheancierPersonnel from '../components/echeancier/tabEcheancierPersonnel.vue'
import tabEcheancierHabilitation from '../components/echeancier/tabEcheancierHabilitation.vue';
import { mapActions, mapState } from 'vuex';

export default {

    data() {
		return {
            allHabilitations: [],
            allOp: [],
            periode: [],
            kns: [],
            contrats: []
		}
	},

    components: {tabEcheancierPersonnel, tabEcheancierHabilitation},

    watch:{
        echeancier:{
            handler(newValue){
                if(newValue.dd && newValue.df){
                    this.getPeriode()
                    this.getKn()
                }
            },
            deep:true,
        }
    },

    computed:{
        ...mapState(['echeancier']),
    },

    methods: {
        ...mapActions(['setEcheance']),

        /**
         * Charge les données des habilitations
         */
        getHabilitation(){
            // let ids = [1]
            this.$app.api.get('/v2/controle/habilitation/type/')
                .then(data => {
                    this.allHabilitations = data;
                })
                .catch(this.$app.catchError);
        },

        filtredHabilitations(){
            if(this.echeancier.habilitation.length == 0 || (this.echeancier.habilitation.length == 1 && this.echeancier.habilitation.includes(''))){
                return this.allHabilitations
            }else {
                return this.allHabilitations.filter(item => this.echeancier.habilitation.includes(item.id))
            }
        },

        getKn(){
            if(this.echeancier){
                let query = {
                    type : "KN",
                    dd_start : this.echeancier.dd,
                    df_start : this.echeancier.df,
                    personnel_id__operateur : this.echeancier.operateurs,
                    habilitation_id : this.echeancier.habilitation
                }

                if (this.echeancier.habilitation.length == 0 || this.echeancier.habilitation[0] == ""){
                    query.habilitation_id = 0;
                } else {
                    query.habilitation_id = this.echeancier.habilitation.toString()
                }

                if(this.echeancier.operateurs.length == 0 || this.echeancier.operateurs[0] == ""){
                    query.personnel_id__operateur = 0;
                } else {
                    query.personnel_id__operateur = this.echeancier.operateurs.toString()
                }

                this.$app.api.get('/v2/collecte', query)
                .then(data => {
                    this.kns = data;
                })
                .catch(this.$app.catchError);
            }
        },

        filtredkns(id, type){
            if(type == 'habilitation'){
                return this.kns.filter(item => item.habilitation_id == id)
            } else if(type == 'personnel'){
                return this.kns.filter(item => item.personnel_id__operateur == id)
            }
        },

        getAllOp(){
            this.$app.api.get('/v2/personnel')
                .then(data => {
                    this.allOp = data;
                })
                .catch(this.$app.catchError);
        },

        filtredOp(){
            if(this.echeancier.operateurs.length == 0 || (this.echeancier.operateurs.length == 1 && this.echeancier.operateurs.includes(''))){
                return this.allOp
            }else {
                return this.allOp.filter(item => this.echeancier.operateurs.includes(item.id))
            }
        },

        getPeriode() {
            if(this.echeancier){
                let query = {
                    dd: this.echeancier.dd,
                    df: this.echeancier.df,
                    pas: 1,
                    pas_type: 'week',
                    format: 'W o',
                    retour_type: 'text'
                };
    
                this.$app.api
                    .get('/v2/periode/DatePeriod', query)
                    .then(data => {
                        this.periode = [];
                        for(let date of data){
                            let week = {
                                semaine : date.slice(0,2),
                                annee:date.slice(3), 
                            }
                            this.periode.push(week)
                        }
                    })
                    .catch(this.$app.catchError);
            }
        },

        getContrat(){
            this.$app.api.get('/v2/contrat/')
                .then(data => {
                    this.contrats = data
                })
                .catch(this.$app.catchError);
        }

    },

    unmounted(){
        this.setEcheance(null)
    },

    mounted(){
        this.getHabilitation();
        this.getAllOp(); 
        this.getContrat();
    }
}

</script>


