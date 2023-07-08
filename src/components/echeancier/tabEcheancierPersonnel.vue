<template>
    <h1>{{ habilitation.nom }}</h1>
    <div class="tablo overflow-scroll">
        <!-- <div :style="{ border: 'solid grey 1px', height: '50px', position: 'relative', left: '85px', width: periode.length * 50 + 'px' }"></div> -->

        <div :style="{ border: 'solid grey 1px', height: '50px', width: periode.length * 50 + 140 + 'px' }">
            <div class="col-spec d-flex justify-content-center mt-2"><strong>Agents</strong></div>
        </div>

        <div v-for="personnel in operateurs" :key="personnel" :style="{ border: 'solid grey 1px', height: '50px', width: periode.length * size + 140 + 'px' }">
            <!-- <div v-for="kn in verifKns(personnel.id)" :key="kn" class="habilit" :style="operateurHabilit(kn,personnel)" style="position: absolute;"></div> -->

            <div class="col-spec d-flex justify-content-center">
                {{ personnel.cache_nom }}
                <i :class="classKnManquant(personnel.id)" placeholder="Aucun contrôle sur la période saisie"></i>
            </div>

            <div v-for="contrat in contratUses.filter(e => e.structure__personnel_id == personnel.id)" :key="contrat" class="progressbar" :style="calculateWidth(contrat)">
                {{ calculateWidth(contrat) }}    
                <p>{{ contratLabel(contrat) }}</p>
            </div>

            <div v-for="kn in verifKns(personnel.id)" :key="kn" class="btn m-1" :class="[classSAMI(kn.sami)]" :style="{ bottom: '23px', left: leftkn(kn) }">
                {{ kn.sami }}
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
            let left = 140;
            const periode = this.periode;

            if (kn.personnel_id__operateur != op.id) {
                // EN cas ou aucun kn n'a été effectué sur la période
                width = periode.length * this.size;
            } else {
                let knTrie = kn.sort((a, b) => a.date - b.date);
                let numIdKn = knTrie.findIndex(opkn => opkn.id === kn.id);
                let datekn = new Date(kn.date).getWeek();

                if (kn.sami === 'I') {
                    width = datekn * this.size;
                    if (knTrie[numIdKn-1]){
                        width = ( datekn - knTrie[numIdKn-1].date) * this.size;
                        left = left + (knTrie[numIdKn-1].date * this.size);
                    }
                } else {
                    if (knTrie[numIdKn+1]){
                        width = ((knTrie[numIdKn+1].date - datekn) * this.size);
                    } else {
                        width = ((periode.length + 1 - datekn) * this.size);
                    }
                    left = left + ((datekn -1) * this.size );
                }
            }

            return `left: ${left}px; width: ${width}px; height: ${height};`;
        },

        /**
         * Retourne le nom des classes bootstraps si l'operateur n'a pas de kn sur la periode selectionné
         * 
         * @param {number} id 
         * 
         * @returns {string}
         */
        classKnManquant(id) {
            const result = this.kns.some(item => item.personnel_id__operateur === id);
            return result ? '' : 'ms-2 bi bi-exclamation-diamond text-warning';
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

        /**
         * Retourne le nomb de pixel de decalage du kn en fonction de sa date
         * 
         * @param {object} kn 
         * 
         * @returns {string} 
         */
        leftkn(kn){
            let knDate = new Date(kn.date)
            return ((knDate.getWeek() * this.size) + 140) + "px"
        },

        /**
         * Filtre la liste des kns avec l'id du personnel et renvoie le dernier kn effectué si plusieurs kn sont marqué la meme semaine  
         * 
         * @param {number} id 
         * 
         * @returns {array}
         */
        verifKns(id){
            let rendukn = this.kns.filter(item => item.personnel_id__operateur == id);

            if(rendukn.length != 0){
                let knlist = []
                let kntest = rendukn[0]
                for(let kn of rendukn){
                    if(kn.id == rendukn[rendukn.length -1].id){
                        knlist.push(kn)
                    } else {
                        let date = new Date(kn.date)
                        let datetest = new Date(kntest.date)
                        if(date.getWeek() == datetest.getWeek()){
                            kntest = kn;
                        } else {
                            knlist.push(kntest)
                        }
                    }
                }
                rendukn = knlist
            }
            return rendukn
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
}

</script>


