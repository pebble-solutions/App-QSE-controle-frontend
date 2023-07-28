<template>
    <div class="my-3">
        <div class="d-flex align-items-center my-2 mx-2">
            <div class="me-2">
                <UserImage :name="personnel.cache_nom" />
            </div>
            <h3 class="my-0 fs-5">{{ personnel.cache_nom }}</h3>
        </div>

        <div class="position-relative border-bottom border-secondary" :style="{height : `${tableHeight}px`, width : `${tableWidth}px`}">

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
                        <div class="pt-1 fs-7 text-muted">{{ week.annee }}</div>
                        <div>S{{ week.semaine }}</div>
                    </div>
                </div>

                <div class="table-row-content" v-for="(habilitation, index) in usedHabilitations" :style="{ top: getTopPosition(index+2) }" :key="index">
                    <div class="table-header mx-2 fs-7">
                        {{ habilitation.nom }}
                    </div>

                    <div 
                        class="habilitation-timeline bg-info bg-gradient bg-opacity-25 border border-info fs-7 px-2" 
                        :style="{left: getLeftPosition(getWeekStartInTimeline(habilitationPersonnel.dd) +1), width: getWidth(getWeekEndInTimeline(habilitationPersonnel.dd, habilitationPersonnel.df), 'px')}" 
                        :title="getHabilitationPersonnelLabel(habilitationPersonnel)" 
                        
                        v-for="habilitationPersonnel in getHabilitationsPersonnelByTypeId(habilitation.id)" 
                        :key="habilitationPersonnel.id">

                        <span class="label-timeline">{{ getHabilitationPersonnelLabel(habilitationPersonnel) }}</span>
                    </div>

                    <template v-for="contrat in personnelContrats" :key="contrat.id">
                        <div 
                            class="contrat-timeline bg-secondary bg-gradient bg-opacity-25 border border-secondary text-secondary fs-7 px-2" 
                            :style="{left: getLeftPosition(getWeekStartInTimeline(contrat.dentree) +1), width: getWidth(getWeekEndInTimeline(contrat.dsortie_reelle ? contrat.dsortie_relle : contrat.dsortie), 'px')}" 
                            v-if="isContratInPeriode(contrat)" 
                            :title="getContratLabel(contrat)">
                            <span class="label-timeline">{{ getContratLabel(contrat) }}</span>
                        </div>
                    </template>

                    <template 
                        v-for="(kn, index) in getControlsByCharacteristicTypeId(habilitation.id)" 
                        :key="kn">

                        <div 
                            class="control-timeline bg-gradient"
                            :class="[getHabilitationBg(kn)]"
                            :style="{ left: getLeftPosition(getWeekStartInTimeline(kn.date_done) +1), width: getWidth(getControlValidityWeeks(index, habilitation.id, 26), 'px') }"></div>
                        
                        <div 
                            class="control-timeline bg-danger bg-gradient fs-7"
                            :style="{ left: getLeftPosition(getWeekStartInTimeline(kn.date_done) + 1 + getControlValidityWeeks(index, habilitation.id, 26)), width: getWidth(getControlBlankWeeks(index, habilitation.id), 'px') }"
                            v-if="getControlBlankWeeks(index, habilitation.id)"
                            title="Contrôle expiré">
                        </div>

                        <div 
                            class="control-result-item rounded m-1" 
                            :class="[classSAMI(kn.sami)]" 
                            :style="{ left: getLeftPosition(getWeekStartInTimeline(kn.date_done) +1) }"
                            :title="kn.date_done">{{ kn.sami }}</div>
                    </template>
                </div>
            </div>
        </div>
    </div>
  </template>
  

<style lang="scss">

.control-result-item {
    position: absolute;
    z-index: 2;
    width: 40px;
    line-height: 40px;
    height: 40px;
    text-align:center;
    top:0px;
}

.habilitation-timeline, 
.control-timeline, 
.contrat-timeline {
    position:absolute;
    overflow:hidden;
    white-space: nowrap;
}

