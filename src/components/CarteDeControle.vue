<template>
	<div class="row bg-light rounded p-2 m-2 mb-2">
		<div class="fw-light text-secondary text-center mb-3 fw-bold">KN annonceur - DEADLINE : 09/11/2023</div>


		<div class="col-12 col-lg-6 mb-3 mb-lg-0 d-flex flex-column justify-content-between">
  <div class="row my-auto gx-lg-5">
    <div class="mb-2">
      <div class="row">
        <div class="col-12 d-flex align-items-start">
          <div class="col-2 mb-2" style="flex-grow: 1;">
            <img src="../assets/profilePicture.jpg" class="rounded" style="width: 100%; height: 100%; object-fit: cover;">
          </div>
          <div class="col-10 px-1">
            <div class="row">
              <div class="col-12 fw-bold">Prénom NOM</div>
              <div class="col-12">Tel : 0675543451</div>
              <div class="col-12">Mail : mail@pebble.bzh</div>
            </div>
          </div>
        </div>
      </div>
    </div>



				<div class="my-auto">
					<SuiviHabilitation></SuiviHabilitation>
				</div>
			</div>
			<div class="text-center mt-2 d-none d-lg-block">
				<button class="btn w-100 mb-sm-3 my-md-3"
					style="background-color: #F78C6B; color: white;">Controller</button>
			</div>
		</div>
		<div class="col-12 col-lg-6 p-0 p-sm-0">
			<div class="bg-white w-90 h-100 rounded shadow-sm">
				<div class="card-body h-100 d-flex align-items-center justify-content-center">
					<div class="row">
						<div class="col-12 text-center mb-3">
							<div class="row fw-bold">
								<div class="col-12">CHANTIER : </div>
								<div class="col-12">21.02.23 au 22.02.23</div>
								<div class="col-12">RAV LORIENT</div>
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
		</div>
		<div class="text-center mt-2 d-lg-none">
			<button class="btn w-100" style="background-color: #F78C6B; color: white;">Controller</button>
		</div>
	</div>
</template>
  
  <script>

  import SuiviHabilitation from '../components/SuiviHabilitation.vue';
  import InteractiveMap from '../components/InteractiveMap.vue';
  
  export default {
 
    components: {
      SuiviHabilitation,
      InteractiveMap,
    },
  };
  </script>
  