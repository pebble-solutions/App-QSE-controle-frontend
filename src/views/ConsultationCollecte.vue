<template>
    <div v-if="collectes">
        <div class="d-flex flex-row justify-content-between align-items-center py-3">
            <div class="d-flex flex-row justify-content-between align-items-center">
                <router-link :to="{name:'consultation'}" v-slot="{navigate,href}" custom>
                    <a :href="href" @click="navigate" class="btn btn-light"><i class="bi bi-arrow-left"></i></a>
                </router-link>

                <div class="ms-2">
                    <h1 class="fs-3 m-0">{{formulaire.groupe}}</h1> 
                    <div class="text-secondary">{{collectes_number_label}}</div>
                </div>
            </div>
        </div>

        <div class="list-group">
            <div v-for="col in collectes" :key=col.id class="list-group-item">
                <div class="d-flex flex-row justify-content-between align-items-center">
                    <div class="d-flex align-items-center">

                        <strong class="me-2 text-secondary" style="width:40px">#{{col.id}}</strong>
                        <div>
                            <span  v-if="!getGroupNameFromId(col.information__groupe_id)" class="me-2 text-warning">Type de KN non programmé </span>
                            <span v-else class="me-2">{{getGroupNameFromId(col.information__groupe_id)}}</span>
                            <span class="me-2 text-warning" v-if="!col.date">Date non programmée</span>
                            <span v-else class="me-2">{{changeFormatDateLit(col.date)}}</span>
                            <span  v-if="!getPersonnelNameFromId(col.enqueteur__structure__personnel_id)" class="me-2 text-warning">Contrôleur non programmé </span>
                            <span v-else class="me-2">Contrôleur: {{getPersonnelNameFromId(col.enqueteur__structure__personnel_id)}}</span>
                            <span  v-if="!getPersonnelNameFromId(col.cible__structure__personnel_id)" class="me-2 text-warning">Opérateur non programmé </span>
                            <span v-else class="me-2">Opérateur: {{getPersonnelNameFromId(col.cible__structure__personnel_id)}}</span>
                            <!-- <span  v-if="!getPersonnelNameFromId(col.cible__structure__personnel_id)" class="me-2 text-warning">Opérateur non programmé </span>
                            <span v-else class="me-2">Opérateur: {{getPersonnelNameFromId(col.cible__structure__personnel_id)}}</span> -->
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
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