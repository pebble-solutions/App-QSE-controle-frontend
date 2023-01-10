<template>
    <h3 class="accordion-header" :id="'heading_'+ ligne.id">
        <button class="accordion-button" :class="{'collapsed': collapsed == true}" type="button" data-bs-toggle="collapse" :data-bs-target="'#collapse_'+ ligne.id"
            aria-expanded="true" :aria-controls="'collapse_'+ ligne.id">
            <span>{{ligne.ligne}}</span>
            
            <span v-if="ligne.obligatoire == 'OUI'" class="badge bg-warning ms-2 text-dark">Obligatoire</span>
            
            <span v-if="answer" class="mx-2">-</span>
            <span 
            v-if="answer"
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

import { mapActions, mapState } from 'vuex'

export default {
    props: {
        ligne: Object,
        collapsed: {
            type: Boolean,
            default: true
        }
    },

    computed: {
        ...mapState(['responses', 'collecte']),

        answer() {
            let find = this.responses.find((resp) => resp.question == this.ligne.id);

            if (find)
                return find.reponse

            return '';
        }
    },

    methods: {
        ...mapActions(['refreshResponse'])
    },


}

</script>
