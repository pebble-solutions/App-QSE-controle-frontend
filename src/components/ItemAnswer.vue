<template>
    <div>
        <div class="row">
            
            <div v-for="value in samiDict" :key="ligne.id+'-'+value" class="col d-grid">
                <button 
                    @click.prevent="refreshValue(value)" 
                    type="button" class="btn" 
                    :class="buttonsClassName[value]">{{value}}</button>
                
            </div>
        </div>
        <div class="input-group mt-3">
            <textarea rows="3" class="form-control"  placeholder="Votre commentaire" v-model="commentaire"></textarea>

            <!--
            Version 2
            <div class="btn btn-outline-dark d-flex align-items-center d-none">
                <label :for="'takepicture'+itemResponse.question" >
                    <i class="bi bi-camera"></i>
                </label>
                <input :id="'takepicture'+itemResponse.question" type="file" class="visually-hidden"/>
            </div>
            -->
        </div>
    </div>
</template>


<script>
import {mapState, mapActions} from 'vuex';

export default {
    props: {
        ligne: Object
    },

    data() {
        return {
            itemResponse: {
                question: null,
                reponse: null,
                commentaire: null,
                bloc: null
            },
            commentaire: '',
            samiDict: ['S', 'A', 'M', 'I']
        }
    },
    
    computed: {
        ...mapState(['openedElement', 'responses', 'collecte']),

        /**
         * Retourne les noms des classes CSS de chaque type de bouton SAMI
         * 
         * Chaque clé de l'objet retourné est un type SAMI avec sa classe CSS en valeur.
         * 
         * @return {object}
         */
        buttonsClassName() {

            let px = {
                S: null,
                A: null,
                M: null,
                I: null
            };

            ['S', 'A', 'M', 'I'].forEach(samiVal => {
                px[samiVal] = "btn";
                if (samiVal != this.itemResponse.reponse?.toUpperCase()) {
                    px[samiVal] += "-outline";
                }
            });

            return {
                S: px.S+'-success',
                A: px.A+'-primary',
                M: px.M+'-warning',
                I: px.I+'-danger'
            };
        },
    },

    watch: {
        /**
         * Lorsque le commentaire est mis à jour, le store doit être actualisé.
         * 
         * @param {string} val La nouvelle valeur du commentaire
         */
        commentaire(val) {
            this.refreshCommentaire(val);
        }
    },

    methods: {
        ...mapActions(['refreshResponse']),

        /**
         * enregistre le commentaire de l'item
         */
        refreshCommentaire(val) {
            if (this.itemResponse.commentaire != val) {
                this.itemResponse.commentaire = val;
                this.refreshResponse(this.itemResponse);
            }
        },

        /**
         * Rafraichie la valeur de la réponse dans le store.
         * 
         * @param {string} value S,A,M,I
         */
        refreshValue(value) {
            if (this.itemResponse.reponse == value) {
                this.itemResponse.reponse = null;
            } else {
                this.itemResponse.reponse = value;
            }
            this.refreshResponse(this.itemResponse);
        },

        /**
         * Initialise un objet tampon pour stocker les informations de la réponse.
         */
        initValues() {
            const response = this.responses.find(e => e.question == this.ligne.id);
            
            this.itemResponse = {
                question: this.ligne.id,
                reponse: response ? response.reponse : null,
                commentaire: response ? response.commentaire : null,
                bloc: this.ligne.information__bloc_id
            };

            if (response) {
                this.commentaire = response.commentaire;
            }
        },

        /**
         * Retourne la classe à appliquer sur le bouton en fonction d'une valeur SAMI.
         * 
         * @param {string} samiVal S.A.M.I
         */
        // buttonClass(samiVal) {

        // }
    },

    mounted() {
        this.initValues();
    }
}
</script>
