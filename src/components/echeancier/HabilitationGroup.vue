<template>
    <div class="my-3">
        <div class="d-flex align-items-center my-2 mx-2">
            <h3 class="my-0 fs-5">{{ habilitationTypeDisplayName }}</h3>
        </div>

        <weeks-grid-table
            :grid="grid"
            headerLabel="Opérateur"
            v-if="grid">

            <habilitation-personnel-row
                :contrats="getContratsByPersonnelId(personnel.id)"
                :controls="getControlsByPersonnelId(personnel.id)"
                :grid="grid"
                :personnel="personnel"
                :rowIndex="index"
                :rowLabel="personnel.cache_nom"
                :habilitationsPersonnels="getHabilitationsPersonnels(personnel.id)"
                :habilitationType="habilitationType"
                :useUserImage="true"
                
                v-for="(personnel, index) in usedOperateurs"
                :key="index" />

        
        </weeks-grid-table>
    </div>
</template>

<script>
import { mapState } from 'vuex';
import { WeeksGrid } from '../../js/grid/WeeksGrid';
import WeeksGridTable from '../grid/WeeksGrid.vue';
import HabilitationPersonnelRow from './HabilitationPersonnelRow.vue';

export default {

    props: {
        operateurs: Array,
        periode: Array,
        habilitationType: Object,
        controls: Array,
        contrats: Array,
        habilitationsPersonnels: Array
    },

    data() {
		return {
			size : 50,
            firstColumnWidth: 200,
            grid: null
		}
	},

    computed:{
        ...mapState(['echeancier']),

        /**
         * Retourne la liste du personnel ayant au moins une habilitation sur la période
         * 
         * @return {array}
         */
        usedOperateurs() {
            let operateurs = [];

            this.habilitationsPersonnels.forEach((habilitationPersonnel) => {
                const found = operateurs.find(e => e.id == habilitationPersonnel.personnel_id);

                if (!found) {
                    const operateur = this.getOperateurById(habilitationPersonnel.personnel_id);
                    operateurs.push(operateur ? operateur : {
                        id: habilitationPersonnel.personnel_id,
                        cache_nom: "!Opérateur inconnu"
                    });
                }
            });

            return operateurs;
        },

        /**
         * Retourne le nom du type d'habilitation pour l'affichage.
         * Retire le préfixe "Habilitation : " au nom.
         * 
         * @return {string}
         */
        habilitationTypeDisplayName() {
            return this.habilitationType.nom.replace(/^Habilitation\s*:\s*/, "");
        }
    },

    methods: {
        
        /**
         * Récupère la liste des contrats depuis l'ID d'un personnel
         * 
         * @param {number} personnelId L'ID du personnel en référence
         * 
         * @return {array}
         */
        getContratsByPersonnelId(personnelId) {
            return this.contrats.filter(e => e.structure__personnel_id == personnelId);
        },

        /**
         * Récupère la liste des contrôles depuis l'ID d'un personnel
         * 
         * @param {number} personnelId L'ID du personnel en référence
         * 
         * @return {array}
         */
        getControlsByPersonnelId(personnelId) {
            return this.controls.filter(e => e.personnel_id__operateur == personnelId);
        },

        /**
         * Retourne la liste des habilitations d'un personnel
         * 
         * @param {number} personnelId L'ID du personnel en référence
         * 
         * @return {array}
         */
        getHabilitationsPersonnels(personnelId) {
            return this.habilitationsPersonnels.filter(e => e.personnel_id == personnelId);
        },

        /**
         * Retourne un objet personnel par rapport à son ID
         * 
         * @param {number} personnelId L'ID du personnel en référence
         * 
         * @return {object}
         */
        getOperateurById(personnelId) {
            return this.operateurs.find(e => e.id == personnelId);
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
                rows: this.usedOperateurs.length + 1
            });
        }

    },

    mounted() {
        this.initGrid();
    },

    components: { WeeksGridTable, HabilitationPersonnelRow }
}

</script>


