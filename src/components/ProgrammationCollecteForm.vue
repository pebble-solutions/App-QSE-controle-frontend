<template>
    <div v-if="tmpCollecte">
       
        <!-- <div class="row g-2" v-if="veille">
            <p>Veille: </p>
            
        </div> -->
        
        <div class="row g-2">
            <div v-if="!veille" class="col mb-3">
                <label for="collecteFormulaire" class="form-label">Type de contrôle</label>
                <select class="form-select" id="collecteFormulaire" name="formulaire" v-model="formulaire" required :disabled="isReadonly('formulaire')">
                    <option v-for="(form) in formulaires" :value="form.id" :key="form.id" >{{form.groupe}}</option>
                </select>
                <div class="text-danger mt-2" v-if="!currentFormTli && formulaire">
                    <i class="bi bi-exclamation-triangle-fill"></i>
                    Aucune habilitation n'est liée à ce type de contrôle. L'ensemble du personnel peut être contrôlé. Les fonctions de veille 
                    ne seront pas disponibles.
                </div>
                <div class="text-success mt-2" v-else-if="currentFormTli">
                    <i class="bi bi-check-circle-fill"></i>
                    Les fonctions de veille sont disponibles pour ce type de contrôle.
                </div>
            </div>
        </div>

        <div v-if="!veille" class="col mb-3">
            <label for="collecteProjet" class="form-label">Projet</label>
            <select class="form-select" id="collecteProjet" name="projet" v-model="tmpCollecte.projet_id" :disabled="isReadonly('projet')">
                <option  v-for="(projet) in projets" :value="projet.id" :key="projet.id">{{projet.intitule}}</option>
            </select>
        </div>

        <div class="mb-3">
            <label class="form-label" for="collecteDate">Date programmée</label>
            <input type="date" class="form-control" id="collecteDate" name="date" v-model="tmpCollecte.date" :disabled="isReadonly('date')">
        </div>
        <div class="row g-2">
            <div class="col-12 col-md-6 mb-3">
                <label for="collecteCible" class="form-label">Opérateur </label>
                <select class="form-select" id="collecteCible" name="cible_personnel" v-model="cible_personnel" :disabled="isReadonly('cible_personnel')" v-if="!pending.habilitations">
                    <option v-for="(agent) in sortedOperateurs" :value="agent.id" :key="agent.id" > {{agent.cache_nom}} </option>
                </select>
                <div class="text-secondary py-1" v-else>
                    <span class="spinner-border spinner-border-sm"></span>
                    Chargement...
                </div>
            </div>
            <div class="col-12 col-md-6 mb-3">
                <label for="collecteEnqueteur" class="form-label">Nom du contrôleur</label>
                <select class="form-select" id="collecteEnqueteur" name="enqueteur_personnel" v-model="tmpCollecte.enqueteur_personnel" :disabled="isReadonly('enqueteur_personnel')">
                    <option  v-for="(controleur) in personnels" :value="controleur.id" :key="controleur.id">{{controleur.cache_nom}}</option>
                </select>
            </div>
        </div>
    </div>

</template>

<script>
import { mapState } from 'vuex';
import { AssetsAssembler } from '../js/app/services/AssetsAssembler';

export default {
    props: {
        collecte: Object,
        personnels: Array,
        formulaires: Array,
        readonly: Array,
        veille: Boolean
    },

    data() {	
        return {
            tmpCollecte: null,
            operateurs: [],
            habilitations: [],
            inited: false,
            pending: {
                habilitations: false
            },
            formulaire: null,
            cible_personnel: null
        }
    },

    computed: {
        ...mapState(['projets']),

        currentFormTli() {
            let formulaire = this.getFormulaireById(this.formulaire);
            return formulaire?.tli;
        },

        /**
         * Retourne la liste des opérateurs par ordre alphabétique
         * 
         * @return {array}
         */
        sortedOperateurs() {
            let list = JSON.parse(JSON.stringify(this.operateurs));
            return list.sort(function (a, b) {
                if (a.cache_nom < b.cache_nom) {
                    return -1;
                }
                if (a.cache_nom > b.cache_nom) {
                    return 1;
                }
                return 0;
            });
        }
    },

    emits:['delete-collecte', 'update-collecte'],

    watch: {
        /**
         * Mise à jour de la collecte
         * 
         * @param {object} newVal Les nouvelles valeurs de la collecte
         */
        tmpCollecte: {
            handler(newVal) {
                this.$emit('update-collecte', newVal);
            },
            deep: true
        },

        /**
         * Modifie le formulaire sélectionné sur tmpCollecte
         * 
         * @param {number} newVal Formulaire sélectionné
         */
        async formulaire(newVal) {
            if (this.inited) {
                this.tmpCollecte.formulaire = newVal;
            }

            if (newVal) {
                let formulaire = this.getFormulaireById(newVal);

                if (formulaire.tli) {
                    this.pending.habilitations = true;

                    try {
                        this.habilitations = await this.$app.api.get('v2/controle/habilitation', {
                            habilitation_type_id: formulaire.tli,
                            active: 1
                        });

                        let assembler = new AssetsAssembler(this.habilitations);
                        await assembler.joinAsset(this.$assets.getCollection('personnels'), 'personnel_id', 'personnel');
                        this.operateurs = assembler.getResult('personnel');
                    }
                    catch (e) {
                        this.$app.catchError(e);
                    }
                    finally {
                        this.pending.habilitations = false
                    }

                }
                else {
                    this.operateurs = this.personnels;
                }
            }
            else {
                this.operateurs = this.personnels;
            }
        },

        /**
         * Modifie le personnel cible sélectionné et synchronise tmpCollecte
         * 
         * @param {number} newVal Nouveau personnel cible sélectionné
         */
        cible_personnel(newVal) {
            if (this.inited) {

                this.tmpCollecte.cible_personnel = newVal;

                let hab = this.getHabilitationByPersonnelId(newVal);
                this.tmpCollecte.tlc = hab ? "CharacteristicPersonnel" : null;
                this.tmpCollecte.tli = hab ? hab.id : null;
            }
        }
    },
    
    methods: {
        
        /**
         * Envoie un événement de suppression de la collecte
         */
        deleteCollecte() {
            this.$emit('delecte-collecte', this.collecte);
        },

        /**
         * Retourne true si le champ testé fait partie du tableau readonly
         * 
         * @param {string} field Le nom du champ à tester
         * 
         * @return {boolean}
         */
        isReadonly(field) {
            return this.readonly?.includes(field);
        },

        /**
         * Retourne un formulaire depuis son ID
         * 
         * @param {number} id L'ID du formulaire
         * 
         * @return {object}
         */
        getFormulaireById(id) {
            return this.formulaires.find(e => e.id == id);
        },

        /**
         * Retourne les informations d'une habilitation depuis l'ID d'un personnel
         * 
         * @param {number} id ID d'un personnel
         * 
         * @return {object}
         */
        getHabilitationByPersonnelId(id) {
            return this.habilitations.find(e => e.personnel_id == id);
        }
    
    },

    mounted() {
        this.tmpCollecte = JSON.parse(JSON.stringify(this.collecte));

        this.formulaire = this.tmpCollecte.formulaire;
        this.cible_personnel = this.tmpCollecte.cible_personnel;

        if (this.tmpCollecte.date) {
            let part = this.tmpCollecte.date.split(" ");
            this.tmpCollecte.date = part[0];
        }
        this.inited = true;
    },
}

</script>