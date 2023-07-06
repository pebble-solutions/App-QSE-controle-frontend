<template>
    <h1>{{ habilitation.nom }}</h1>
    <div class="tablo overflow-scroll">
        <!-- <div :style="{ border: 'solid grey 1px', height: '50px', position: 'relative', left: '85px', width: periode.length * 50 + 'px' }"></div> -->

        <div :style="{ border: 'solid grey 1px', height: '50px', width: periode.length * 50 + 85 + 'px' }">
            <div class="col-spec d-flex justify-content-center mt-2"><strong>Agents</strong></div>
        </div>

        <div v-for="personnel in operateurs" :key="personnel" :style="{ border: 'solid grey 1px', height: '50px', width: periode.length * size + 140 + 'px' }">
            <div v-for="kn in personnel.kn" :key="kn" class="habilit" :style="operateurHabilit(kn,personnel)" style="position: absolute;"></div>

            <div class="col-spec d-flex justify-content-center">
                {{ personnel.cache_nom }}
                <i :class="personnel.kn ? '' : 'ms-2 bi bi-exclamation-diamond text-warning'" placeholder="Aucun contrôle sur la période saisie"></i>
            </div>

            <div v-for="contrat in contratUses.filter(e => e.structure__personnel_id == personnel.id)" :key="contrat" class="progressbar" :style="calculateWidth(contrat)">
                {{ calculateWidth(contrat) }}    
                <p>{{ contratLabel(contrat) }}</p>
            </div>

            <div v-for="kn in personnel.kn" :key="kn" class="btn" :class="[classSAMI(kn.note)]" :style="{ bottom: '18px', left: (kn.date * size + 40 - 40 * personnel.kn.findIndex(opkn => opkn === kn)) + 'px' }">
                {{ kn.note }}
            </div>
        </div>

        <div class="d-flex" style="position: absolute; top: 0px;">
            <div :style="{ border: 'solid grey 1px', width: '140px', height: height() + 'px' }"></div>
            <div v-for="week in periode" :key="week" class="d-flex flex-row" style="border: solid grey 1px; width: 50px;" :style="{ height: height() + 'px' }">
                <div>
                    <div class="ms-2">{{ week.annee.slice(2,4) }}</div>
                    <div class="text-secondary ms-2">S{{ week.semaine }}</div>
                </div>
            </div>
        </div>
    </div>

    <div class="card list-group">
            <h5 class="card-title">Contrat</h5>
            <div v-for="contrat in contrats" :key="contrat" class="m-2 list-group-item">
                <div><strong>ID : </strong>{{ contrat.id }}</div>
                <div><strong>OP : </strong>{{ contrat.structure__personnel_id }}</div>
                <div v-for="op in operateurs" :key="op">
                    <div v-if="op.id == contrat.structure__personnel_id">
                        <div><strong>{{ op.cache_nom }}</strong></div>
                    </div>
                </div>
                <div><strong>Date entree : </strong>{{ contrat.dentree }}</div>
                <div><strong>Date sortie : </strong>{{ contrat.dsortie }}</div>

                <div><strong>Duree indeterminée : </strong>{{ contrat.duree_indeterminee }}</div>


            </div>

        </div>
  </template>
  

<style lang="scss" scoped>

.btn {
    position: relative;
    z-index: 1;
    width: 40px;
}

.col-spec {
    max-width:  140px;
    min-width: 140px;        
    width: 140px;
}

.habilit {
    background-color: rgba(247, 140, 107, 0.55);
    border-radius: 10px;
}

.progressbar {
    background-color: rgba(85, 91, 97, 0.60);
    color: white;
    font-size: 8px;
    border-radius: 8px;
    box-sizing: border-box;
    height: 12px;
    position:absolute;
}

.tablo{
    position: relative;
}
.progressbar > p {
    position: relative;
    bottom: 0px;
    left: 10px;
}

</style>

<script>

import {dateFormat} from '../../js/date.js';
import { mapState } from 'vuex';

