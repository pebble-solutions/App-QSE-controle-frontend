<template>
    <div class="py-2 container">

        <h1 class="fs-3 my-3">Gestion des contrôles programmés</h1>

        <div class="card my-2">
            <div class="card-body">
                <div class="row align-items-center">
                    <div class="col-md-6 col-lg-4 col-12">
                        <img src="../assets/programmation.jpg" class="img-fluid" alt="Programmation de contrôles" />
                    </div>
                    <div class="col display-6 fs-4 text-center">
                        Utilisez cet espace pour programmer vos contrôles ou modifier vos programmations existantes. Sélectionnez
                        un type de contrôle dans la liste de gauche pour créer ou lister les enregistrements.
                    </div>
                </div>
            </div>
        </div>

        <div class="card my-2">
            <div class="card-body text-center">
                <router-link to="/programmation/new" custom v-slot="{ navigate, href }">
                    <a class="btn btn-lg btn-primary col" :href="href" @click="navigate">
                        <i class="bi bi-plus"></i> Programmer un contrôle
                    </a>
                </router-link>
            </div>
        </div>

        <router-view></router-view>
    </div>
</template>