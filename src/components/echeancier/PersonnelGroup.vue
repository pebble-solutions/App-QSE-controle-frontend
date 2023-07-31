<template>
    <div class="my-3">
        <div class="d-flex align-items-center my-2 mx-2">
            <div class="me-2">
                <UserImage :name="personnel.cache_nom" />
            </div>
            <h3 class="my-0 fs-5">{{ personnel.cache_nom }}</h3>
        </div>

        <weeks-grid-table
            :grid="grid"
            headerLabel="Habilitations"
            v-if="grid">

            <habilitation-personnel-row
                :contrats="personnelContrats"
                :controls="getControlsByCharacteristicTypeId(habilitationType.id)"
                :grid="grid"
                :personnel="personnel"
                :rowIndex="index"
                :rowLabel="habilitationType.nom"
                :habilitationsPersonnels="getHabilitationsPersonnelByTypeId(habilitationType.id)"
                :habilitationType="habilitationType"
                
                v-for="(habilitationType, index) in usedHabilitations"
                :key="index" />

        
        </weeks-grid-table>
    </div>
</template>

<script>
import { mapState } from 'vuex';

import UserImage from '../pebble-ui/UserImage.vue';
import { WeeksGrid } from '../../js/grid/WeeksGrid';
import WeeksGridTable from '../grid/WeeksGrid.vue';
import HabilitationPersonnelRow from './HabilitationPersonnelRow.vue';

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
            firstColumnWidth: 200,
            grid: null
		}
	},

    components: {UserImage, WeeksGridTable, HabilitationPersonnelRow},

    computed: {
        ...mapState(['echeancier']),

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
         * Initialise la grille d'affichage
         */
        initGrid() {
            this.grid = new WeeksGrid({
                columnWidth: this.size,
                rowHeight: this.size,
                firstColumnWidth: this.firstColumnWidth,
                dateStart: this.echeancier.dd,
                dateEnd: this.echeancier.df,
                rows: this.habilitationsPersonnel.length + 1
            });
        }
    },

    mounted() {
        this.initGrid();
    }
}

</script>
