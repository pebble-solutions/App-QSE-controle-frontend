<template>
    <div>
        <div class="row">
            
            <div v-for="button in buttonsSami" :key="id+'-'+button" class="col d-grid">
                <button 
                    @click="recordSami(button)" 
                    type="button" class="btn" 
                    :class="{
                        'btn-outline-danger': 'i' == button && 'i' != displayResponse,
                        'btn-danger': 'i' == button && 'i' == displayResponse,
                        'btn-outline-warning': 'm' == button && 'm' != displayResponse,
                        'btn-warning': 'm' == button && 'm' == displayResponse,
                        'btn-outline-primary': 'a' == button && 'a' != displayResponse,
                        'btn-primary': 'a' == button && 'a' == displayResponse,
                        'btn-outline-success': 's' == button && 's' != displayResponse,
                        'btn-success': 's' == button && 's' == displayResponse
                    }"
                >
                    {{button.toUpperCase()}}
                </button>
                
            </div>
        </div>
        <div class="input-group mt-3">
            <label  class="form-label d-none">Commentaire</label>
            <textarea @blur="recordC(id)" rows="3" class="form-control"  placeholder="Votre commentaire" v-model="itemResponse.commentaire"></textarea>

            <div class="btn btn-outline-dark d-flex align-items-center d-none">
                <label :for="'takepicture'+itemResponse.question" >
                    <i class="bi bi-camera"></i>
                </label>
                <input :id="'takepicture'+itemResponse.question" type="file" class="visually-hidden"/>
            </div>
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
            itemResponse: {
                question:'',
                reponse: '',
                commentaire: '',
                bloc: ''
            },
            buttonsSami: ['s', 'a', 'm', 'i']
        }
    },
    computed: {
        ...mapState(['openedElement', 'responses', 'collecte']),

        displayResponse() {
            return this.itemResponse.reponse;
        }
    },

    methods: {
        ...mapActions(['refreshResponse']),

        /**
         * enregistre le commentaire de l'item
         */
        recordC(id) {
            this.itemResponse.question = id;
            this.refreshResponse(this.itemResponse);
        },

        /**
         * enregistre le sami de l'item 
         * @param {string} options s,a,m,i
         */
        recordSami(sami) {
            console.log('sami',sami);
            console.log(this.itemResponse.reponse);
            if (this.itemResponse.reponse == sami) {
                console.log('null');
                this.itemResponse.reponse = null;
                console.log(this.itemResponse);
            } else {
                this.itemResponse.question = this.id;
                this.itemResponse.reponse = sami;
                this.refreshResponse(this.itemResponse);
            }
        },

        /**
         * Recupere la reponse a la question et l'enregistre dans itemResponse si elle existe
         */
        getReponse() {
            let find = this.responses.find((resp) => resp.question == this.id);

            if (find) {
                this.itemResponse = {
                    question: find.question,
                    reponse: find.reponse,
                    commentaire: find.commentaire,
                    bloc: find.bloc
                }
            }
        }
    },

    mounted() {
        this.itemResponse.bloc = this.bloc_id;
        this.getReponse();
    }
}
</script>
