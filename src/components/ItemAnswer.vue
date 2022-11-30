<template>
    <div>
        <div class="row">
            <div class="col d-grid">
                <button @click="recordSami('s')" type="button"  class="btn btn-success">S</button>
            </div>
            <div class="col d-grid">
                <button @click="recordSami('a')" type="button" class="btn btn-primary">A</button>
            </div>
            <div class="col d-grid">
                <button @click="recordSami('m')" type="button" class="btn btn-warning">M</button>
            </div>
            <div class="col d-grid">
                <button @click="recordSami('i')" type="button" class="btn btn-danger">I</button>
            </div>
        </div>                            
        <div class="mt-3">
            <label  class="form-label d-none">Commentaire</label>
            <input @blur="recordC(id)"  type="text" class="form-control"  placeholder="Votre commentaire" v-model="comment">
        </div>
    </div>
</template>
<script>
import {mapState } from 'vuex';

export default {
    props: {
        id: Number
    },

    data() {
        return {

            response : null,
            comment: null,

            itemResponse: {
                question:'',
                reponse: '',
                commentaire: '',
                // practice:'',
                // obligatory:'',
            }
                
                

        }
    },
    computed: {
        ...mapState(['openedElement'])
    },

    methods: {
        /**
         * enregistre le commentaire de l'item dans le store
         */
        recordC(id) {
            console.log(this.comment, 'commentaire', id);
            this.itemResponse.question = id;
            this.itemResponse.commentaire = this.comment
            console.log(this.itemResponse, 'itemResponse')

        },

        /**
         * enregistre le sami de l'item dans le store
         * @param {string} options s,a,m,i
         */
        recordSami(sami) {
            console.log(this.id, 'sami');
            this.itemResponse.question = this.id;
            this.itemResponse.reponse = sami;
            console.log(this.itemResponse, 'itemResponse')

        }, 


    }

}
</script>
