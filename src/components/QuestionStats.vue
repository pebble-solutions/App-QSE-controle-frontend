<template>
    <div>
        <div class="row">
            <div class="col-12 col-md-6 mt-3">
                <JaugeSami :personnalAverage="blocs[0].questions[0].personnel[0].stats.average"
                    :name="blocs[0].questions[0].personnel[0].stats.personnelName"
                    :generalAverage="blocs[0].questions[0].global.average" />
            </div>
            <div class="col-12 col-md-6">
                <div class="row">
                    <div class="col-6">
                        <AffichageMoyenne :personnalAverage="blocs[0].questions[0].personnel[0].stats.average"
                            :generalAverage="blocs[0].questions[0].global.average" />
                    </div>
                    <div class="col-6">
                        <LastControlAndResult :date="blocs[0].questions[0].personnel[0].stats.lastResultDate"
                            :result="blocs[0].questions[0].personnel[0].stats.lastResult" />
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
    data() {
        return {
            // Données utilisées dans le composant
            "blocs": [
                {
                    "id": 4,
                    "questions": [
                        {
                            "id": 1261,
                            "global": {
                                "id": 51,
                                "average": "5.84",
                                "nbResults": 4,
                                "S": 1,
                                "A": 2,
                                "M": 0,
                                "I": 1,
                                "questionId": 1261
                            },
                            "personnel": [
                                {
                                    "id": "561",
                                    "stats": {
                                        "id": 51,
                                        "average": "5.56",
                                        "nbResults": 3,
                                        "S": 1,
                                        "A": 2,
                                        "M": 0,
                                        "I": 1,
                                        "lastResult": "I",
                                        "lastResultDate": "2021-06-15",
                                        "personnelName": "Gérard",
                                        "questionId": 1261,
                                        "personnelId": 561
                                    }
                                }
                            ]
                        },
                    ]
                }
            ]
        }
    },

    components: { LastControlAndResult, JaugeSami, AffichageMoyenne },
};
</script>
