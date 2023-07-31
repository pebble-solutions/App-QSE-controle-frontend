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
            dd_done: null,
            df_done: null,
            stats_dd: null,
            stats_df: null,
            done: null,
            formulaire: searchParams.formulaire ?? null,
            projet_id: searchParams.projet_id ?? null
        };
    
        let url = `data/GET/${searchParams.mode}`;
        
        if (searchParams.mode == 'collecte') {
            query.dd_done = searchParams.dd;
            query.df_done = searchParams.df;
            query.done = 'OUI';
        }
        else {
            query.stats_dd = searchParams.dd;
            query.stats_df = searchParams.df;
        }
    
        return app.apiGet(url, query).then(data => resolve(data)).catch(error => reject(error));
    });


}