<template>

    <div v-if="echeancier">
        <div v-if="echeancier.priorite == false">

            <div  v-for="habilitation in filtredHabilitations()" :key="habilitation" class="my-3">
                <tabEcheancierPersonnel
                :operateurs = "filtredOp()"
                :periode = "periode"
                :habilitation = "habilitation"
                :kns = "filtredKns('habilitation', habilitation.id)"
                :contrats = "contrats"
                />

            </div>
        </div>

        <div v-for="personnel in filtredOp()" :key="personnel" class="my-3" v-else>
            <tabEcheancierHabilitation :personnel="personnel" :kns="filtredKns('operateur', personnel.id)" :periode="periode" :habilitations="filtredHabilitations()"/>
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

        <div class="card list-group">
            <div v-for="kn in kns" :key="kn" class="m-2 list-group-item">
                <div><strong>ID : </strong>{{ kn.id }}</div>
                <div><strong>OP : </strong>{{ kn.cible__structure__personnel_id }}</div>
                <div v-for="op in allOp" :key="op">
                    <div v-if="op.id == kn.cible__structure__personnel_id">
                        <div><strong>{{ op.cache_nom }}</strong></div>
                    </div>
                </div>
                <div v-if="kn.result_var"><strong>Resultat : </strong>{{ kn.result_var }}</div>
                <div v-else class="text-warning"><strong>Aucun resultat</strong></div>
                <div><strong>Date : </strong>{{ kn.date }}</div>

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
            this.$app.api.get('/v2/collecte')
                .then(data => {
                    this.kns = data;
                })
                .catch(this.$app.catchError);
        },

        filtredKns(filter, id){
            if (filter == 'habilitation'){
                return this.kns.filter(e => e.habilitation_id == id)
            } else if (filter == 'operateur'){
                return this.kns.filter(e => e.cible__structure__personnel_id == id)
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
        this.getKn();
        this.getContrat();
    }
}

</script>


