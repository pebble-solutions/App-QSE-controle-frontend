<template>
	<div>
		<AppSearchBar @search="search()" :pending="pending.personnelsFiltered" @filterShow="displayFilter=true" @filterHide="displayFilter=false">
			<PersonnelsFilter v-if="displayFilter" v-model:contratDd="contratDdFilter" v-model:contratDf="contratDfFilter" v-model:withContrat="withContratFilter" v-model:withoutContrat="withoutContratFilter" v-model:ordre="ordre"/>
		</AppSearchBar>

		<template v-if="!pending.personnelsFiltered">
			<AppMenuItem v-for="personnel in personnelsFiltered" :key="personnel.id" :href="'/operateur/' + personnel.id">
				<slot :personnel="personnel"></slot>
			</AppMenuItem>

			<div class="alert alert-info m-2" v-if="!personnelsFiltered?.length">
				Il n'y a pas de personnels concernés
			</div>
		</template>

		<Spinner v-else />
	</div>
</template>

<script>
import PersonnelsFilter from "@/components/filter/PersonnelsFilter.vue";
import AppSearchBar from "@/components/pebble-ui/AppSearchBar.vue";
import AppMenuItem from "@/components/pebble-ui/AppMenuItem.vue";
import Spinner from "@/components/pebble-ui/Spinner.vue";
import {mapState} from "vuex";

export default {
	components: {Spinner, AppMenuItem, AppSearchBar, PersonnelsFilter},

	data() {
		return {
			displayFilter: false,

			contratDdFilter: null,
			contratDfFilter: null,
			withContratFilter: true,
			withoutContratFilter: false,
			ordre: "croissant"
		}
	},

	computed: {
		...mapState(["pending", "personnelsFiltered"]),
	},

	methods: {
		/**
		 * Active Le filtre sur le personnel pour retourner les données en fonction des parametre choisis dans le filtre
		 */
		async search() {
			this.$assets.getCollection("personnelsFiltered").reset();
			await this.$assets.getCollection("personnelsFiltered").load(
				{
					contratDd: this.contratDdFilter,
					contratDf: this.contratDfFilter,
					withContrat: this.withContratFilter ? 1 : 0,
					withoutContrat: this.withoutContratFilter ? 1 : 0,
					ordre: this.ordre
				}
			);
		},


	},

	mounted() {
		this.search();
	}
}
</script>

<style scoped lang="scss">

</style>