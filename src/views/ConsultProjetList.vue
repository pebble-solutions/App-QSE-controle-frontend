<template>

    list des collectes par id:projet
    <div class="list-group" v-if="collectes">
        <div v-for="col in collectes" :key=col.id class="list-group-item" >
            
                {{ col.information__groupe_id }}
                <collecte-headband :collecte="col" :personnels="listActifs"/>

        </div>
    </div>  
        
        
        <router-view></router-view>
    
</template>
<script>
import { mapActions, mapState } from 'vuex'
import CollecteHeadband from '../components/CollecteHeadband.vue';
export default {

    components:{CollecteHeadband},

    computed: {
        ...mapState(['formulaire','formulaires', 'listActifs', 'collectes'])
    },
    methods: {
        ...mapActions(['setCollectes', 'openFormulaire']),

    }


}

</script>

