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
		projets: [],
		stat: null,
		requeteStat: null,
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
		 * Met à jour une réponse dans le store
		 * 
		 * @param {object} state State de VueX
		 * @param {object} reponse Informations à mettre à jour
		 */
		setResponse(state, reponse) {
			let respIndex = state.responses.findIndex(e => e.question == reponse.question);

			if (respIndex === -1){
				state.responses.push(reponse);
			}
			else {
				state.responses[respIndex] = reponse;
			}
		},

		/**
		 * Défini la valeur des réponses.
		 * 
		 * @param {object} state Le state vueX
		 * @param {array} responses Collection de réponses
		 */
		responses(state, responses) {
			state.responses = responses;
		},

		/**
		 * Enregistre les formulaires chargés dans le store
		 * @param {Object} state State de VueX
		 * @param {Array|number} forms tableau des formulaires ou id d'un formulaire
		 */
		setFormulaires(state, forms) {
			if (typeof forms == 'number') {
				let find = state.formulaires.find((form) => form.id == forms);

				if (find) {
					find.nb_todo++;
				}

			} else {
				state.formulaires = forms;
			}
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
		 * Enregistre le résultat de la stat  dans le store
		 * @param {Object} state State de Vuex
		 * @param {Array} data List des éléménts de la stat demandée
		 */
		stat (state, data) {
			state.stat = data;
		},
		/**
		 * Enregistre la requete de statistique  dans le store
		 * @param {Object} state State de Vuex
		 * @param {Object} data List des éléménts de la requete
		 */
		requeteStat (state, data) {
			state.requeteStat = data;
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
		 * @param {object} collecteOptions 
		 * - collecte {object}
		 * - mode 'set' (défaut), 'refresh'
		 */
		collecte(state, collecteOptions) {
			const mode = collecteOptions.mode ? collecteOptions.mode : 'set';
			const collecte = collecteOptions.collecte;

			if (mode == 'refresh') {

				console.log('mode');
				if (!state.collecte) {
					console.log('creation');
					state.collecte = {};
				}

				for (const key in collecte) {
					state.collecte[key] = collecte[key];
				}

				console.log('mise à jour :', state.collecte);
			}
			else {
				state.collecte = collecte;
				console.log('set', state.collecte);
			}
		},

		/**
		 * Enregistre les projets actifs
		 * @param {Object} state Le state de vueX
		 * @param {Array} aProjets Liste de projets actifs
	 	 */
		setProjets(state, aProjets) {
			state.projets = aProjets;
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

		/**
		 * Met à jour les informations sur une réponse.
		 * 
		 * @param {object} context L'instance VueX
		 * @param {object} oReponse Objet contenant les informations d'une réponse
		 * - number question
		 * - string reponse
		 * - string commentaire
		 * - number bloc
		 */
		refreshResponse (context,oReponse) {
			context.commit ('setResponse', oReponse)
		},

		refreshFormulaires (context, data) {
			context.commit ('setFormulaires', data);
		},

		/**
		 * 
		 * @param {Object} context L'instance de vueX
		 * @param {number} data id du formulaire
		 */
		refreshNbTodoFormulaires (context, data) {
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
		 * enregistre dans le store les résultats de la stat demandée
		 * @param {Object} context 
		 * @param {Object} data 
		 */
		refreshStat(context,data) {
			context.commit('stat', data)
		},
		/**
		 * charge dans le store une requete de stat 
		 * @param {Object} context 
		 * @param {Object} data 
		 */
		setRequete(context,data) {
			context.commit('requeteStat', data)
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
			contexte.commit('collecte', { collecte, mode: 'set' })
		},

		/**
		 * Met à jour les informations de la collecte chargée dans le store
		 * 
		 * @param {object} contexte L'instance vueX
		 * @param {object} collecte La collecte à charger dans le store
		 */
		refreshCollecte(contexte, collecte) {
			console.log(collecte);
			contexte.commit('collecte', { collecte, mode: 'refresh' });
		},

		/**
		 * Ajout une liste de projets actifs dans le store
		 * @param {Object} context L'instance vueX
		 * @param {Array} aProjets Liste des projets actifs
		 */
		refreshProjets(context, aProjets) {
			context.commit('setProjets', aProjets);
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
		 * Réinitialise le tableau des réponses.
		 * 
		 * @param {object} context Instance VueX
		 */
		resetResponses(context) {
			context.commit('responses', []);
		}
	},

	modules: {
	}
})
