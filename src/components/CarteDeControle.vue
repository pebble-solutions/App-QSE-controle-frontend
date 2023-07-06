<template>
	<div class="row bg-light rounded shadow p-2 m-2 mb-2">
		<div class="fw-light text-secondary text-center mb-2 fw-bold">
			KN annonceur - <span class="badge" :class="badgeClass">
				<i class="bi bi-hourglass"></i>
				{{ getDateDifference(dfCritique) }} j
			</span>
		</div>

		<div class="col-12 col-lg-6 mb-3 mb-lg-0 d-flex flex-column justify-content-between">
			<div class="row my-auto gx-lg-5 align-items-center">
				<RouterLink to="agent" v-slot="{ navigate, href }" custom>
					<a :href="href" @click="navigate" class="router-link text-decoration-none text-dark">
						<MiniInfosAgent></MiniInfosAgent>
					</a>
				</RouterLink>

				<div class="my-auto">
					<SuiviHabilitation></SuiviHabilitation>
				</div>
			</div>

			<div class="text-center mt-2 d-none d-lg-block">
				<button class="btn w-100 mb-sm-3 my-md-3"
					style="background-color: #F78C6B; color: white;">Contrôler</button>
			</div>
		</div>

		<div class="col-12 col-lg-6 mb-3 mb-lg-0 pt-2">
			<div v-if="chantier">
				<CarteMapEtAdresse :chantier="chantier" />
			</div>
			<div v-else>
				<CarteChoisirChantier />
			</div>
		</div>

		<div class="text-center mt-sm-2 d-lg-none p-0">
			<button class="btn w-100" style="background-color: #F78C6B; color: white;">Controller</button>
		</div>
	</div>
</template>

<script>
import SuiviHabilitation from '../components/SuiviHabilitation.vue';
import MiniInfosAgent from '../components/MiniInfosAgent.vue';
import CarteMapEtAdresse from '../components/CarteMapEtAdresse.vue';
import CarteChoisirChantier from '../components/CarteChoisirChantier.vue';

export default {
	data() {
		return {
			chantier: null, // Remplacez par votre propriété de chantier réel "lorient"
			dfCritique: '2023-07-01',

			// todo : donne à dfCritique la valeur la plus faible parmis : la difference entre dfveille et date du jour ou la diffrence entre df et la date du jour
		};
	},
	components: {
		SuiviHabilitation,
		MiniInfosAgent,
		CarteMapEtAdresse,
		CarteChoisirChantier,
	},
	computed: {
		badgeClass() {
			const currentDate = new Date();
			const dfDate = new Date(this.dfCritique);

			if (dfDate > currentDate) {
				return 'badge bg-success';
			} else {
				return 'badge bg-danger';
			}
		},
	},
	methods: {
		getDateDifference(date) {
			const currentDate = new Date();
			const dfDate = new Date(date);

			const timeDifference = dfDate.getTime() - currentDate.getTime();
			const dayDifference = Math.ceil(timeDifference / (1000 * 3600 * 24));

			if (dayDifference > 0) {
				return `-${dayDifference}`;
			} else if (dayDifference < 0) {
				return `+${Math.abs(dayDifference)}`;
			} else {
				return ``;
			}
		},
	},
};
</script>