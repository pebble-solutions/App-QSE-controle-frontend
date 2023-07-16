<template>
    <div class="my-3">
        <div class="d-flex align-items-center my-2 mx-2">
            <div class="me-2">
                <UserImage :name="personnel.cache_nom" />
            </div>
            <h3 class="my-0 fs-5">{{ personnel.cache_nom }}</h3>
        </div>

        <div class="position-relative overflow-scroll">

            <div :style="{ border: 'solid grey 1px', height: '50px', width: periode.length * 50 + 140 + 'px' }">
                <div class="col-spec d-flex justify-content-center ms-3 mt-2"><strong>Habilitations</strong></div>
            </div>
    
            <div v-for="hab in habilitations" :key="hab" :style="{ border: 'solid grey 1px', height: '50px', width: periode.length * size + 140 + 'px' }">
                <div v-for="kn in verifKns(hab.id)" :key="kn" class="habilit" :style="operateurHabilit(kn, hab.id)" style="position: absolute;"></div>
    
                <div class="col-spec d-flex justify-content-center ms-2">
                    {{ labelHabilitation(hab.nom) }}
                    <i :class="classKnManquant(personnel.id)" placeholder="Aucun contrôle sur la période saisie"></i>
                </div>
    
                <div class="progressbar" :style="{ left: (personnel.dentree.semaine - 1) * size + 140 + 'px', width: calculateWidth(personnel) + 'px' }" v-if="personnel.dentree">
                    <div class="progressbar-content">{{ contratLabel(personnel) }}</div>
                </div>
    
                <div v-for="kn in verifKns(hab.id)" :key="kn" class="control-result-item btn m-1" :class="[classSAMI(kn.sami)]" :style="{ bottom: '23px', left: leftkn(kn) }">
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
.progressbar-content {
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
         * @param {number} n 
         * @param {number} width 
         * @param {string} z 
         * 
         * @returns {array}
         */
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
            return (this.habilitations.length + 1) * 50
        },

         /**
         * Retourne les propriété de style dynamique par rapport aux périodes d'habilitation de l'opérateur
         * 
         * @param {Object} kn
         * 
         * @returns {string} style dynamique 
         */
        operateurHabilit(kn, id) {
            const height = "50px";
            let width;
            let left = 140;
            const periode = this.periode;

            let temp_kns = this.verifKns(id);

            if (kn.habilitation_id != id) {
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
        verifKns(id) {
            let rendukn = this.kns.filter(item => item.habilitation_id === id);

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


