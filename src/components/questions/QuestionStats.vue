<template>
    <div class="d-flex  align-items-center" :class="className">
        <div class="col-12 col-md-6 my-3" v-if="personnelStatsAverage != null">
            <JaugeSami :personnalAverage="personnelStatsAverage" :name="personnelName" :generalAverage="generalStatsAverage" />
        </div>

        <div class="col-12 col-md-4">
            <LastControlAndResult :date="personnelLastResultDate" :value="personnelLastResult" :textStart="textDisplayClass" v-if="personnelLastResultDate" />
        </div>
    </div>
</template>


<script>
import { mapState } from 'vuex';
import JaugeSami from '../JaugeSami.vue';
import LastControlAndResult from '../LastControlAndResult.vue';
// import AffichageMoyenne from '../AffichageMoyenne.vue';

export default {
    components: { JaugeSami, LastControlAndResult },

    props: {
        stats: Object
    },

    computed: {
        ...mapState(['listActifs']),

        /**
         * Retourne le nom du personnel
         */
        personnelName() {
            let personnel = this.listActifs.find(personnel => personnel.id == this.stats.personnel[0].id);

            if (!personnel) {
                return 'personnel non trouvé';
            }

            return personnel.cache_nom;
        },

        /**
         * Retourne la note moyenne du personnel sur la question
         */
        personnelStatsAverage() {
            return this.stats.personnel[0].stats.average;
        },

        /**
         * Retourne la note moyenne global de la question
         */
        generalStatsAverage() {
            return this.stats.global.average;
        },

        /**
         * Retourne le dernier resultat de la question par le personnel
         */
        personnelLastResult() {
            return this.stats.personnel[0].stats.lastResult;
        },

        /**
         * Retourne la date du dernier resultat de la question par le personnel
         */
        personnelLastResultDate() {
            let date = this.stats.personnel[0].stats.lastResultDate;

            console.log('data parent', this.stats);

            return date;
        },

        className() {
            if (this.personnelStatsAverage == null) {
                return 'justify-content-start';
            }

            return 'justify-content-center';
        },

        textDisplayClass() {
            if (this.personnelStatsAverage == null) {
                return true;
            }

            return false;
        }
    }
};
</script>
  