export default {

    props: {
        operateurs: Array,
        periode: Array,
        habilitation: Object,
        kns: Array,
        contrats: Array
    },

    data() {
		return {
			size : 50,
            contratUses : []
		}
	},

    computed:{
        ...mapState(['echeancier'])
    },

    methods: {
        /**
         * Retourne un numero/ chiffre avec une certaine indentation
         * 
         * @param {int} n 
         * @param {int} width 
         * @param {char} z 
         * 
         * @returns {array}
         */
        // Integrer date.js
        padStart(n, width, z) {
            z = z || '0';
            n = n + '';
            return n.length >= width ? n : new Array(width - n.length + 1).join(z) + n;
        },
        
        /**
         * Retourne la longueur de la ligne du tableau
         * 
         * @returns {number} height 
         */
        height(){
            let taille = this.operateurs
            return (taille.length + 1) * 50
        },


        /**
         * Retourne les propriété de style dynamique par rapport aux périodes d'habilitation de l'opérateur
         * 
         * @param {Object} kn
         * 
         * @returns {string} style dynamique 
         */
        operateurHabilit(kn,op) {
            const height = "50px";
            let width;
            let left = 85;
            const periode = this.periode;

            if (!op.kn) {
                // EN cas ou aucun kn n'a été effectué sur la période
                width = periode.length * this.size;
            } else {
                let knTrie = op.kn.sort((a, b) => a.date - b.date);
                let numIdKn = knTrie.findIndex(opkn => opkn.id === kn.id);

                if (kn.note === 'I') {
                    width = kn.date * this.size;
                    if (knTrie[numIdKn-1]){
                        width = ( kn.date - knTrie[numIdKn-1].date) * this.size;
                        left = left + (knTrie[numIdKn-1].date * this.size);
                    }
                } else {
                    if (knTrie[numIdKn+1]){
                        width = ((knTrie[numIdKn+1].date - kn.date) * this.size);
                    } else {
                        width = ((periode.length + 1 - kn.date) * this.size);
                    }
                    left = left + ((kn.date -1) * this.size );
                }
            }

            return `left: ${left}px; width: ${width}px; height: ${height};`;
        },


        /**
         * Retourne la valeur de la classe bootstrap en fonction de la valeur de ref du kn
         * 
         * @param {string} ref
         * 
         * @returns {string} classe bootstraps
         */
        classSAMI(ref){
            if (ref == 'S') {
                return "btn-success"
            } if (ref == 'A') {
                return "btn-primary"
            } if (ref == "M"){
                return "btn-warning"
            } if (ref == 'I') {
                return "btn-danger"
            }
        },

        getWeekContrat(){
            for(let contrat of this.contrats){
                let query;
            
                if ( !contrat.dsortie){
                    query = {
                        dd: contrat.dentree.slice(0,10),
                        df: this.echeancier.df,
                        pas: 1,
                        pas_type: 'week',
                        format: 'W o',
                        retour_type: 'text'
                    };
                } else {
                    query = {
                        dd: contrat.dentree.slice(0,10),
                        df: contrat.dsortie.slice(0,10),
                        pas: 1,
                        pas_type: 'week',
                        format: 'W o',
                        retour_type: 'text'
                    };
                }

                let periodeContrat = [];
                this.$app.api.get('/v2/periode/DatePeriod', query)
                .then(data => {
                    for(let date of data){
                        let week = {
                            semaine : parseInt(date.slice(0,2)),
                            annee: date.slice(3), 
                        }

                        periodeContrat.push(week)
                    }
                })
                .catch(this.$app.catchError);

                let contratuse = {
                    structure__personnel_id : contrat.structure__personnel_id,
                    dentree : contrat.dentree,
                    dsortie : contrat.dsortie,
                    duree_indeterminee : contrat.duree_indeterminee,
                    periode : periodeContrat
                }

                this.contratUses.push(contratuse)
            }
        },

        /**
         * Retourne la propriété style (left et width) en px calculée avec la durée du contrat du personnel
         * 
         * @param {Object} contrat 
         * 
         * @returns {string}
         */
         calculateWidth(contrat) {
            let width;

            let left = 140;

            left = (contrat.periode[0].semaine - 1) * this.size + left;

            if (contrat.dsortie) {
                width = (contrat.periode[contrat.periode.length - 1].semaine - contrat.periode[0].semaine + 1 + ((contrat.periode[contrat.periode.length - 1].annee - contrat.periode[0].annee)*52)) * this.size;
            } else {
                let periode = this.periode
                width =  (periode.length - contrat.periode[0].semaine + 1) * this.size;
            }


            return `left: ${left}px; width: ${width}px;`;
        },


        /**
         * Retourne le type de contrat à afficher en fonction du personnel
         * 
         * @param {Object} contrat
         * 
         * @returns {string}  
         */
         contratLabel(contrat){
            if (contrat.duree_indeterminee == 'OUI'){
                return "CDI : " + dateFormat(contrat.dentree)
            } else {
                return "CDD : " + dateFormat(contrat.dentree) + '>' + dateFormat(contrat.dsortie)
            }
        },

    },

    mounted(){
        this.getWeekContrat();
    }
}

</script>


