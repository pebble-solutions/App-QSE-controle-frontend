<template>
    <div class="container py-2">
        
        <h1 class="fs-3 my-3">Consultation des contrôles réalisés</h1>
        <div class="card my-2">
            <div class="card-body">
                <div class="row align-items-center">
                    <div class="col-md-6 col-lg-4 col-12">
                        <img src="../assets/consultation.jpg" class="img-fluid" alt="consultation de contrôles" />
                    </div>
                    <div class="col display-6 ">
                        <p class="fs-4 text-center">Utilisez cet espace pour consulter les contrôles réalisés</p>
                        <ul>
                            <li class="fs-5 mb-2">Sélectionnez un contrôle dans la liste pour le consulter</li>
                            <li class="fs-5 mb-2">Vous pouvez effectuer une recherche par date</li>
                            <li class="fs-5 mb-2">Vous pouvez grouper vos résultats par formulaire ou par projets</li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>  

        <h3 class="fs-8 my-3 text-center">Test du composant JaugeMoyenneSami.vue</h3>

        <JaugeMoyenneSami :n1="3.2" :n2="3.8" />

    </div>
    
</template>
<style scoped>
.progress-ht{
    height: 30px;
}
</style>
<script>
import {mapState} from 'vuex'; 
import JaugeMoyenneSami from '../components/JaugeMoyenneSami.vue';

export default {

    computed: {
        ...mapState(['formulaires']),
    },

    components: {
        JaugeMoyenneSami,
    },
}
</script>