<template>
	<div>
		<AppSearchBar @search="searchFIS()" :pending="pending.personnelsFIS" @filterShow="displayFISFilter=true" @filterHide="displayFISFilter=false">
			<PersonnelsFilter v-if="displayFISFilter" v-model:contratDd="contratDdFilter" v-model:contratDf="contratDfFilter" v-model:withContrat="withContratFilter" v-model:withoutContrat="withoutContratFilter" v-model:ordre="ordre"/>
		</AppSearchBar>

		<template v-if="pending.personnelsFIS">
			<AppMenuItem v-for="agent in personnelsFIS" :key="agent.id" :href="'/operateur/' + agent.id">
				<FicheIndividuelleSuiviItem :agent="agent" :stats="getStatsByAgent(agent.id)"/>
			</AppMenuItem>

			<div class="alert alert-info m-2" v-if="!personnelsFIS?.length">
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
import FicheIndividuelleSuiviItem from "@/components/List/FicheIndividuelleSuiviItem.vue";
import Spinner from "@/components/pebble-ui/Spinner.vue";
import {mapState} from "vuex";

export default {
	components: {Spinner, FicheIndividuelleSuiviItem, AppMenuItem, AppSearchBar, PersonnelsFilter},

	data() {
		return {
			displayFISFilter: false,

			contratDdFilter: null,
			contratDfFilter: null,
			withContratFilter: true,
			withoutContratFilter: false,
			ordre: "Croissant"
		}
	},

	computed: {
		...mapState(["pending", "personnelsFIS", "personnels"])
	},

	methods: {
		/**
		 * Active Le filtre sur le personnel pour retourner les données en fonction des parametre choisis dans le filtre
		 */
		async searchFIS() {
			this.$assets.getCollection("personnelsFIS").reset();
			await this.$assets.getCollection("personnelsFIS").load(
				{
					contratDdFilter: this.contratDdFilter,
					contratDfFilter: this.contratDfFilter,
					withContratFilter: this.withContratFilter,
					withoutContratFilter: this.withoutContratFilter,
					ordre: this.ordre
				}
			);
		}
	},

	mounted() {
		this.searchFIS();
	}
}
</script>

<style scoped lang="scss">

</style>