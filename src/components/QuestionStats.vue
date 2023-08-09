<template>
    <div>
        <div class="row">
            <div class="col-12 col-md-6 mt-3">
                <JaugeSami  :personnalAverage="stats.personnel[0].stats.average"
                            :name="personnel en fonction de stats.personnel[0].id"
                            :generalAverage="stats.global.average" />
            </div>
            <div class="col-12 col-md-6">
                <div class="row">
                    <div class="col-6">
                        <AffichageMoyenne       :personnalAverage="stats.personnel[0].stats.average"
                                                :generalAverage="stats.global.average" />
                    </div>
                    <div class="col-6">
                        <LastControlAndResult   :date="stats.personnel[0].stats.lastResultDate"
                                                :result="stats.personnel[0].stats.lastResult" />
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import LastControlAndResult from './LastControlAndResult.vue';
import AffichageMoyenne from './AffichageMoyenne.vue';
import JaugeSami from './JaugeSami.vue';

export default {
    props: {
        stats: {
            type: Object,
            required: true,
        },
    },
  

    components: { LastControlAndResult, JaugeSami, AffichageMoyenne },
};
</script>
