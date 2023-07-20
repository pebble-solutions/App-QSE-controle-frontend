<template>
    <div class="my-3">
        <h3 class="fs-5">{{ habilitation.nom }}</h3>
        <div class="position-relative overflow-auto">
            <!-- <div :style="{ border: 'solid grey 1px', height: '50px', position: 'relative', left: '85px', width: periode.length * 50 + 'px' }"></div> -->
    
            <div :style="{ border: 'solid grey 1px', height: '50px', width: periode.length * 50 + 140 + 'px' }">
                <div class="col-spec d-flex justify-content-center mt-2"><strong>Agents</strong></div>
            </div>
    
            <div v-for="personnel in operateurs" :key="personnel" :style="{ border: 'solid grey 1px', height: '50px', width: periode.length * size + 140 + 'px' }" class="position-relative">
                <div v-for="kn in verifKns(personnel.id)" :key="kn" class="habilit" :style="operateurHabilit(kn, personnel)" style="position: absolute;"></div>
    
                <div class="col-spec d-flex justify-content-between">
                    {{ personnel.cache_nom }}
                    <i :class="classKnManquant(personnel.id)" title="Aucun contrôle sur la période saisie"></i>
                </div>

                <template v-for="contrat in filtredContrats(personnel.id)" :key="'contrat-'+contrat.id">
                    <div class="control-result-item bg-secondary rounded text-truncate" :style="calculateWidth(contrat)" v-if="contratIsInPeriode(contrat)" :title="contratLabel(contrat)">
                       {{ contratLabel(contrat) }}
                    </div>
                </template>
    
                <!-- <div v-for="contrat in filtredContrats(personnel.id)" :key="contrat" class="progressbar" :style="calculateWidth(contrat)">    
                    <div class="progressbar-content">{{ contratLabel(contrat) }}</div>
                </div> -->
    
                <div v-for="kn in verifKns(personnel.id)" :key="kn" class="control-result-item btn m-1" :class="[classSAMI(kn.sami)]" :style="{ left: leftkn(kn) }">
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
    </div>

  </template>
  

<style lang="scss" scoped>

.control-result-item {
    position: absolute;
    z-index: 1;
    width: 40px;
    top:0px;
}

