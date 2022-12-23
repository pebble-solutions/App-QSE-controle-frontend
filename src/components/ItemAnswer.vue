<template>
    <div>
        <div class="row">
            <div v-for="button in buttonsSami" :key="id+'-'+button" class="col d-grid">
                <button 
                    @click="recordSami(button)" 
                    type="button" class="btn" 
                    :class="{
                        'btn-outline-danger': 'i' == button && 'i' != itemResponse.reponse,
                        'btn-danger': 'i' == button && 'i' == itemResponse.reponse,
                        'btn-outline-warning': 'm' == button && 'm' != itemResponse.reponse,
                        'btn-warning': 'm' == button && 'm' == itemResponse.reponse,
                        'btn-outline-primary': 'a' == button && 'a' != itemResponse.reponse,
                        'btn-primary': 'a' == button && 'a' == itemResponse.reponse,
                        'btn-outline-success': 's' == button && 's' != itemResponse.reponse,
                        'btn-success': 's' == button && 's' == itemResponse.reponse
                    }"
                >
                    {{button.toUpperCase()}}
                </button>
            </div>
        </div>

        <div v-if="itemResponse.comment">{{itemResponse.comment}}</div>

        <div class="input-group mt-3">
            <label  class="form-label d-none">Commentaire</label>
            <input @blur="recordC(id)"  type="text" class="form-control"  placeholder="Votre commentaire" v-model="comment">
            <button type="img"><i class="bi bi-camera"></i></button>
        </div>
    </div>
</template>
<script>
import {mapState, mapActions} from 'vuex';

export default {
    props: {
        id: Number,
        bloc_id: Number
    },

    data() {
        return {

            response : null,
            comment: null,

            itemResponse: {
                question:'',
                reponse: '',
                commentaire: '',
                bloc: ''
                // practice:'',
                // obligatory:'',
            },
            buttonsSami: ['s', 'a', 'm', 'i']
        }
    },
    computed: {
        ...mapState(['openedElement', 'responses']),
    },

    methods: {
        ...mapActions(['refreshResponse']),

        /**
         * enregistre le commentaire de l'item
         */
        recordC(id) {
            this.itemResponse.question = id;
            this.itemResponse.commentaire = this.comment;
            this.refreshResponse(this.itemResponse);
        },

        /**
         * enregistre le sami de l'item 
         * @param {string} options s,a,m,i
         */
        recordSami(sami) {
            this.itemResponse.question = this.id;
            this.itemResponse.reponse = sami;
            this.refreshResponse(this.itemResponse);
        }, 
    },

    mounted() {
        this.itemResponse.bloc = this.bloc_id;
    }
}
</script>
