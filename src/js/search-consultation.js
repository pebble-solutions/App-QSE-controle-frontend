
var filtres = {
    environnement: 'private',
    start: 0,
    limit: null,
    dd_start: null,
    df_start: null,
    stats_dd: null,
    stats_df: null,
    done: null,
    formulaire: null,
    projet_id: null,
    result_var: null
};

/**
 * Effectue une recherche sur les collectes en mode collecte, formulaire ou projet
 * 
 * Retourne les données trouvées sur le serveur sous la forme d'une collection.
 * 
 * @param {object} searchParams 
 * - {string} dd            Date de début de recherche au format SQL
 * - {string} df            Date de fin de recherche au format SQL
 * - {string} mode          collecte, projet ou formulaire
 * - {number} start         Retourner les résultats depuis l'enregistrement numéro X
 * - {number} limit         Retourner maximum Y résultats depuis l'enregistrement X
 * - {number} formulaire    ID d'un formulaire limitant le retour
 * - {number} projet_id     ID d'un projet limitant le retour
 * - {array}  kns           Liste des valeur SAMI des controles filtrés 
 * @param {object} app Instance de AppJS
 * 
 * @returns {Promise<array>}
 */
export function searchConsultation(searchParams, app) {

    if (!searchParams.mode) {
        searchParams.mode = 'collecte';
    }

    return new Promise((resolve, reject) => {
        if (!['collecte', 'projet', 'formulaire','kn_wtbcl','ss_operateur','ss_controleur','operateur','controleur'].includes(searchParams.mode)) {
            throw new Error("Erreur dans le mode d'information sélectionné.");
        }
    
        let query = {
            environnement: 'private',
            start: searchParams.start ?? 0,
            limit: searchParams.limit ?? null,
            dd_start: null,
            df_start: null,
            stats_dd: null,
            stats_df: null,
            done: null,
            formulaire: searchParams.formulaire ?? null,
            projet_id: searchParams.projet_id ?? null,
            result_var: null
        };
    
        let url = `data/GET/${searchParams.mode}`;
        
        if (searchParams.mode == 'collecte') {
            query.dd_start = searchParams.dd;
            query.df_start = searchParams.df;
            query.done = 'OUI';
        }
        else if(searchParams.mode == 'kn_wtbcl'){
            query.dd_start = searchParams.dd;
            query.df_start = searchParams.df;
            query.result_var = searchParams.kns;
            query.following_id = 0;
        } else if (['operateur', 'controleur', 'ss_controleur', 'ss_operateur'].includes(searchParams.mode)) {
            query.dd_start = searchParams.dd;
            query.df_start = searchParams.df;
            filtres = query;
        }
        else {
            query.stats_dd = searchParams.dd;
            query.stats_df = searchParams.df;
        }
    
        return app.apiGet(url, query).then(data => resolve(data)).catch(error => reject(error));
    });

    
}

/**
 * Retourne les valeurs de la dernière recherche
 * 
 * @returns {Object} filtres
 */
export function returnFiltres() {
    return filtres;
}