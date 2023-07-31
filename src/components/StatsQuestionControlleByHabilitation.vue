<template>
    <div class="card my-2">
        <div class="card-header">
            <div class="d-flex align-items-baseline justify-content-between mb-2">
                <h4 class="fs-5 card-title">Nombre d'items évalués </h4>
                <div class="badge fs-5 text-uppercase ms-1" :class="classNameFromSAMI(collecte.result_var)" >
                    {{collecte.nb_reponse}}/{{collecte.nb_question}}
                </div>
            </div>
        </div>

        <div class="accordion accordion-flush" id="formulaireResume">
            <div v-for="bloc in blocs" :key="'bloc-'+bloc.id" class="accordion-item">
                <h2 class="accordion-header" :id="'heading-'+bloc.id">
                    <button class="accordion-button" type="button" data-bs-toggle="collapse" :data-bs-target="'#collapse-'+bloc.id" aria-expanded="true" :aria-controls="'collapse-'+bloc.id">
                        {{bloc.bloc}} 
                    </button>
                </h2>
                <div :id="'collapse-'+bloc.id" class="accordion-collapse collapse show" :aria-labelledby="'heading-'+bloc.id">
                    <div class="accordion-body">
                        <div class="list-group list-group-flush">
                            <template v-for="reponse in itemResponse.reponses" :key="'reponse-'+reponse.question">  
                                <div class="list-group-item" v-if="bloc.id == reponse.bloc">

                                    <div class="d-flex align-items-center justify-content-between" v-if="reponse.reponse">
                                        <div class="fst-italic">{{quesionLigne(reponse.question)}}</div>
                                        <div class="badge text-uppercase fs-6" :class="classNameFromSAMI(reponse.reponse)" >{{reponse.reponse}}</div>
                                    </div>
                                    <div class="d-flex align-items-center justify-content-between" v-else>
                                        <div class="fst-italic">{{quesionLigne(reponse.question)}}</div>
                                        <div class="badge text-uppercase fs-7" :class="classNameFromSAMI(reponse.reponse)">Pas d'évaluation</div>
                                    </div>
                                    <div class="d-flex align-items-center justify-content-start">
                                        <span class="me-2 text-warning">modification:</span>
                                        <sami-button v-model="reponse.reponse">{{reponse.reponse}}</sami-button>
                                    </div>

                                    <textarea class="form-control d-block mt-2" v-model="reponse.commentaire" placeholder="modifier le commentaire"></textarea>
                                </div>
                            </template>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>

export default {
    props: {
        stats: Array,
        groupsAndQuestions: Array
    }
};
</script>