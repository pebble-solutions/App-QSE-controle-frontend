<template>
    <div class="card">
        <JaugeMoyenneSami :n1="7.2" :n2="8" />
        <LastControlAndResult date="2023-04-15" result="M" />
    </div>
</template>

<script>
import {mapState} from 'vuex'; 
import JaugeMoyenneSami from '../components/JaugeMoyenneSami.vue';
import LastControlAndResult from './LastControlAndResult.vue';

export default {

    props: {
    stats: Array
},

    computed: {
        ...mapState(['formulaires']),
    },

    components: {
        JaugeMoyenneSami, LastControlAndResult
    },
}
</script>