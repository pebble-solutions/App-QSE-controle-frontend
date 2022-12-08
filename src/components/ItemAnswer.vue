<template>
    <div>
        
        <div class="row">
            <div class="col d-grid">
                <button @click="recordSami('s')" type="button"  class="btn btn-outline-success">S</button>
                <span v-if="itemResponse.question == 's'">OK</span>
            </div>
            <div class="col d-grid">
                <button @click="recordSami('a')" type="button" class="btn btn-outline-primary">A</button>
            </div>
            <div class="col d-grid">
                <button @click="recordSami('m')" type="button" class="btn btn-outline-warning">M</button>
            </div>
            <div class="col d-grid">
                <button @click="recordSami('i')" type="button" class="btn btn-outline-danger">I</button>
            </div>
        </div>
        <div v-if="itemResponse.comment">{{itemResponse.comment}}</div>

        <div class="mt-3">
            <label  class="form-label d-none">Commentaire</label>
            <input @blur="recordC(id)"  type="text" class="form-control"  placeholder="Votre commentaire" v-model="comment">
        </div>
        <div>
            {{}}
        </div>
        {{itemResponse.question}}{{itemResponse.comment}}{{itemResponse.reponse}}
    </div>
</template>
<script>
import {mapState, mapActions} from 'vuex';

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
            },
            blocResponse: [],
            
                
                

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
            console.log(this.comment, 'commentaire', id);
            this.itemResponse.question = id;
            this.itemResponse.commentaire = this.comment;
            this.refreshResponse(this.itemResponse);
            console.log('comment', this.itemResponse);
        },

        /**
         * enregistre le sami de l'item 
         * @param {string} options s,a,m,i
         */
        recordSami(sami) {
            console.log(this.id, 'sami');
            this.itemResponse.question = this.id;
            this.itemResponse.reponse = sami;
            console.log(this.itemResponse, 'itemResponse')
            this.refreshResponse(this.itemResponse);
            console.log('resp', this.itemResponse);
            
        }, 


    }

}
</script>
