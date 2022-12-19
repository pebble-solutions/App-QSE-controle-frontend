<template>
    <h3 class="accordion-header" :id="'heading_'+ ligne.id">
        <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" :data-bs-target="'#collapse_'+ ligne.id"
            aria-expanded="true" :aria-controls="'collapse_'+ ligne.id">
            <span>{{ligne.ligne}}</span>

            <span v-if="ligne.obligatoire == 'OUI'" class="badge bg-warning ms-2 text-dark">Obligatoire</span>

            <span v-if="answer" class="mx-2">-</span>
            <span 
                class="badge"
                :class="{
                    'bg-success' : 's' == answer,
                    'bg-primary' : 'a' == answer,
                    'bg-warning' : 'm' == answer,
                    'bg-danger' : 'i' == answer,
                }"
            
            >{{answer.toUpperCase()}}</span>
        </button>
    </h3>
</template>

<script>
import { mapState } from 'vuex'

export default {
    props: {
        ligne: Object
    },

    computed: {
        ...mapState(['responses']),

        answer() {
            let find = this.responses.find((resp) => {
                if (resp.question == this.ligne.id && resp.bloc == this.$route.params.bloc) {
                    return resp.reponse;
                }
            });

            if (find) {
                return find.reponse
            } else {
                return '';
            }
        }
    }
}
</script>