.habilitation-timeline, 
.contrat-timeline {
    height:25px;
    z-index:1;
}

.label-timeline {
    line-height: 25px;
}

.habilitation-timeline {
    top:0px;
}

.contrat-timeline {
    top:25px;
}

.control-timeline {
    height:5px;
    z-index: 2;
    top:20px;
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
import { mapState } from 'vuex';

import UserImage from '../pebble-ui/UserImage.vue';
import { dateFormat } from '../../js/date';
import { diffDate } from '../../js/date';

export default {

    props:{
        personnel: Object,
        periode: Array,
        habilitations: Array,
        kns: Array,
        habilitationsPersonnel: Array,
        contrats: Array
    },

    data() {
		return {
			size : 50,
            firstColumnWidth: 200
		}
	},

    components: {UserImage},

    computed: {
        ...mapState(['echeancier']),

        /**
         * Retourne le nombre de lignes du tableau, incluant l'entête
         */
        rows() {
            return Math.trunc(this.habilitationsPersonnel.length / 2) + 1;
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
        },

        /**
         * Retourne la liste des habilitation utilisées par le personnel
         */
        usedHabilitations() {
            let habilitations = [];

            this.habilitationsPersonnel.forEach((habilitationPersonnel) => {
                const found = habilitations.find(e => e.id == habilitationPersonnel.characteristic_id);

                if (!found) {
                    habilitations.push(this.getHabilitationById(habilitationPersonnel.characteristic_id));
                }
            });

            return habilitations;
        },

        /**
         * Retourne les contrats du personnel
         */
        personnelContrats() {
            return this.contrats.filter(e => e.structure__personnel_id == this.personnel.id);
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
         * Retourne la hauteur de la ligne du tableau
         * 
         * @returns {number} height 
         */
        height() {
            return (this.habilitations.length + 1) * 50
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
                s: "text-bg-success",
                a: "text-bg-primary",
                m: "text-bg-warning",
                i: "text-bg-danger"
            }

            return classList[ref?.toLowerCase()];
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
         * Retourne le numéro de la semaine de début relatif à la timeline
         * 
         * La semaine 0 de la date de référence correspond au début de la timeline. Si la date de référence commence avant
         * la timeline, elle est considéré débutant à 0.
         * 
         * @param {string} refDd La date de début de référence
         * 
         * @return {number}
         */
        getWeekStartInTimeline(refDd) {
            const weeks_diff = Math.ceil( diffDate(this.echeancier.dd, refDd, 'week'));
            return weeks_diff < 0 ? 0 : weeks_diff;
        },

        /**
         * Retourne le numéro de la semaine de fin relatif à la timeline
         * 
         * 0 correspond au début de la timeline, X correspond à la fin de la timeline. La valeur retournée est 
         * entrer 0 et X. Si la référence prend fin après la timeline, X est retourné.
         * 
         * @param {string} refDd Date de référence de début
         * @param {string} refDf Date de référence de début
         * 
         * @return {number}
         */
        getWeekEndInTimeline(refDd, refDf) {
            refDf = refDf ? refDf : this.echeancier.df;
            const weeks_diff = Math.ceil( diffDate(refDd, refDf, 'week'));

            const timeline_space = this.periode.length - this.getWeekStartInTimeline(refDd);

            return weeks_diff > timeline_space ? timeline_space : weeks_diff;
        },

        /**
         * Retourne la largeur d'un élément en fonction du nombre de colonnes à occuper
         * 
         * @param {number} cols Nombre de la colonne
         * @param {string} sx   Le suffixe à ajouter (ex px)
         * 
         * @return {number|string}
         */
        getWidth(cols, sx) {
            const width = cols * this.size;
            return typeof sx !== 'undefined' ? `${width}${sx}` : width;
        },

        /**
         * Retourne un libellé indiquant la date de début et de fin d'une habilitation pour un personnel. $
         * 
         * @param {object} habilitationPersonnel L'Habilitation du personnel à transformer
         * 
         * @return {string}
         */
        getHabilitationPersonnelLabel(habilitationPersonnel) {
            return "Habilité du "+dateFormat(habilitationPersonnel.dd)+" au "+dateFormat(habilitationPersonnel.df);
        },

        /**
         * Retourne une habilitation par son ID
         * 
         * @param {number} id ID de l'habilitation à trouver
         * 
         * @return {object}
         */
        getHabilitationById(id) {
            return this.habilitations.find(e => e.id == id);
        },

        /**
         * Retrourne la liste des habilitations du personnel pour un type donné.
         * 
         * @param {number} characteristicId L'ID de la caractéristique à trouver
         * 
         * @return {array}
         */
        getHabilitationsPersonnelByTypeId(characteristicId) {
            return this.habilitationsPersonnel.filter(e => e.characteristic_id == characteristicId);
        },

        /**
         * Retourne true si le contrat est entre la periode défini sinon retourne false
         * 
         * @param {object}    contrat
         * 
         * @return {string}
         */
        isContratInPeriode(contrat) {
            const dsortie = contrat.dsortie_reelle ?? contrat.dsortie;
            if (contrat.dentree >= this.echeancier.dd && contrat.dentree <= this.echeancier.df
                || contrat.dentree <= this.echeancier.df && !dsortie
                || contrat.dentree <= this.echeancier.df && dsortie && dsortie >= this.echeancier.df
                || contrat.dentree <= this.echeancier.df && dsortie && dsortie >= this.echeancier.dd && dsortie <= this.echeancier.df) {
                    return true;
            }

            return false;
        },

        /**
         * Retourne le type de contrat à afficher en fonction du personnel
         * 
         * @param {Object} contrat
         * 
         * @returns {string}  
         */
        getContratLabel(contrat) {

            if (!contrat.dentree) {
                return "Erreur : pas de date sur le contrat";
            }

            let label = "Contrat du "+dateFormat(contrat.dentree);

            const dsortie = contrat.dsortie_reelle ? contrat.dsortie_reelle : contrat.dsortie;

            if (dsortie) {
                label += " au "+dateFormat(dsortie);
            }
            else {
                label += " sans date de sortie prévue.";
            }

            return label;
        },

        /**
         * Retourne le nombre de semaines de validité d'un contrôle par rapport au suivant,
         * borné sur a timeline
         * 
         * @param {number} index                L'index du contrôle dans la collection des controles
         * @param {number} characteristicId     ID de la characteristique à tester
         * @param {number} expirationLimit      Nombre de semaine à expiration
         * 
         * @return {number}
         */
        getControlValidityWeeks(index, characteristicId, expirationLimit) {
            const controls = this.getControlsByCharacteristicTypeId(characteristicId);
            const currentControl = controls[index];
            const nextControl = controls[index+1];

            const dateStart = currentControl.date_done;
            const dateEnd = nextControl ? nextControl.date_done : this.echeancier.df;

            const weeks_diff = Math.ceil( diffDate(dateStart, dateEnd, 'week'));

            return weeks_diff > expirationLimit && expirationLimit ? expirationLimit : weeks_diff;
        },

        /**
         * Retourne la classe CSS d'arrière plan en fonction du résultat d'un KN
         * 
         * @param {object}          control         Le contrôle à tester
         * 
         * @return {string}
         */
        getHabilitationBg(control) {
            const classList = {
                s: "bg-success",
                a: "bg-primary",
                m: "bg-warning",
                i: "bg-danger"
            }

            return classList[control.sami?.toLowerCase()];
        },

        getControlBlankWeeks(index, characteristicId) {
            const diff = this.getControlValidityWeeks(index, characteristicId) - this.getControlValidityWeeks(index, characteristicId, 26);
            return diff > 0 ? diff : 0;
        }
    },
}

</script>
