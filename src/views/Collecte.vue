<template>
    <div class="container py-2">
        <h1 class="fs-3 my-3">Réalisation des contrôles</h1>
        <div class="card my-2">
            <div class="card-body">
                <div class="row align-items-center">
                    <div class="col-md-6 col-lg-4 col-12">
                        <img src="../assets/programmation.jpg" class="img-fluid" alt="Programmation de contrôles" />
                    </div>
                    <div class="col display-6 ">
                        <p class="fs-4 text-center">Utilisez cet espace pour réaliser vos contrôles:</p>
                        <p class="fs-4 text-center">Cliquez sur un contrôle programmé dans la liste de gauche pour commencer l'enregistrement.</p>
                        <p class="fs-4 text-center">ou définissez un contrôle inopiné grâce au bouton ci-dessous </p>
                    </div>
                </div>
            </div>
        </div>

        <div class="card my-2">
            <div class="card-body text-center">
                <router-link to="/collecte/new" custom v-slot="{ navigate, href }">
                    <a class="btn btn-lg btn-primary col" :href="href" @click="navigate">
                        <i class="bi bi-plus"></i> Nouveau contrôle
                    </a>
                </router-link>
            </div>
        </div>

        <router-view></router-view>
    </div>
</template>
