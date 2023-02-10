<template>

    <table class="table table-bordered bg-light">
        <thead>
            <tr class="text-center text-light">
                <th scope="col" class="text-dark">Items évalués</th>
                <th scope="col" v-for="letter in samiDict" :key="letter" :class="samiClassName(letter)">{{ letter }}</th>
            </tr>
        </thead>

        <tbody>
            <tr class="text-center" v-if="collecte.nb_reponse" >
                <td scope="row">Total: {{collecte.nb_reponse}}/{{collecte.nb_question}}</td>
                <td scope="row" v-for="letter in samiDict" :key="letter">{{ getValue(letter) }}</td>
            </tr>
            <tr v-else >
                <td scope="row" class="text-warning text-center">Aucune réponse enregistrée !</td>
                <td scope="row" class="text-center" v-for="letter in samiDict" :key="letter">{{ getValue(letter) }}</td>

            </tr>
            
        </tbody>
    </table>

</template>

<script>

export default {
    props: {
        stats: Object,
        collecte: Object
    },

    data() {
        return {
            samiDict: ['S', 'A', 'M', 'I']
        }
    },

    methods: {
        /**
         * Retourne la valeur statistique d'une des lettres SAMI
         * @param {string} letter Lettre SAMI
         * @return {string}
         */
        getValue(letter) {
            let key = letter.toLowerCase();
            if(!this.stats){
                // alert('Attention: aucune réponse enregistrée pour ce contrôle');
                console.log(this.stats)
                return '0';
            } else{

                console.log(this.stats);
                return this.stats[key];
            }
        },

        /**
         * Retourne le nom d'une classe CSS à partir d'une lettre SAMI
         * @param {string} letter La lettre SAMI
         * @return {string}
         */
        samiClassName(letter) {
            const classList = {
                S: 'bg-success', A: 'bg-primary', M: 'bg-warning', I: 'bg-danger'
            };
            return classList[letter];
        }
    }
}

</script>