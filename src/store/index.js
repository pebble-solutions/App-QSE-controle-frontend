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
    blocs: [],
    lignes: [],
    responses: [],
    formulaires: [],
    listActifs: [],
    habilitations: [],
    collectes: [],
    collecte: null,
    searchResults: [],
    projets: [],
    stat: null,
    requeteStat: null,
    veilleConfig: [],
    personnels: [],
    collectesCollection: [],
    statResult: [],
    echeancier: null,
    habilitationsCharacteristic: [],
    habilitationsTypes: [],
    habilitationsPersonnels: [],
    pending: {
      collectesCollection: true,
      habilitationsPersonnels: false,
      personnels: true,
      habilitationsCharacteristic: true,
      habilitationsTypes: true,
    },
  },
  getters: {
    activeStructure(state) {
      return state.structures.find(e => e.id === state.activeStructureId);
    },
    openedElementBlocs(state) {
      return state.blocs.filter(e => e.information__groupe_id === state.openedElement.id);
    },
    opendeElementLignes(state) {
      return state.lignes.filter(e => e.information__groupe_id === state.openedElement.id);
    }
  },
  mutations: {
    mkgConfig(state, payload) {
      state.mkg.config = payload;
    },
    setLogin(state, login) {
      state.login = login;
    },
    setStructures(state, structures) {
      state.structures = structures;
    },
    tmpElement(state, data) {
      state.tmpElement = data;
    },
    updateData(state, options) {
      options.data.forEach((element) => {
        let elFound = state[options.key].find(e => e.id === element.id);
        if (elFound) {
          for (let k in element) {
            elFound[k] = element[k];
          }
        } else {
          state[options.key].push(element);
        }
      });
    },
    setResponse(state, reponse) {
      let respIndex = state.responses.findIndex(e => e.question == reponse.question);
      if (respIndex === -1) {
        state.responses.push(reponse);
      } else {
        state.responses[respIndex] = reponse;
      }
    },
    responses(state, responses) {
      state.responses = responses;
    },
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
    setListActifs(state, data) {
      state.listActifs = data;
    },
    stat(state, data) {
      state.stat = data;
    },
    requeteStat(state, data) {
      state.requeteStat = data;
    },
    statResult(state, data) {
      state.statResult = data;
    },
    setEcheance(state, echeancier) {
      state.echeancier = echeancier;
    },
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
          } else {
            state.collectes.push(collecte);
          }
        })
      } else if (action == 'remove') {
        collectes.forEach(collecte => {
          let index = state.collectes.findIndex(e => e.id == collecte.id);
          if (index !== -1) {
            state.collectes.splice(index, 1);
          }
        });
      } else if (action == 'add') {
        state.collectes = state.collectes.concat(collectes);
      } else {
        state.collectes = collectes;
      }
    },
    openedElement(state, options) {
      let ressource = options.ressource;
      let id = options.id ?? null;
      if (!id) {
        state.openedElement = null;
      } else {
        let data = state[ressource].find(e => e.id == id);
        state.openedElement = data;
      }
    },
    collecte(state, collecteOptions) {
      const mode = collecteOptions.mode ? collecteOptions.mode : 'set';
      const collecte = collecteOptions.collecte;
      if (mode == 'refresh') {
        if (!state.collecte) {
          state.collecte = {};
        }
        for (const key in collecte) {
          state.collecte[key] = collecte[key];
        }
      } else if (mode == 'add') {
        for (const key in collecte) {
          state.collecte[key] = collecte[key];
        }
      } else if (mode == 'setHeaders') {
        const headers = ["enqueteur__structure__personnel_id", "cible__structure__personnel_id", "cible_nom", "enqueteur_nom",
          "date_start", "tlc", "tli", "previous_id", "previous_result"];
        headers.forEach(header => {
          if (typeof collecte[header] !== 'undefined') {
            state.collecte[header] = collecte[header];
          }
        });
      } else {
        state.collecte = collecte;
      }
    },
    setProjets(state, aProjets) {
      state.projets = aProjets;
    },
    setHabilitationType(state, habilitationType) {
      state.habilitationType = habilitationType;
    },
    setVeilleConfig(state, veilleConfig) {
      state.veilleConfig = veilleConfig;
    },
    formulaire(state, formulaire) {
      state.formulaire = formulaire;
    },
    searchResults(state, dataOptions) {
      let mode = dataOptions.mode ?? 'set';
      let data = dataOptions.data;
      if (mode == 'set') {
        state.searchResults = data;
      } else if (mode == 'add') {
        state.searchResults = state.searchResults.concat(data);
      } else {
        data.forEach(d => {
          let found = state.searchResults.find(e => e.id == d.id);
          if (found) {
            for (const key in d) {
              found[key] = d[key];
            }
          } else {
            state.searchResults.push(d);
          }
        });
      }
    },
    documentToCollecte(state, docOptions) {
      const document = docOptions.document;
      const mode = docOptions.mode ?? 'append';
      if (mode == 'set') {
        state.collecte.documents = [];
      } else if (mode == 'remove') {
        const index = state.collecte.documents.findIndex(e => e.id == document.id);
        if (index !== -1) {
          state.collecte.documents.splice(index, 1);
        }
      }
      if (['set', 'append'].includes(mode)) {
        state.collecte.documents.push(document);
      }
    }
  },
  actions: {
    refreshOpened(context, data) {
      context.commit('updateOpened', data);
    },
    login(context, payload) {
      context.commit('setLogin', payload.login);
      context.commit('setStructures', payload.structures);
    },
    logout(context) {
      context.commit('setLogin', null);
      context.commit('setStructures', []);
    },
    refreshLignes(context, payload) {
      context.commit('updateData', {
        key: 'lignes',
        data: payload
      });
    },
    refreshBlocs(context, payload) {
      context.commit('updateData', {
        key: 'blocs',
        data: payload
      });
    },
    refreshResponse(context, oReponse) {
      context.commit('setResponse', oReponse)
    },
    refreshFormulaires(context, data) {
      context.commit('setFormulaires', data);
    },
    refreshNbTodoFormulaires(context, data) {
      context.commit('setFormulaires', data);
    },
    refreshListActifs(context, data) {
      context.commit('setListActifs', data);
    },
    refreshHabilitationType(context, data) {
      context.commit('setHabilitationType', data);
    },
    refreshVeilleConfig(context, data) {
      context.commit('setVeilleConfig', data)
    },
    refreshCollectes(context, collectes) {
      context.commit('collectes', {
        collectes,
        action: 'refresh'
      });
    },
    setCollectes(context, collectes) {
      context.commit('collectes', {
        collectes,
        action: 'set'
      });
    },
    addCollectes(contexte, collectes) {
      contexte.commit('collectes', { collectes, action: 'add' })
    },
    updateCollectes(contexte, data) {
      contexte.commit('collectes', {
        action: 'update',
        key: 'collectes',
        data
      })
    },
    removeCollecte(context, collecte) {
      context.commit('collectes', {
        collectes: [collecte],
        action: 'remove'
      });
    },
    refreshStat(context, data) {
      context.commit('stat', data)
    },
    setRequete(context, data) {
      context.commit('requeteStat', data);
    },
    loadStatResult(context, data) {
      context.commit('statResult', data);
    },
    setEcheance(context, data) {
      context.commit('setEcheance', data)
    },
    loadFormulaire(context, formulaireId) {
      context.commit('openedElement', {
        ressource: 'formulaires',
        id: formulaireId
      });
    },
    loadCollecte(context, collecteId) {
      context.commit('openedElement', {
        ressource: 'collectes',
        id: collecteId
      });
    },
    setCollecte(contexte, collecte) {
      contexte.commit('collecte', { collecte, mode: 'set' })
    },
    setCollecteHeaders(contexte, collecte) {
      contexte.commit('collecte', { collecte, mode: 'setHeaders' });
      contexte.commit('collectes', {
        action: 'refresh',
        collectes: [collecte]
      })
    },
    refreshCollecte(contexte, collecte) {
      contexte.commit('collecte', { collecte, mode: 'refresh' });
    },
    refreshProjets(context, aProjets) {
      context.commit('setProjets', aProjets);
    },
    openFormulaire(context, formulaire_id) {
      if (!context.state.formulaires || !Array.isArray(context.state.formulaires)) {
        console.error('Formulaires is not an array or is null:', context.state.formulaires);
        return;
      }
      let formulaire = context.state.formulaires.find(e => e.id == formulaire_id);
      if (!formulaire) {
        console.error('Formulaire not found:', formulaire_id);
        return;
      }
      context.commit('formulaire', formulaire);
    },
    resetResponses(context) {
      context.commit('responses', []);
    },
    setSearchResults(context, data) {
      context.commit('searchResults', {
        mode: 'set',
        data
      });
    },
    addSearchResults(context, data) {
      context.commit('searchResults', {
        mode: 'add',
        data
      });
    },
    updateSearchResults(context, data) {
      context.commit('searchResults', {
        mode: 'update',
        data
      });
    },
    addDocumentToCollecte(context, document) {
      context.commit('documentToCollecte', {
        mode: 'append',
        document
      });
    },
    removeDocumentFromCollecte(context, document) {
      context.commit('documentToCollecte', {
        mode: 'remove',
        document
      });
    }
  },
  modules: {
  }
});
