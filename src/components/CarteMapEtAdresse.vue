<template>

			<div class="bg-white h-100 rounded shadow-sm">
				<div class="card-body h-100 d-flex align-items-center justify-content-center">
					<div class="row">
						<div class="col-12 text-center mb-3">
							<div class="row fw-bold">
								<div class="col-12">RAV LORIENT</div>
								<div class="col-12">21.02.23 au 22.02.23</div>	
							</div>
						</div>
						<div class="col-12 text-center">
							<div class="row">
								<div class="col-12">3 rue des Pruniers</div>
								<div class="col-12">56100 LORIENT</div>
							</div>
						</div>
					</div>
					<div class="col-6 col-md-6 mt-2 mt-md-0">
						<div class="d-flex justify-content-center">
							<InteractiveMap></InteractiveMap>
						</div>
					</div>
				</div>
			</div>

</template>
<script>
import InteractiveMap from '../components/InteractiveMap.vue';

export default {
	components: {
	InteractiveMap,
	},
};
</script>
