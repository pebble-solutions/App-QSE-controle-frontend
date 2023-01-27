<template>
    <!-- {{ formulaire }}
    <div class="d-flex flex-row justify-content-between align-items-center py-3">
        <div class="d-flex flex-row flex-wrap justify-content-between align-items-center">
            <h1 class="fs-3 m-0 me-2">{{formulaire.groupe}}</h1> 
            <div class="text-secondary"></div>
        </div>
        <div>
        </div>
    </div>
    <div v-if="formulaires" class="container py-2">
        <div v-for="form in formulaires" :key="form.id">{{ form.id }} {{ form.groupe }}</div>
    </div> -->
    <div class="list-group" v-if="collectes">
        <div v-for="col in collectes" :key=col.id class="list-group-item" >
            
                {{ col.information__groupe_id }}
                <collecte-headband :collecte="col" :personnels="listActifs"/>

        </div>
    </div>  
    <!-- <div v-for="col in newCollectes" :key=col.id class="list-group-item bg-primary" >
        <div v-if=" col.information__groupe_id === this.$route.params.id">{{ col.id }} YOUPI</div>
            
            {{ col.information__groupe_id }}
            <collecte-headband :collecte="col" :personnels="listActifs"/>

    </div>           -->
        <router-view></router-view>
</template>

<script>
import { mapActions, mapState } from 'vuex'
import CollecteHeadband from '../components/CollecteHeadband.vue';
export default{
    components:{CollecteHeadband},

    data() {
        return {

            pending: {
                collectes: true,
                formulaire : true,
            },
            newCollectes: [],
        }
    },
    computed: {
        ...mapState(['formulaire','formulaires', 'listActifs', 'collectes'])
    },
    methods: {
        ...mapActions(['setCollectes', 'openFormulaire']),
		/**
		 * Charge les collectes depuis le serveur et les stock dans le store
		 * 
         * @param {number} information__groupe_id   id du formulaire pour restreindre la recherche
         * 
		 * @return {Promise<object>}
		 */
        loadCollectes(information__groupe_id) {
            this.pending.collectes = true;
            return this.$app.apiGet('data/GET/collecte', {limite: 'aucune', done: 'OUI', information__groupe_id})
				.then(data => {
					this.setCollectes(data);
                    this.newCollectes = data;
					return data;
				})
				.catch(this.$app.catchError)
				.finally(() => this.pending.collectes = false);
		},

    },
    beforeRouteUpdate(to) {
        if (this.formulaire?.id != to.params.id) {
            this.openFormulaire(to.params.id);
            this.loadCollectes(to.params.id);
        }
    },
    mounted() {
        this.loadCollectes(this.$route.params.id);
        console.log(this.loadCollectes(), 'collectes')
        this.openFormulaire(this.$route.params.id);
        console.log(this.openFormulaire(),'formulaire');
    },
}
</script>







