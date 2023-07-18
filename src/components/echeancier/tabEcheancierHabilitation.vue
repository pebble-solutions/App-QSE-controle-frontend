<template>
    <div class="my-3">
        <div class="d-flex align-items-center my-2 mx-2">
            <div class="me-2">
                <UserImage :name="personnel.cache_nom" />
            </div>
            <h3 class="my-0 fs-5">{{ personnel.cache_nom }}</h3>
        </div>

        <div class="position-relative overflow-auto" :style="{height : `${tableHeight}px`}">

            <div class="table-grid" :style="{width : `${tableWidth}px`}">
                <div v-for="n in rows" class="table-row border border-secondary" :key="n" :style="{ top: getTopPosition(n, 2) }"></div>
                <div v-for="n in cols" class="table-col border border-secondary" :key="n" :style="{ left: getLeftPosition(n, 2) }"></div>
            </div>

            <div class="table-content" :style="{width : `${tableWidth}px`}">
                <div class="table-row-content" :style="{top: getTopPosition(1)}">
                    <div class="table-header mx-2">
                        <strong>Habilitations</strong>
                    </div>
                    <div class="position-absolute text-center" :style="{left:getLeftPosition(index+1), width: `${size}px`}" style="top: 0px" v-for="(week, index) in periode" :key="index">
                        <div>{{ week.annee.slice(2,4) }}</div>
                        <div class="text-secondary">S{{ week.semaine }}</div>
                    </div>
                </div>

                <div class="table-row-content" v-for="(habilitation, index) in habilitationsPersonnel" :style="{ top: getTopPosition(index+2) }" :key="index">
                    <div class="table-header mx-2 fs-7">
                        {{ getHabilitationNameById(habilitation.characteristic_id) }}
                    </div>

                    <div v-for="kn in getControlsByCharacteristicTypeId(habilitation.characteristic_id)" :key="kn" class="control-result-item btn m-1" :class="[classSAMI(kn.sami)]" :style="{ left: leftkn(kn) }">
                        {{ kn.sami }}
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
    max-width:  85px;
    min-width: 85px;        
    width: 85px;
    max-height:50px;
    overflow: hidden;
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

.table-grid, .table-content {
    position: absolute;
    top:0px;
    left:0px;
    bottom:0px;
    width:100%;
}

.table-grid {
    z-index:1;
}

.table-content {
    z-index: 2;
}

.table-row, .table-row-content {
    height:50px;
    position: absolute;
    left:0px;
    width:100%;
}

.table-row {
    border-left-width: 0px !important;
    border-right-width: 0px !important;
}

.table-row-content {
    overflow: hidden;
}

.table-col {
    border-top-width: 0px !important;
    border-bottom-width: 0px !important;
    width:50px;
    position: absolute;
    top:0px;
    bottom:0px;
}

.table-header {
    line-height: 50px;
}

</style>

<script>

import UserImage from '../pebble-ui/UserImage.vue';

export default {

    props:{
        personnel: Object,
        periode: Array,
        habilitations: Array,
        kns: Array,
        habilitationsPersonnel: Array
    },

    data() {
		return {
			size : 50,
            firstColumnWidth: 200
		}
	},

    components: {UserImage},

    computed: {
        /**
         * Retourne le nombre de lignes du tableau, incluant l'entête
         */
        rows() {
            return Math.round(this.habilitationsPersonnel.length / 2) + 1;
        },

        /**
         * Retourne le nombre de colonne du tableau incluant l'entête
         */
        cols() {
            return Math.round(this.periode.length / 2);
        },

        /**
         * Retourne la hateur du tableau en pixel
         */
        tableHeight() {
            return (this.habilitationsPersonnel.length + 1) * this.size;
        },

        /**
         * Retourne la largeur du tableau
         */
        tableWidth() {
            return this.periode.length * this.size + this.firstColumnWidth;
        }
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

            let temp_kns = this.getControlsByCharacteristicTypeId(id);

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
            let knDate = new Date(kn.date_done);
            const startWeek = typeof this.periode[0] !== 'undefined' ? parseInt(this.periode[0].semaine) : 0;
            const left = (((knDate.getWeek() - startWeek) * this.size) + this.firstColumnWidth) + "px";

            return left;
        },

        /**
         * Filtre la liste des kns avec l'id du personnel et renvoie le dernier kn effectué si plusieurs kn sont marqué la meme semaine  
         * 
         * @param {number} id 
         * 
         * @returns {array}
         */
        getControlsByCharacteristicTypeId(id) {
            let controls = this.kns.filter(item => item.habilitation_type_id === id);

            let list = [];
            let weeks = [];

            for (let i = controls.length; i>0; i--) {
                const n = i-1;
                const date = new Date(controls[n].date_done);
                const yearAndWeek = `${date.getFullYear()}${date.getWeek()}`;

                if (!weeks.includes(yearAndWeek)) {
                    list.unshift(controls[n]);
                    weeks.push(yearAndWeek);
                }
            }

            return list;
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
                return label.replace(/^Habilitation\s?:?\s?/, "");
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

        /**
         * Retourne la position depuis le haut en fonction du numéro de la ligne
         * 
         * @param {number} n Le numéro de la ligne
         * @param {number} coef Un coeficient multiplicateur pour tracer la grille (défaut 1)
         * 
         * @return {string}
         */
        getTopPosition(n, coef) {
            coef = typeof coef === "undefined" ? 1 : coef;
            const top = (n-1) * (this.size * coef);
            return top+"px";
        },

        /**
         * Retourne la position de la colonne depuis la gauche en fonction du numéro de la colonne
         * 
         * @param {number} n Le numéro de la colonne
         * @param {number} coef Un coeficient multiplicateur pour tracer la grille (défaut 1)
         * 
         * @return {string}
         */
        getLeftPosition(n, coef) {
            coef = typeof coef === "undefined" ? 1 : coef;
            const left = (n-1) * (this.size * coef) + this.firstColumnWidth;
            return left+"px";
        },

        /**
         * Retourne le nom de l'habilitation par son ID
         * 
         * @param {number} id L'ID de l'habilitation à trouver
         * 
         * @return {string}
         */
        getHabilitationNameById(id) {
            const habilitation = this.habilitations.find(e => e.id == id);
            return habilitation ? habilitation.nom : "Habilitation non trouvée";
        }
    },
}

</script>
