<template>
    <div>
        Affiche la collecte dans la vue principale
    </div>
    <consultation-collecte-resume :collecte ="collecte" :readonly="true"></consultation-collecte-resume>

</template>
<script>
import {mapState} from 'vuex';

import ConsultationCollecteResume from '../components/ConsultationCollecteResume.vue';

export default {
    components:{ConsultationCollecteResume},

    computed: {
        ...mapState(['collecte']),
    }
}

</script>