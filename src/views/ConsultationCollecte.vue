<template>
    <Spinner v-if="pending.collectes" />
    <template v-else>
        <div v-if="formulaire" class="container py-2">
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
                <div v-for="col in collectes" :key=col.id class="list-group-item" @click="loadCollecteModal(col.id)" type="button">
                    <collecte-headband :collecte="col" :personnels="listActifs" :editable="false"/>
                </div> 
    
            </div>
            <div v-if="btnPlus" class="d-flex justify-content-end py-3">
                <button @click.prevent="loadCollectes(formulaire.id)" class="btn btn-outline-primary">+ de résultats</button>
            </div>
            <!-- libellé{{ formulaire.groupe }},
            formualaire id{{ formulaire.id }},
            formulaire nb done{{ formulaire.nb_done }},
            collectes longueur{{ collectes.length }}, -->
        </div>

        <router-view></router-view>
    </template>
</template>

<script>
import { mapActions, mapState } from 'vuex';
import date from 'date-and-time';
import fr from 'date-and-time/locale/fr';
import CollecteHeadband from '../components/CollecteHeadband.vue';
import Spinner from '../components/pebble-ui/Spinner.vue';

export default {

    data() {
        return {
            pending: {
                collectes: true
            },
            btnPlus: false,
        }
    },

    computed: {
        ...mapState(['formulaires', 'formulaire', 'collectes', 'listActifs']),

        /**
         * Retourne le libellé du nombre de requêtes programmées en fonction le la liste collectes
         * 
         * @return {string}
         */
        collectes_number_label() {
            let count = this.collectes.length;
            if (count) {
                let s = count > 1 ? "s" : "";
                
                let label = `${count} collecte${s} terminée${s}`;
                return label;
            }
            return "Aucun contrôle terminé";
        },

        // BtnPlus() {
            
        //     if (count>50) {
        //     }
        //     returnt
        // }
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
		loadCollectes(id) {
            this.pending.collectes = true;
        
            return this.$app.apiGet('data/GET/collecte', {done:'OUI', information__groupe_id:id})
				.then(data => {
					this.setCollectes(data);
					return data;
				})
				.catch(this.$app.catchError).finally(() => this.pending.collectes = false);
		},

        LoadFollowingCollectes(id) {
            this.pending.collectes = true;
            console.log(this.collectes.length);
            console.log(this.formulaire.id);

            let count = this.collectes.length;
            if(count>49) {
                this.btnPlus = true
                return this.$app.apiGet('data/GET/collecte', { done: 'OUI', information__groupe_id:id, start:0})
				.then(data => {
                    console.log(data, 'data');
					this.setCollectes(data);
					return data;
				})
				.catch(this.$app.catchError).finally(() => this.pending.collectes = false);
            }
            else {this.btnPlus= false}
        },

        /**
         * Récupere le nom du groupe d'information de la collect via un id de
         * 
         * @param {number} groupInformationId l'id du group information de la collecte
         * 
         * @return {string}
         */
        getGroupNameFromId(groupInformationId) {
            let groupInformation = this.formulaires.find(e => e.id == groupInformationId);
    
            if (groupInformation) {
                return groupInformation.groupe;
            }
            else { 
                return null ;
            }
        },

        /**
		 * Modifie le format de la date entrée en paramètre et la retourne 
		 * sous le format 01 févr. 2021
		 * @param {string} date 
		 */

		changeFormatDateLit(el) {
			date.locale(fr);
			return date.format(new Date(el), 'DD MMM YYYY')
		},

        /**
         * Récupère le nom d'un personnel actif via un id
         * 
         * @param {number} personnelId l'id d'un personnel actif
         * 
         * @return {string}
         */
        getPersonnelNameFromId(personnelId) {
            let personnelName = this.listActifs.find(personnel => personnel.id == personnelId);
    
            if (personnelName) {
                return personnelName.cache_nom;
            } else {
                return null
            }
        },

        loadCollecteModal(colId) {
            this.$router.push({name:'ConsultationResponses', params:{id: this.$route.params.id, idCollecte: colId}});
        },
    },

    components: { CollecteHeadband, Spinner },

    beforeRouteUpdate(to) {
        if (this.formulaire?.id != to.params.id) {
            this.openFormulaire(to.params.id);
            this.loadCollectes(to.params.id);
        }
    },

    mounted() {
        this.openFormulaire(this.$route.params.id);
        this.loadCollectes(this.$route.params.id);
        // this.LoadFollowingCollectes(this.$route.params.id);


    },
}

</script>