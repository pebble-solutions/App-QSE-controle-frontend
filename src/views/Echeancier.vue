<template>

    <div v-if="echeancier" class="absolute-workspace bg-light">

        <div v-if="isPending" class="text-center my-4 fs-4 text-secondary">
            <span class="spinner-border"></span>
            Chargement...
        </div>
        <template v-else>
            <div v-if="echeancier.priorite == false">
    
                <div  v-for="habilitation in filteredHabilitations" :key="habilitation.id" class="my-3">
                    <tabEcheancierPersonnel
                        :operateurs = "filteredOperateurs"
                        :periode = "periode"
                        :habilitation = "habilitation"
                        :kns = "filteredKns(habilitation.id, 'habilitation')"
                        :contrats = "contrats"
                    />
    
                </div>
            </div>
    
            <template v-else>
                <template v-for="personnel in filteredOperateurs" :key="personnel.id">
                    <tabEcheancierHabilitation 
                        :personnel="personnel" 
                        :kns="filteredKns(personnel.id, 'personnel')" 
                        :periode="periode" 
                        :habilitations="filteredHabilitations"
                        :habilitationsPersonnel="getHabilitationByPersonnelId(personnel.id)"
                        :contrats="contrats"
                        v-if="getHabilitationByPersonnelId(personnel.id)?.length"
                    />
                </template>
            </template>
        </template>
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
            allHabilitationsTypes: [],
            allOperateurs: [],
            habilitationsPersonnel: [],
            periode: [],
            kns: [],
            contrats: [],
            pending: {
                habilitationsTypes: false,
                habilitationsPersonnel: false,
                collectes: false,
                contrats: false,
                personnels: false,
                periode: false
            }
		}
	},

    components: {tabEcheancierPersonnel, tabEcheancierHabilitation},

    watch:{
        /**
         * Ecoute la varible echeancier dans le store 
         * et fais les appels necessaire au methodes de recuperation de données 
         * lors du changement de celle-ci
         */
        echeancier:{
            handler(newValue){
                if(newValue.dd && newValue.df){
                    this.getPeriode();
                    this.getKn();
                    this.getHabilitationsPersonnel();
                    this.getContrats();
                }
            },
            deep:true,
        }
    },

    computed:{
        ...mapState(['echeancier']),

        /**
         * Retourne la liste des Hailitations filtrées avec la recherche 
         * 
         * @returns {array}
         */
        filteredHabilitations() {
            if(this.echeancier.habilitation.length == 0 || (this.echeancier.habilitation.length == 1 && this.echeancier.habilitation.includes(''))) {
                return this.allHabilitationsTypes;
            } else {
                return this.allHabilitationsTypes.filter(item => this.echeancier.habilitation.includes(item.id));
            }
        },

        /**
         * Retourne la liste des opérateurs triés en fonction des filtre selectionnés
         * 
         * @returns {array}
         */
        filteredOperateurs() {
            if(this.echeancier.operateurs.length == 0 || (this.echeancier.operateurs.length == 1 && this.echeancier.operateurs.includes(''))) {
                return this.allOperateurs
            } else {
                return this.allOperateurs.filter(item => this.echeancier.operateurs.includes(item.id))
            }
        },

        /**
         * Retourne true si un chargement est en cours
         * 
         * @return {bool}
         */
        isPending() {
            return (this.pending.habilitationsTypes || this.pending.collectes || this.pending.contrats || this.pending.personnels || this.pending.periode || this.pending.habilitationsPersonnel) ? true : false;
        }
    },

    methods: {
        ...mapActions(['setEcheance']),

        /**
         * Charge les données des habilitations
         */
        async getAllHabilitations() {
            return this.loadCollection({
                pending: "habilitationsTypes",
                name: "habilitationsTypes",
                payload: {
                    limit: "aucune"
                },
                outputData: "allHabilitationsTypes"
            });
        },

        /**
         * Chargue une collection de données
         * 
         * @param {object} collectionConfig 
         * - pending         Clé pending à utiliser pendant le chargement
         * - name            Nom de la collection
         * - payload         Payload à envoyer sur la requête
         * - outputData      Clé dans data sur laquelle stocker une référence vers les données
         * 
         * @return {Promise}
         */
        async loadCollection(collectionConfig) {
            const pending = collectionConfig.pending;
            const name = collectionConfig.name;
            const payload = collectionConfig.payload;
            const outputData = collectionConfig.outputData;

            this.pending[pending] = true;

            const collection = this.$assets.getCollection(name);

            try {
                await collection.load(payload);

                if (outputData) {
                    this[outputData] = collection.getCollection();
                }
            } catch (e) {
                this.$app.catchError(e);
            } finally {
                this.pending[pending] = false;
            }
        },

        /**
         * Charge les données des kns via les diferents filtre de periodes, personnels et habilitations
         */
        getKn() {
            if(this.echeancier){
                this.pending.collectes = true;

                let query = {
                    type : "KN",
                    dd_start : this.echeancier.dd,
                    df_start : this.echeancier.df,
                    personnel_id__operateur : this.echeancier.operateurs,
                    habilitation_type_id : this.echeancier.habilitation,
                    locked: true
                }

                if (this.echeancier.habilitation.length == 0 || this.echeancier.habilitation[0] == "") {
                    query.habilitation_type_id = 0;
                } else {
                    query.habilitation_type_id = this.echeancier.habilitation.toString()
                }

                if (this.echeancier.operateurs.length == 0 || this.echeancier.operateurs[0] == "") {
                    query.personnel_id__operateur = 0;
                } else {
                    query.personnel_id__operateur = this.echeancier.operateurs.toString()
                }

                this.$app.api.get('/v2/collecte', query, {
                    headers: {
                        'Content-Type': 'application/json'
                    }
                })
                .then(data => {
                    this.kns = data;
                })
                .catch(this.$app.catchError).finally(() => this.pending.collectes = false);
            }
        },

        /**
         * Récupère la liste des habilitations du personnel sur le serveur
         */
        getHabilitationsPersonnel() {
            if (this.echeancier) {
                this.pending.habilitationsPersonnel = true;

                let query = {
                    personnel_id : this.echeancier.operateurs.join(","),
                    characteristic_id : this.echeancier.habilitation.join(","),
                    dd_active : this.echeancier.dd,
                    df_active : this.echeancier.df
                }

                this.$app.api.get('/v2/characteristic/personnel', query)
                .then(data => {
                    this.habilitationsPersonnel = data;
                }).catch(this.$app.catchError).finally(() => this.pending.habilitationsPersonnel = false);
            }
        },

        /**
         * Retourne la liste des kns filtré par l'id d'un personnele ou d'une habilkitation
         * 
         * @param {number} id id pour le filtre
         * @param {string} type decrit le type de tableau a afficher
         * 
         * @returns {array} tout les kns trié
         */
        filteredKns(id, type) {
            if(type == 'habilitation') {
                return this.kns.filter(item => item.habilitation_type_id == id)
            } else if(type == 'personnel') {
                let kns = this.kns.filter(item => item.personnel_id__operateur == id);
                return kns;
            }
        },

        /**
         * Retourne la liste des habilitation pour un personnel
         * 
         * @param {number} personnelId ID du personnel à tester
         * 
         * @return {array}
         */
        getHabilitationByPersonnelId(personnelId) {
            return this.habilitationsPersonnel.filter(e => e.personnel_id == personnelId);
        },

        /**
         * Charge tous les operateurs
         */
        getAllOperateurs() {
            return this.loadCollection({
                pending: "personnels",
                name: "personnels",
                payload: {
                    limit: "aucune"
                },
                outputData: "allOperateurs"
            });
        },

        /**
         * Charge les données relative a la période selectionné comme suit: [objet{semaine: number, annee: number}]
         */
        getPeriode() {
            if(this.echeancier){
                this.pending.periode = true;

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
                            annee: date.slice(3), 
                        }
                        this.periode.push(week)
                    }
                })
                .catch(this.$app.catchError).finally(() => this.pending.periode = false);
            }
        },

        /**
         * Charges tout les contrats 
         */
        getContrats() {
            this.pending.contrats = true;

            this.$app.api.get("/v2/contrat", {
                pdd: this.echeancier.dd,
                pdf: this.echeancier.df,
                structure__personnel_id: this.echeancier.operateurs.join(","),
                limit: "aucune"
            })
            .then(data => {
                this.contrats = data
            })
            .catch(this.$app.catchError).finally(() => this.pending.contrats = false);
        }

    },

    unmounted() {
        this.setEcheance(null)
    },

    mounted() {
        this.getAllHabilitations();
        this.getAllOperateurs();
    }
}

</script>