.col-spec {
    max-width:  140px;
    min-width: 140px;        
    width: 140px;
    max-height: 50px;
    overflow:hidden;
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

.progressbar-content {
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
		}
	},

    computed:{
        ...mapState(['echeancier']),
    },

    methods: {
        /**
         * Retourne un numero/ chiffre avec une certaine indentation
         * 
         * @param {number} n 
         * @param {number} width 
         * @param {string} z 
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
        height() {
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

            let temp_kns = this.verifKns(op.id);

            if (kn.personnel_id__operateur != op.id) {
                // EN cas ou aucun kn n'a été effectué sur la période
                width = periode.length * this.size;
            } else {
                let knTrie = temp_kns.sort((a, b) => new Date(a.date).getWeek() - new Date(b.date).getWeek());
                let numIdKn = knTrie.findIndex(opkn => opkn.id === kn.id);
                let datekn = new Date(kn.date).getWeek();

                if (kn.sami === 'I') {
                    width = datekn * this.size;
                    if (knTrie[numIdKn-1]){
                        width = ( datekn - new Date(knTrie[numIdKn-1].date).getWeek()) * this.size;
                        left = left + ((new Date(knTrie[numIdKn-1].date).getWeek() + 1) * this.size);
                    }
                } else {
                    if (knTrie[numIdKn+1]){
                        width = ((new Date(knTrie[numIdKn+1].date).getWeek() - datekn) * this.size);
                    } else {
                        width = ((periode.length - datekn) * this.size);
                    }
                    left = left + (datekn * this.size );
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
        classSAMI(ref) {
            const classList = {
                s: "btn-success",
                a: "btn-primary",
                m: "btn-warning",
                i: "btn-danger"
            }

            return classList[ref?.toLowerCase()];
        },

        /**
         * Retourne le nomb de pixel de decalage du kn en fonction de sa date
         * 
         * @param {object} kn 
         * 
         * @returns {string} 
         */
        leftkn(kn) {
            let knDate = new Date(kn.date_done);
            const startWeek = typeof this.periode[0] !== 'undefined' ? parseInt(this.periode[0].semaine) : 0;
            const left = (((knDate.getWeek() - startWeek) * this.size) + 140) + "px";

            return left;
        },

        /**
         * Filtre la liste des kns avec l'id du personnel et renvoie le dernier kn effectué si plusieurs kn sont marqué la meme semaine  
         * 
         * @param {number} id 
         * 
         * @returns {array}
         */
        verifKns(id) {
            let rendukn = this.kns.filter(item => item.personnel_id__operateur === id);

            if (rendukn.length !== 0) {
                let knlist = [rendukn[rendukn.length - 1]];
                let kntest = rendukn[rendukn.length - 1];

                for (let i = rendukn.length - 2; i >= 0; i--) {
                let kn = rendukn[i];
                let date = new Date(kn.date);
                let datetest = new Date(kntest.date);

                if (date.getWeek() !== datetest.getWeek()) {
                    knlist.unshift(kn);
                    kntest = kn;
                }
                }

                rendukn = knlist;
            }

            return rendukn;
        },

        /**
         * Retourne la liste filtrée des contrats par le l'id du personnel et la periode selectionnée
         * @param {number} id
         * 
         * @returns {array} 
         */
        filtredContrats(id) {
            let contratsFiltre = this.contrats.filter(e => e.structure__personnel_id == id);

            return contratsFiltre.filter(contrat => new Date(contrat.dentree).getWeek() < this.periode[this.periode.length-1].semaine)
        },

        /**
         * Retourne true si le contrat est entre la periode défini sinon retourne false
         * 
         * @param {object}    contrat
         * 
         * @return {string}
         */
        contratIsInPeriode(contrat) {
            let weekStart = contrat.dentree ? new Date(contrat.dentree).getWeek() : null;
            let weekEnd = contrat.dsortie ? new Date(contrat.dsortie).getWeek() : null;
            let yearStart = contrat.dentree ? new Date(contrat.dentree).getFullYear() : null;
            let yearEnd = contrat.dsortie ? new Date(contrat.dsortie).getFullYear() : null;
            let weekPeriodeStart =  this.periode[0].semaine;
            let weekPeriodeEnd = this.periode[this.periode.length-1].semaine;
            let yearPeriodeStart = this.periode[0].annee;
            let yearPeriodeEnd = this.periode[this.periode.length-1].annee;

            console.log(this.periode);


            if (yearStart >= yearPeriodeStart && yearStart <= yearPeriodeEnd || (yearEnd && yearEnd >= yearPeriodeStart && yearEnd <= yearPeriodeEnd || !yearEnd)) {
                if (weekStart >= weekPeriodeStart && weekStart <= weekPeriodeEnd
                    || weekStart <= weekPeriodeEnd && !weekEnd
                    || weekStart <= weekPeriodeEnd && weekEnd && weekEnd >= weekPeriodeEnd
                    || weekStart <= weekPeriodeEnd && weekEnd && weekEnd >= weekPeriodeStart && weekEnd <= weekPeriodeEnd) {
                    return true;
                }
            }

            return false;
        },

        /**
         * Retourne la propriété style (left et width) en px calculée avec la durée du contrat du personnel
         * 
         * @param {Object} contrat 
         * 
         * @returns {string}
         */
        calculateWidth(contrat) {
            let left = 140;
            let width = 1;

            let weekStart = contrat.dentree ? new Date(contrat.dentree).getWeek() : null;
            let weekEnd = contrat.dsortie ? new Date(contrat.dsortie).getWeek() : null;
            let weekPeriodeStart =  this.periode[0].semaine;
            let weekPeriodeEnd = this.periode[this.periode.length-1].semaine;
            let weekStartDiff = weekStart - weekPeriodeStart;

            if (weekStart >= weekPeriodeStart) {
                left = (weekStartDiff * this.size) + left;
            }

            weekStart = weekStart <= weekPeriodeStart && (weekEnd >= weekPeriodeStart || !weekEnd) ? weekPeriodeStart : weekStart;
            weekEnd = weekEnd >= weekPeriodeEnd && weekStart <= weekPeriodeEnd || !weekEnd ? weekPeriodeEnd : weekEnd;

            let diff = weekEnd - weekStart;
            width = (diff+1) * this.size; 

            return `left: ${left}px; width: ${width}px;`;
        },


        /**
         * Retourne le type de contrat à afficher en fonction du personnel
         * 
         * @param {Object} contrat
         * 
         * @returns {string}  
         */
        contratLabel(contrat) {
            console.log('getLabel', contrat);
            if (contrat.duree_indeterminee == 'OUI'){
                if (contrat.dentree) {
                    return "CDI : " + dateFormat(contrat.dentree);
                } else {
                    return "Erreur avec la date d'entree non renseignée";
                }
            } else {
                if (contrat.dentree && contrat.dsortie) {
                    return "CDD : " + dateFormat(contrat.dentree) + '>' + dateFormat(contrat.dsortie)
                } else {
                    return "Erreur avec la date d'entree et/ou la date de sortie non renseignée(s)"
                }
            }
        },

    },

    mounted() {
        console.log('contrats', this.contrats);
    }
}

</script>


