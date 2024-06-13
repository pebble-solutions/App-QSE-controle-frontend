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

        <div v-if="formulaire">
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
                    <span class="text-warning mt-2" v-if="!isSelectedControleurHabilited">
                        <i class="bi bi-exclamation-triangle-fill"></i>
                        Vous n'êtes pas habilité
                    </span>
                </div>
            </div>
            <!-- TODO : Enleer le v-if si dessous -->
            <div class="mb-3 container" v-if="this.collectes[0]">
                <div class="row">
                    <label class="form-label col-3 mt-1" for="collecteBouclage">Controle de Bouclage</label>
                    <div class="form-check col-1 mt-1">
                        <input class="form-check-input" type="radio" name="flexRadioDefault" id="flexRadioDefault1" :disabled="!cible_personnel && this.collectes[0]" :checked="bouclage !== null" @change="bouclage = selectFirstOption();">

                        <label class="form-check-label" for="flexRadioDefault1">
                            Oui
                        </label>
                    </div>
                    <div class="form-check col-1 mt-1">
                        <input class="form-check-input" type="radio" name="flexRadioDefault" id="flexRadioDefault2" :checked="bouclage == null" @change="bouclage = null">
                        <label class="form-check-label" for="flexRadioDefault2">
                            Non
                        </label>
                    </div>
                    <select
                        class="form-select col w-50"
                        id="collecteCible"
                        name="cible_personnel"
                        v-model="bouclage"
                        :disabled="!bouclage"
                        ref="collecteCibleSelect"
                        >
                        <option
                            v-for="col in collectes"
                            :value="col.id"
                            :key="'collecte-' + col.id"
                        >
                            #{{ col.id }} : {{ getDisplayFormatedDate(col.date_done) }}
                        </option>
                    </select>
                </div>
            </div>
        </div>

    </div>

</template>

<script>
import { mapState } from 'vuex';
import { AssetsAssembler } from '../js/app/services/AssetsAssembler';
import { dateFormat } from '../js/date';

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
            collectes: [],
            inited: false,
            pending: {
                personnels: false,
                collectes: false
            },
            formulaire: null,
            cible_personnel: null,
            veilleControleurs: false,
            habControl: true,
            bouclage: null,
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
        },

        /**
         * Retourne true si le contrôleur sélectionné est habilité
         * 
         * Un contrôleur est habilité si il pocède une habilitation en lien avec le tli du formulaire 
         * ou si le formulaire ne nécessite pas d'habilitation
         * 
         * @return {bool}
         */
        isSelectedControleurHabilited() {
            return this.controleurs.find(e => e.id === this.tmpCollecte.enqueteur_personnel) ? true : false;
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
                            this.controleurs = personnelsCollection.getCollection().filter(e => control.personnel_ids.includes(e.id));
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
                this.getCollectes(newVal);
                this.tmpCollecte.cible_personnel = newVal;
                let hab = this.getHabilitationByPersonnelId(newVal);
                this.tmpCollecte.tlc = hab ? "CharacteristicPersonnel" : null;
                this.tmpCollecte.tli = hab ? hab.id : null;
            }
        },

        bouclage(newVal) {
            if (this.inited) {
                this.tmpCollecte.previous_id = newVal
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
        },

        /**
         * Retourne la liste des collectes depuis l'ID d'un personnel
         * 
         * @param {number} id ID d'un personnel
         * 
         * @return {object}
         */
        async getCollectes(operateurId){

            let options = {
                personnel_id__operateur: operateurId,
                information__groupe_id: this.formulaire,
                sans_bouclage: true,
                done: 'OUI'
            }

            this.pending.personnels = true;

            let tmpCollectes

            try {
                tmpCollectes = await this.$app.api.get('v2/collecte', options);
            }
            catch (e) {
                this.$app.catchError(e);
            }
            finally {
                this.collectes = tmpCollectes.reverse()
                this.pending.personnels = false;
            }
        },

        getDisplayFormatedDate(date){
            return dateFormat(date)
        },

        selectFirstOption() {
        this.$nextTick(() => {
            if (this.$refs.collecteCibleSelect) {
                if (this.collectes[0]) {
                    this.bouclage = this.collectes[0].id;
                }
            }
        });
    }
    
    },

    mounted() {
        this.tmpCollecte = JSON.parse(JSON.stringify(this.collecte))
        this.formulaire = this.tmpCollecte.formulaire
        this.cible_personnel = this.tmpCollecte.cible_personnel
        this.bouclage = this.tmpCollecte.previous_id
        
        if (this.tmpCollecte.date) {
            let part = this.tmpCollecte.date.split(" ");
            this.tmpCollecte.date = part[0];
        }
        this.inited = true;
    },
}

</script>