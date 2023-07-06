<template>
	<div class="row bg-light rounded shadow p-2 m-2 mb-2">
		<div class="fw-light text-secondary text-center mb-2 fw-bold">KN annonceur - <span style="color: red;">DEADLINE :
				09/11/2023</span>
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


		<div class="col-12 col-lg-6 p-0 p-sm-0">

		<CarteMapEtAdresse></CarteMapEtAdresse>
		</div>

		<div class="text-center mt-sm-2 d-lg-none p-0">
			<button class="btn w-100" style="background-color: #F78C6B; color: white;">Controller</button>
		</div>
	</div>
</template>

<script>
import SuiviHabilitation from '../components/SuiviHabilitation.vue';
import InteractiveMap from '../components/InteractiveMap.vue';
import MiniInfosAgent from '../components/MiniInfosAgent.vue';
import CarteMapEtAdresse from '../components/CarteMapEtAdresse.vue';

export default {
	components: {
		SuiviHabilitation,
		InteractiveMap,
		MiniInfosAgent,
		CarteMapEtAdresse
	},
};
</script>
