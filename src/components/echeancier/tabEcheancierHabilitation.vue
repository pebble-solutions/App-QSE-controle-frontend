<template>

        <div>
            <UserImage :name = "personnel.cache_nom" size = "lg" style="position: absolute;"/>
            <h1 style="position: relative; left: 70px; width: 1000px;">{{ personnel.cache_nom }}</h1>
        </div>

        <div class="tablo overflow-scroll mb-3">

            <div :style="{ border: 'solid grey 1px', height: '50px', width: periode.length * 50 + 140 + 'px' }">
                <div class="col-spec d-flex justify-content-center ms-3 mt-2"><strong>Habilitations</strong></div>
            </div>
    
            <div v-for="hab in habilitations" :key="hab" :style="{ border: 'solid grey 1px', height: '50px', width: periode.length * size + 140 + 'px' }">
                <div v-for="kn in personnel.kn" :key="kn" class="habilit" :style="operateurHabilit(kn,personnel)" style="position: absolute;"></div>
    
                <div class="col-spec d-flex justify-content-center ms-2">
                    {{ labelHabilitation(hab.nom) }}
                    <i :class="personnel.kn ? '' : 'bi bi-exclamation-diamond text-warning'" placeholder="Aucun contrôle sur la période saisie"></i>
                </div>
    
                <div class="progressbar" :style="{ left: (personnel.dentree.semaine - 1) * size + 140 + 'px', width: calculateWidth(personnel) + 'px' }" v-if="personnel.dentree">
                    <p>{{ contratLabel(personnel) }}</p>
                </div>
    
                <div v-for="kn in personnel.kn" :key="kn" class="btn" :class="[classSAMI(kn.note)]" :style="{ bottom: '18px', left: (kn.date * size + 75 - 40 * personnel.kn.findIndex(opkn => opkn === kn)) + 'px' }">
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

  </template>
  

<style lang="scss" scoped>

.btn {
    position: relative;
    z-index: 1;
    width: 40px;
}

.col-spec {
    max-width:  85px;
    min-width: 85px;        
    width: 85px;
}

.habilit {
    // background-color: rgba(61, 52, 52, 0.25);
    background-color: rgba(247, 140, 107, 0.55);
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

import UserImage from '../pebble-ui/UserImage.vue';

export default {

    props:{
        personnel: Object,
        periode: Array,
        habilitations: Array,
        kns: Array
    },

    data() {
		return {
			size : 50,
		}
	},

    components: {UserImage},

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
            return (this.habilitations.length + 1) * 50
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

        /**
         * Retourne le nom de l'habilitation pour l'afficahge
         * 
         * @param {string} label 
         * 
         * @returns {string}
         */
        labelHabilitation(label){
            if (label.includes('Habilitation')){
                return label.slice(13)
            } else {
                return label
            }
        },

        /**
         * Retourne la taille en px calculée avec la durée du contrat du personnel
         * 
         * @param {Object} personnel 
         * 
         * @returns {number}
         */
        calculateWidth(personnel) {
            if (personnel.dsortie) {
                return (personnel.dsortie.semaine - personnel.dentree.semaine + 1 + ((personnel.dsortie.annee - personnel.dentree.annee)*52)) * this.size;
            } else {
                let periode = this.periode
                return (periode.length - personnel.dentree.semaine + 1) * this.size;
            }
        },


        /**
         * Retourne le type de contrat à afficher en fonction du personnel
         * 
         * @param {Object} personnel
         * 
         * @returns {string}  
         */
         contratLabel(personnel){
            if (!personnel.dsortie){
                return "Contrat : CDI   " + personnel.dentree.jour + '/' + personnel.dentree.mois + "/" + personnel.dentree.annee
            } else {
                return "Contrat : CDD    " + personnel.dentree.jour + '/' + personnel.dentree.mois + "/" + personnel.dsortie.annee + '>' + personnel.dsortie.jour + '/' + personnel.dsortie.mois + "/" + personnel.dsortie.annee
            }
        },
    },
}

</script>


