import { createStore } from 'vuex'

export default createStore({
	state: {
		structures: [],
		activeStructureId: null,
		login: null,
		mkg: {
			config: {
				THEME_COLOR: 'black'
			}
		},
		openedElement: null,
		tmpElement: null,
		blocs:[],
		lignes:[],
		responses:[],
		formulaires: [],
		listActifs: [],
		collectes: [],
		collecte: null,
		projetsActif: [],
		formulaire: null
	},
	getters: {
		activeStructure(state) {
			return state.structures.find(e => e.id === state.activeStructureId);
		},
		openedElementBlocs (state) {
			return state.blocs.filter(e => e.information__groupe_id === state.openedElement.id);
		},
		opendeElementLignes (state) {
			return state.lignes.filter(e => e.information__groupe_id === state.openedElement.id);
		}
	},
	mutations: {
		/**
		 * Met à jour les informations de configuration
		 * @param {Object} state Le state de l'instance VueX
		 * @param {Object} payload Les valeurs de configuration à écrire
		 */
		mkgConfig(state, payload) {
			state.mkg.config = payload;
		},

		/**
		 * Enregistre le login dans le store
		 * @param {Object} state Le state de l'instance vueX
		 * @param {Object} login L'objet Login
		 */
		setLogin(state, login) {
			state.login = login;
		},

		/**
		 * Enregistre les structures chargées dans le store
		 * @param {Object} state Le state de l'instance vueX
		 * @param {Array} structures La liste des structures
		 */
		setStructures(state, structures) {
			state.structures = structures;
		},

		/**
		 * Enregistre une donnée dubliqué de openedElement
		 * @param {Object} state Le state de l'instance vueX
		 * @param {Object} data Un objet identique à la structure de openedElement
		 */
		tmpElement(state, data) {
			state.tmpElement = data;
		},
		
		/** Met à jour les données stockées au niveau du state avec un tableau d'informations
		 * */

		updateData(state, options) {

			options.data.forEach((element) => {
			
				let elFound = state[options.key].find(e => e.id === element.id);
				if (elFound) {

					for (let k in element) {
				
						elFound[k] = element[k];
					}
				}
				else {
					state[options.key].push(element);
				}
			});
		},
		/**
		 * Met à jour les réponses  dans le store.
		 * 
		 * @param {object} state State de VueX
		 * @param {object} responses Informations à mettre à jour
		 */
		setResponses(state, responses) {
			let respIndex = state.responses.findIndex(e => e.question == responses.question);

			if (respIndex == -1){
				state.responses.push(responses);
			}
			else {
				state.responses[respIndex] = responses;
			}
		},

		/**
		 * Initialise le state responses avec une liste de reponse
		 * @param {Object} state State de VueX
		 * @param {Array} aResponses une liste de reponses
		 */
		initResponses(state, aResponses) {
			state.responses = [];

			aResponses.forEach(resp => {
				let itemResponse = {
					question: resp.ligne,
					reponse: resp.data,
					commentaire: resp.commentaire,
					bloc: ''
				};

				let question = state.collecte.formulaire.questions.find(question => question.id == resp.ligne && question.information__groupe_id == resp.groupe);

				itemResponse.bloc = question.information__bloc_id;

				state.responses.push(itemResponse);
			});
		},

		/**
		 * Enregistre les formulaires chargés dans le store
		 * @param {Object} state State de VueX
		 * @param {Array} forms tableau des formulaires
		 */
		setFormulaires(state, forms) {
			state.formulaires = forms;
		},

		/**
		 * Enregistre la liste des personnels actifs dans le store
		 * 
		 * @param {Object} state State de Vuex
		 * @param {Array} data Liste des personnels actifs
		 */
		setListActifs(state, data) {
			state.listActifs = data;
		},

		/**
		 * Met à jour la collection des collectes
		 * 
		 * @param {object} state State de VueX
		 * @param {object} collecteOptions 
		 * - action				'set', 'refresh', 'remove'
		 * - collectes			Liste des collectes
		 */
		collectes(state, collecteOptions) {
			let action = collecteOptions.action ?? 'set';
			let collectes = collecteOptions.collectes;

			if (action == 'refresh') {
				collectes.forEach(collecte => {
					let found = state.collectes.find(e => e.id == collecte.id);
					if (found) {
						for (const key in collecte) {
							found[key] = collecte[key];
						}
					}
					else {
						state.collectes.push(collecte);
					}
				})
			}
			else if (action == 'remove') {
				collectes.forEach(collecte => {
					let index = state.collectes.findIndex(e => e.id == collecte.id);
					if (index !== -1) {
						state.collectes.splice(index, 1);
					}
				});
			}
			else {
				state.collectes = collectes;
			}
		},


		/**
		 * Charge une ressource dans openedElement
		 * 
		 * @param {object} state State de vueX
		 * @param {object} options 
		 * - ressource {string} Le nom de la table de ressources
		 * - id {number} L'ID cible de la ressource
		 */
		openedElement(state, options) {
			let ressource = options.ressource;
			let id = options.id ?? null;

			if (!id) {
				state.openedElement = null;
			}
			else {
				let data = state[ressource].find(e => e.id == id);
				state.openedElement = data;
			}
		},

		/**
		 * Charge une collecte dans le store
		 * 
		 * @param {object} state Le state vueX
		 * @param {object} collecte La collecte à charger
		 */
		collecte(state, collecte) {
			state.collecte = collecte;
		},

		/**
		 * Enregistre les projets actifs
		 * @param {Object} state Le state de vueX
		 * @param {Array} aProjets Liste de projets actifs
	 	 */
		setProjetsActifs(state, aProjets) {
			state.projetsActif = aProjets;
		},

		/**
		 * Passe un formulaire en formulaire ouvert au niveau du state
		 * @param {object} state Le state de VueX
		 * @param {object} formulaire Le formulaire à charger
		 */
		formulaire(state, formulaire) {
			state.formulaire = formulaire;
		}
	
	},
	actions: {
		/**
		 * Met à jour les infos de l'élément ouvert avec des données
		 * @param {Object} context L'instance vueX
		 * @param {Object} data Liste clé valeur des informations à mettre à jour
		 */
		refreshOpened(context, data) {
			context.commit('updateOpened', data);
		},

		/**
		 * Enregistre l'ouverture d'une session
		 * @param {Object} context L'instance vueX
		 * @param {Object} payload Un objet contenant une clé login et une clé structure
		 */
		login(context, payload) {
			context.commit('setLogin', payload.login);
			context.commit('setStructures', payload.structures);
		},

		/**
		 * Enregistre la fermeture d'une session
		 * @param {Object} context L'instance vueX
		 */
		logout(context) {
			context.commit('setLogin', null);
			context.commit('setStructures', []);
		},
		/*
		@param (object) context l'instance VueX
		@
		*/
		refreshLignes (context, payload){
			context.commit ('updateData', {
				key:'lignes',
				data: payload
			});
		},
		refreshBlocs (context, payload){
			context.commit ('updateData', {
				key:'blocs',
				data: payload
			});
		},
		refreshResponse (context,oReponse) {
			context.commit ('setResponses', oReponse)
		},

		refreshFormulaires (context, data) {
			context.commit ('setFormulaires', data);
		},
		refreshListActifs(context, data) {
			context.commit('setListActifs', data);
		},
		
		/**
		 * Met à jours les collectes stockées au niveau du store
		 * 
		 * @param {object} context L'instance vueX
		 * @param {array} collectes Une liste de collectes
		 */
		refreshCollectes(context, collectes) {
			context.commit('collectes', {
				collectes,
				action: 'refresh'
			});
		},

		/**
		 * Remplace les collectes stockées dans le store
		 * 
		 * @param {object} context L'instance VueX
		 * @param {array} collectes Une liste de collectes
		 */
		setCollectes(context, collectes) {
			context.commit('collectes', {
				collectes,
				action: 'set'
			});
		},

		/**
		 * Retire une collecte du store.
		 * 
		 * @param {object} context L'instance VueX
		 * @param {object} collecte La collecte à retirer du store
		 */
		removeCollecte(context, collecte) {
			context.commit('collectes', {
				collectes: [collecte],
				action: 'remove'
			});
		},

		/**
		 * Charge un formulaire sur openedElement
		 * 
		 * @param {object} context Instance VueX
		 * @param {number} formulaireId Id du formulaire à charger
		 */
		loadFormulaire(context, formulaireId) {
			context.commit('openedElement', {
				ressource: 'formulaires',
				id: formulaireId
			});
		},

		/**
		 * Charge une collecte sur openedElement
		 * 
		 * @param {object} context Instance VueX
		 * @param {number} collecteId Id du collecte à charger
		 */
		loadCollecte(context, collecteId) {
			context.commit('openedElement', {
				ressource: 'collectes',
				id: collecteId
			});
		},

		/**
		 * Charge une collecte dans le store
		 * 
		 * @param {object} contexte L'instance vueX
		 * @param {object} collecte La collecte à charger dans le store
		 */
		setCollecte(contexte, collecte) {
			contexte.commit('collecte', collecte)
		},

		/**
		 * Ajout une liste de projets actifs dans le store
		 * @param {Object} context L'instance vueX
		 * @param {Array} aProjets Liste des projets actifs
		 */
		refreshProjetsActifs(context, aProjets) {
			context.commit('setProjetsActifs', aProjets);
		},

		/**
		 * Charge un formulaire depuis la liste des formulaires stockées.
		 * @param {object} context L'instance VueX
		 * @param {number} formulaire_id L'ID du formulaire existant dans la liste formulaires
		 */
		openFormulaire(context, formulaire_id) {
			let formulaire = context.state.formulaires.find(e => e.id == formulaire_id);
			context.commit('formulaire', formulaire);
		},
		
		/**
		 * initialisation du state responses en fonction de la collecte
		 * 
		 * @param {Object} context L'instance vueX'
		 * @param {Array} aResponses Liste des responses a initiliser
		*/
		initResp(context, aResponses) {
			context.commit('initResponses', aResponses)
		},
	},

	modules: {
	}
})
