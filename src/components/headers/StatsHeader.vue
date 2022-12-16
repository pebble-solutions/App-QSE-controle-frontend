<template>
    
    <div class="mx-3">
        <div class="d-flex align-items-center" v-if="stats">
            <button type="button" class="btn btn-dark me-2" @click.prevent="emptyStat()">
                <i class="bi bi-arrow-left"></i>
            </button>
            <span>Statistiques pour {{personnelNom}}</span>
        </div>
    
        <span v-else>Statistiques</span>
    </div>

</template>

<script>
import { mapActions, mapState } from 'vuex';
import { getPersonnelStats } from '../../js/stats';

export default {
    computed: {

        ...mapState(['stat']),

        /**
		 * Retourne la première ligne de stats contenue dans le store
		 * @return {object}
		 */
		stats() {
			return getPersonnelStats(this.stat);
		},

        /**
		 * Retourne le nom du personnel chargé.
		 * @return {string}
		 */
		personnelNom() {
			if (this.stats) {
				return this.stats.nom;
			}
			return "Sans nom";
		}
    },

    methods: {
        ...mapActions(['refreshStat']),

        /**
         * Vide le tableau de stats pour revenir à l'accueil
         */
        emptyStat() {
            this.refreshStat(null);
        }
    }
}


</script>