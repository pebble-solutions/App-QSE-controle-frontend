<template>
    <div>{{collectes}}</div>
</template>

<script>
import { mapActions, mapState } from 'vuex';

export default {

    data() {
        return {
            pending: {
                collectes: true
            }
        }
    },

    computed: {
        ...mapState(['formulaire', 'collectes', 'listActifs'])
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
					return data;
				})
				.catch(this.$app.catchError).finally(() => this.pending.collectes = false);
		},
    },

    beforeRouteUpdate(to) {
        if (this.formulaire?.id != to.params.id) {
            this.openFormulaire(to.params.id);
            this.loadCollectes(to.params.id);
        }
    },

    mounted() {
        this.openFormulaire(this.$route.params.id);
        this.loadCollectes(this.$route.params.id);
    },
}

</script>