<template>
    <div v-if="tmpCollecte">
        <div class="row g-2">
            <div v-if="!veille" class="col mb-3">
                <label for="collecteFormulaire" class="form-label">Type de contrôle</label>
                <select class="form-select" id="collecteFormulaire" name="formulaire" v-model="formulaire" required :disabled="isReadonly('formulaire')">
                    <option v-for="(form) in formulaires" :value="form.id" :key="form.id" >{{form.groupe}}</option>
                </select>
                <div class="text-danger mt-2" v-if="!currentFormTli && formulaire">
                    <i class="bi bi-exclamation-triangle-fill"></i>
                    Aucune habilitation n'est liée à ce type de contrôle. Les fonctions de veille 
                    ne seront pas disponibles.
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
                <select class="form-select" id="collecteCible" name="cible_personnel" v-model="cible_personnel" :disabled="isReadonly('cible_personnel')" v-if="!pending.personnels">
                    <option v-for="(agent) in sortedOperateurs" :value="agent.id" :key="'agent-'+agent.id"> {{agent.cache_nom}} </option>
                </select>
                <div class="text-secondary py-1" v-else>
                    <span class="spinner-border spinner-border-sm"></span>
                    Chargement...
                </div>
                <div class="text-success mt-2" v-if="formulaire && currentFormTli">
                    <i class="bi bi-check-circle-fill"></i>
                    La liste est restreinte aux opérateurs habilités
                </div>
                <div class="text-info mt-2" v-else>
                    <i class="bi bi-check-circle-fill"></i>
                    La liste des opérateurs est libre
                </div>
            </div>
            <div class="col-12 col-md-6 mb-3">
                <label for="collecteEnqueteur" class="form-label">Nom du contrôleur</label>
                <select class="form-select" id="collecteEnqueteur" name="enqueteur_personnel" v-model="tmpCollecte.enqueteur_personnel" :disabled="isReadonly('enqueteur_personnel')" v-if="!pending.personnels">
                    <option  v-for="(controleur) in controleurs" :value="controleur.id" :key="'controleur-'+controleur.id">
                        {{ controleur.cache_nom }}
                    </option>
                </select>
                <div class="text-secondary py-1" v-else>
                    <span class="spinner-border spinner-border-sm"></span>
                    Chargement...
                </div>
                
                <div class="text-success mt-2" v-if="veilleControleurs && currentFormTli">
                    <i class="bi bi-check-circle-fill"></i>
                    La liste est restreinte aux controleurs habilités
                </div>
                <div class="text-info mt-2" v-else>
                    <i class="bi bi-info-circle-fill"></i>
                    La liste des contrôleurs est libre
                </div>
                <span class="text-warning mt-2" v-if="!habControl && currentFormTli">
                    <i class="bi bi-exclamation-triangle-fill"></i>
                    Vous n'êtes pas habilité
                </span>
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
        veille: Boolean,
    },
    
    data() {	
        return {
            tmpCollecte: null,
            operateurs: [],
            controleurs: [],
            habilitations: [],
            inited: false,
            pending: {
                personnels: false
            },
            formulaire: null,
            cible_personnel: null,
            veilleControleurs: false,
            habControl: true,
            tlc: null,
            tli: null
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
            let list = [];

            this.operateurs.forEach(e => {
                if (typeof e === 'object' && e)  {
                    const found = list.find(o => o.id == e.id);
                    if (!found) {
                        list.push(e);
                    }
                }
            });

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
                    this.pending.personnels = true;

                    try {
                        this.habilitations = await this.$app.api.get('v2/controle/habilitation', {
                            habilitation_type_id: formulaire.tli,
                            active: 1
                        });
                        let personnelsCollection = this.$assets.getCollection('personnels');
                        let assembler = new AssetsAssembler(this.habilitations);
                        await assembler.joinAsset(personnelsCollection, 'personnel_id', 'personnel');
                        this.operateurs = assembler.getResult('personnel');
                        
                        let control = await this.$app.api.get('v2/controle/formulaire/'+formulaire.id+'/controleur');
                        if (control.restricted) {
                            if(this.tmpCollecte.enqueteur_personnel){
                                let controleur = this.controleurs.find(e => e.id == this.tmpCollecte.enqueteur_personnel);
                                if(!controleur){
                                    this.habControl = false
                                }
                            }
                            await personnelsCollection.load({
                                id: control.personnel_ids.join(',')
                            });
                            this.controleurs = personnelsCollection.collection.filter(e => control.personnel_ids.includes(e.id));
                            this.veilleControleurs = true
                        }
                        else {
                            this.controleurs = this.personnels
                            this.veilleControleurs= false
                            this.habControl=true
                            
                        }
                    }
                    catch (e) {
                        this.$app.catchError(e);
                    }
                    finally {
                        this.pending.personnels = false;
                    }

                }
                else {
                    this.operateurs = this.personnels;
                    this.controleurs = this.personnels;
                    this.veilleControleurs= false

                }
            }
            else {
                this.operateurs = this.personnels;
                this.controleurs = this.personnels;
                this.veilleControleurs= false

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
        
        
        
        if (this.tmpCollecte.date) {
            let part = this.tmpCollecte.date.split(" ");
            this.tmpCollecte.date = part[0];
        }
        this.inited = true;
    },
}

</script>