<template>
    <div>
        <p>Affichage des stats possibles. </p>
        <p>Note: 
            <ul>
                <li>Chaque partie d'une barre de visualisation est un bouton cliquable pouvant donc renvoyer à une liste.</li>
                <li>ex toutes les évaluations générales ayant obtenu un I</li>
                <li>idéalement l'api devra retourner les valeurs et les pourcentages</li>
                <li>le modèle est déclinable par projets, par opérateur, par vérificateur...</li>

            </ul>
            
             
        </p>
        <h2 class="card-header">Contrôleur 1</h2>
        <div class="row g-2 m-2">
            <div class="card col-md-4">
                <h3 >Tous les contrôles</h3>
                <div class="mx-1">Répartition sur Évaluations générales</div>
                <div class="btn-group progress progress-ht mb-2 mx-1 ">
                    <div class="btn progress-bar bg-success" role="progressbar" style="width: 45%" >8</div>
                    <div class="btn progress-bar bg-primary" role="progressbar" style="width: 30%" >6</div>
                    <div class="btn progress-bar bg-warning" role="progressbar" style="width: 20%" >4</div>
                    <div class="btn progress-bar bg-danger" role="progressbar" style="width: 6%" >2</div>
                </div>
                <div class="mx-1">Répartition sur Toutes les réponses</div>
                <div class="btn-group progress progress-ht mb-2 mx-1">
                    <div class="btn progress-bar bg-success" role="progressbar" style="width: 76%" aria-valuenow="15" aria-valuemin="0" aria-valuemax="100">900</div>
                    <div class="btn progress-bar bg-primary" role="progressbar" style="width: 8%" aria-valuenow="30" aria-valuemin="0" aria-valuemax="100">100</div>
                    <div class="btn progress-bar bg-warning" role="progressbar" style="width: 8%" aria-valuenow="20" aria-valuemin="0" aria-valuemax="100">100</div>
                    <div class="btn progress-bar bg-danger" role="progressbar" style="width: 8%">10</div>
                </div>
                <div class="d-flex align-items-center mx-1 mb-1">Répartition <span class="badge bg-info mx-1">évalués</span>/<span class="badge bg-secondary mx-1">non évalués</span></div>
                <div class="btn-group progress progress-ht mb-2 mx-1">
                    <div class="btn progress-bar bg-info" role="progressbar" style="width: 94%" aria-valuenow="15" aria-valuemin="0" aria-valuemax="100">11</div>
                    <div class="btn progress-bar bg-secondary" role="progressbar" style="width: 8%" aria-valuenow="20" aria-valuemin="0" aria-valuemax="100">1</div>
                </div>
             </div>
        </div>
        <div class="row m-2">
             
            <div class="card col-md-4 me-2">
                <h3>Questionnaire 1</h3>
                <div class="mx-1">Répartition sur Évaluations générales</div>
                <div class="btn-group progress progress-ht mb-2 mx-1 ">
                    <div class="btn progress-bar bg-success" role="progressbar" style="width: 45%" >8</div>
                    <div class="btn progress-bar bg-primary" role="progressbar" style="width: 30%" >6</div>
                    <div class="btn progress-bar bg-warning" role="progressbar" style="width: 20%" >4</div>
                    <div class="btn progress-bar bg-danger" role="progressbar" style="width: 6%" >2</div>
                </div>
                <div class="mx-1">Répartition sur Toutes les réponses</div>
                <div class="btn-group progress progress-ht mb-2 mx-1">
                    <div class="btn progress-bar bg-success" role="progressbar" style="width: 76%" aria-valuenow="15" aria-valuemin="0" aria-valuemax="100">900</div>
                    <div class="btn progress-bar bg-primary" role="progressbar" style="width: 8%" aria-valuenow="30" aria-valuemin="0" aria-valuemax="100">100</div>
                    <div class="btn progress-bar bg-warning" role="progressbar" style="width: 8%" aria-valuenow="20" aria-valuemin="0" aria-valuemax="100">100</div>
                    <div class="btn progress-bar bg-danger" role="progressbar" style="width: 8%">10</div>
                </div>
                <div class="d-flex align-items-center mx-1 mb-1">Répartition <span class="badge bg-info mx-1">évalués</span>/<span class="badge bg-secondary mx-1">non évalués</span></div>
                <div class="btn-group progress progress-ht mb-2 mx-1">
                    <div class="btn progress-bar bg-info" role="progressbar" style="width: 94%" aria-valuenow="15" aria-valuemin="0" aria-valuemax="100">11</div>
                    <div class="btn progress-bar bg-secondary" role="progressbar" style="width: 8%" aria-valuenow="20" aria-valuemin="0" aria-valuemax="100">1</div>
                </div>
        </div>
            <div class="card col-md-4">
                <h3>Questionnaire 2</h3>
            
                <div class="mx-1">Répartition sur Évaluations générales</div>
                <div class="btn-group progress progress-ht mb-2 mx-1 ">
                    <div class="btn progress-bar bg-success" role="progressbar" style="width: 45%" >8</div>
                    <div class="btn progress-bar bg-primary" role="progressbar" style="width: 30%" >6</div>
                    <div class="btn progress-bar bg-warning" role="progressbar" style="width: 20%" >4</div>
                    <div class="btn progress-bar bg-danger" role="progressbar" style="width: 6%" >2</div>
                </div>
                <div class="mx-1">Répartition sur Toutes les réponses</div>
                <div class="btn-group progress progress-ht mb-2 mx-1">
                    <div class="btn progress-bar bg-success" role="progressbar" style="width: 76%" aria-valuenow="15" aria-valuemin="0" aria-valuemax="100">900</div>
                    <div class="btn progress-bar bg-primary" role="progressbar" style="width: 8%" aria-valuenow="30" aria-valuemin="0" aria-valuemax="100">100</div>
                    <div class="btn progress-bar bg-warning" role="progressbar" style="width: 8%" aria-valuenow="20" aria-valuemin="0" aria-valuemax="100">100</div>
                    <div class="btn progress-bar bg-danger" role="progressbar" style="width: 8%">10</div>
                </div>
                <div class="d-flex align-items-center mx-1 mb-1">Répartition <span class="badge bg-info mx-1">évalués</span>/<span class="badge bg-secondary mx-1">non évalués</span></div>
                <div class="btn-group progress progress-ht mb-2 mx-1">
                    <div class="btn progress-bar bg-info" role="progressbar" style="width: 94%" aria-valuenow="15" aria-valuemin="0" aria-valuemax="100">11</div>
                    <div class="btn progress-bar bg-secondary" role="progressbar" style="width: 8%" aria-valuenow="20" aria-valuemin="0" aria-valuemax="100">1</div>
                </div>
        </div>
        </div>
    </div>
</template>
<style scoped>
.progress-ht{
    height: 30px;
}
</style>
<script>
import {mapState} from 'vuex';
// import CollecteTitle from '../components/CollecteTitle.vue';


export default {
    // commponents: (['CollecteTitle']),

    computed: {
        ...mapState(['formulaires']),
    }
}
</script>