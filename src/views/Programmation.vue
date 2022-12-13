<template>
    <div class="py-3 container">
        <h1 class="fs-3 mb-3">Gestion des KN Programmés</h1>
        <div class="alert alert-info d-flex">
            <i class="bi bi-info-circle me-2"></i>
            <div>
                Utilisez cet espace pour programmer vos KN ou modifier vos programmations existantes. Sélectionnez
                un type de KN dans la liste de gauche pour créer ou lister les enregistrements.
            </div>
        </div>

        <div class="card">
            <div class="card-body text-center">
                <router-link to="/programmation/new" custom v-slot="{ navigate, href }">
					<a class="btn btn-lg btn-primary" :href="href" @click="navigate">
						<i class="bi bi-plus"></i> Programmer un KN
					</a>
				</router-link>
            </div>
        </div>
        <router-view></router-view>
    </div>
</template>